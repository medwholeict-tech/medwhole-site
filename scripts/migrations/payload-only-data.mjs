import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { neon } from '@neondatabase/serverless'
import { toLexical, publicDetails } from '../lib/content-mapping.mjs'

const args=process.argv.slice(2)
const sourcePath=args[args.indexOf('--source')+1]
if(!args.includes('--source')||!sourcePath)throw new Error('Pass --source <export.ndjson>; add --apply only after backup and schema migration.')
if(!process.env.DATABASE_URL)throw new Error('Use the dedicated CMS DATABASE_URL, for example with node --env-file=cms/.env.local.')
const source=(await fs.readFile(sourcePath,'utf8')).trim().split('\n').map(line=>JSON.parse(line))
// Editorial drafts are already represented by native records. Operational drafts
// can contain unique submissions and must remain in the private archive.
const operationalTypes=new Set(['contactSubmission','volunteerApplication','partnershipApplication','newsletter','eventRegistration','donationIntent','donationPayment'])
const documents=source.filter(doc=>!doc._id.startsWith('drafts.')||operationalTypes.has(doc._type))
const sourceCounts={}
for(const doc of documents)sourceCounts[doc._type]=(sourceCounts[doc._type]||0)+1
const sql=neon(process.env.DATABASE_URL)
const targets={program:'programmes',event:'events',news:'news',community:'communities',impactStory:'impact_stories',team:'team_members',partner:'partners',resource:'resources',job:'jobs'}
const inboxes={contactSubmission:'contact_submissions',volunteerApplication:'volunteer_applications',partnershipApplication:'partnership_applications',newsletter:'newsletter_subscribers',eventRegistration:'event_registrations',donationIntent:'donation_intents',donationPayment:'donation_payments'}
const eligible=documents.filter(doc=>targets[doc._type]||inboxes[doc._type])
console.log(JSON.stringify({mode:args.includes('--apply')?'apply':'preview',sourceCounts,editorial:eligible.filter(doc=>targets[doc._type]).length,operational:eligible.filter(doc=>inboxes[doc._type]).length}))
if(!args.includes('--apply'))process.exit(0)

const before={}
for(const table of [...Object.values(targets),...Object.values(inboxes),'media']){
  before[table]=await sql.query(`SELECT * FROM medwhole_cms.${table}`)
}
const backup=path.resolve('tmp/migration/payload-before-import.json')
await fs.mkdir(path.dirname(backup),{recursive:true})
// Preserve the first pre-import snapshot on repeat runs.
await fs.writeFile(backup,JSON.stringify(before),{mode:0o600,flag:'wx'}).catch(error=>{if(error.code!=='EEXIST')throw error})

const referenced=new Set()
function collect(value){
  if(!value||typeof value!=='object')return
  if(typeof value._ref==='string'&&value._ref.startsWith('image-'))referenced.add(value._ref)
  for(const child of Object.values(value))if(Array.isArray(child))child.forEach(collect);else collect(child)
}
for(const doc of documents)if(['event','news'].includes(doc._type)&&doc.isActive!==false)collect(doc)
const assets=documents.filter(doc=>referenced.has(doc._id))
const images={}
for(const asset of assets){
  const url=new URL(asset.url)
  if(url.protocol!=='https:'||url.hostname!=='cdn.sanity.io')throw new Error('Unexpected source image location')
  url.searchParams.set('dlRaw','original')
  const ext=asset.extension?.toLowerCase()
  if(!['jpg','jpeg','png','webp','gif','avif'].includes(ext))throw new Error('Unexpected public image format')
  const filename=`${asset.sha1hash}.${ext}`
  const target=path.resolve('public/images/content',filename)
  await fs.mkdir(path.dirname(target),{recursive:true})
  let bytes=await fs.readFile(target).catch(error=>{if(error.code!=='ENOENT')throw error;return null})
  if(!bytes){
    if(!process.env.MIGRATION_ASSET_TOKEN)throw new Error('Set MIGRATION_ASSET_TOKEN for authenticated original-asset download during this one-time import.')
    const result=await fetch(url,{headers:{Authorization:`Bearer ${process.env.MIGRATION_ASSET_TOKEN}`},signal:AbortSignal.timeout(30000)})
    if(!result.ok)throw new Error('Source image download failed')
    bytes=Buffer.from(await result.arrayBuffer())
    if(bytes.length>20*1024*1024)throw new Error('Source image too large')
  }
  if(createHash('sha1').update(bytes).digest('hex')!==asset.sha1hash)throw new Error('Source image checksum mismatch')
  await fs.writeFile(target,bytes)
  images[asset._id]={url:`/images/content/${filename}`}
}

const operations=[]
let editorialCount=0,operationCount=0
const statuses=new Set(['new','in_review','replied','resolved','archived'])
for(const doc of eligible){
  const table=targets[doc._type]
  if(table){
    const existing=before[table].find(row=>row.source_id===doc._id)
    if(!existing)throw new Error(`Editorial record has no migrated target: ${doc._type}`)
    const details=JSON.stringify(publicDetails(doc,images))
    const content=JSON.stringify(toLexical(doc.content||[]))
    operations.push(sql.query(`UPDATE medwhole_cms.${table} SET details=COALESCE(details,$1::jsonb),content=COALESCE(content,$2::jsonb) WHERE id=$3`,[details,content,existing.id]))
    operations.push(sql.query(`UPDATE medwhole_cms._${table}_v SET version_details=COALESCE(version_details,$1::jsonb),version_content=COALESCE(version_content,$2::jsonb) WHERE parent_id=$3 AND latest=true`,[details,content,existing.id]))
    editorialCount++;continue
  }
  const inbox=inboxes[doc._type]
  const record={external_id:doc._id,details:JSON.stringify({importedRecord:doc}),status:statuses.has(doc.status)?doc.status:'new',submitted_at:doc.submittedAt||doc.subscribedAt||doc._createdAt,created_at:doc._createdAt,updated_at:doc._updatedAt,source_page:doc.sourcePath||doc.source||null,consent:doc.consent===true}
  if(doc._type==='contactSubmission')Object.assign(record,{full_name:doc.name,email:doc.email,phone:doc.phone||null,subject:doc.subject,message:doc.message})
  if(doc._type==='volunteerApplication')Object.assign(record,{full_name:doc.fullName,email:doc.email,phone:doc.phone||null,location:JSON.stringify(doc.location||null),areas_of_interest:JSON.stringify(doc.areasOfInterest||[]),skills:JSON.stringify(doc.skills||[]),motivation:doc.motivation})
  if(doc._type==='partnershipApplication')Object.assign(record,{full_name:doc.contactPerson?.name||doc.organizationName,email:doc.contactPerson?.email,organisation:doc.organizationName,phone:doc.contactPerson?.phone||null,partnership_type:doc.organizationType||'',message:doc.proposedCollaboration})
  if(doc._type==='newsletter')Object.assign(record,{email:doc.email,name:doc.name||null,confirmed_at:doc.subscribedAt||doc._createdAt,unsubscribed_at:doc.unsubscribedAt||null,interests:JSON.stringify(doc.interests||[]),status:doc.status==='unsubscribed'?'unsubscribed':'active'})
  if(doc._type==='eventRegistration'){
    const event=before.events.find(event=>event.source_id===doc.event?._ref)
    Object.assign(record,{full_name:doc.contactName||null,email:doc.contactEmail||null,event_id:event?.id||null,phone:doc.phone||null,form_data:JSON.stringify(doc.formData?.data||doc.formData||null)})
    if(!doc.contactName||!doc.contactEmail||!event)Object.assign(record,{status:'archived',internal_notes:'Imported incomplete source record. Original data is retained in details; no missing contact or event data has been invented.'})
  }
  if(doc._type==='donationIntent')Object.assign(record,{reference:doc.reference,full_name:doc.fullName,email:doc.email||null,phone:doc.phone||null,amount:String(doc.amount),currency:doc.currency,frequency:doc.frequency,programme:doc.programme,country:doc.country||null,designation:doc.designation||null,expected_transfer_date:doc.expectedTransferDate||null,email_status:doc.emailStatus||'not-requested',status:doc.status==='instructions-sent'?'instructions-sent':record.status})
  if(doc._type==='donationPayment')Object.assign(record,{reference:doc.reference,parent_reference:doc.parentReference||null,amount_minor:doc.amount,currency:doc.currency,provider_status:doc.status||'pending',full_name:doc.fullName,email:doc.email,frequency:doc.frequency||'one-off',designation:doc.designation||null,community:doc.community||null,plan_code:doc.planCode||null,receipt_sent:doc.receiptSent===true,paid_at:doc.paidAt||null,status:['pending','paid','failed','cancelled'].includes(doc.status)?doc.status:'pending'})
  const keys=Object.keys(record)
  const values=keys.map(key=>record[key]??null)
  const query=`INSERT INTO medwhole_cms.${inbox} (${keys.map(key=>`"${key}"`).join(',')}) VALUES (${keys.map((_,i)=>`$${i+1}`).join(',')}) ON CONFLICT (external_id) DO NOTHING`
  operations.push(sql.query(query,values));operationCount++
}
await sql.transaction(operations)
const checks={}
for(const [type,table]of Object.entries(inboxes)){
  const expected=eligible.filter(doc=>doc._type===type).map(doc=>doc._id)
  const actual=await sql.query(`SELECT external_id FROM medwhole_cms.${table} WHERE external_id IS NOT NULL`)
  const ids=new Set(actual.map(row=>row.external_id))
  const missing=expected.filter(id=>!ids.has(id))
  checks[table]={expected:expected.length,matched:expected.length-missing.length}
  if(missing.length)throw new Error(`Migration verification failed for ${table}`)
}
await fs.writeFile('tmp/migration/reconciliation.json',JSON.stringify({editorialCount,operationCount,mirroredImages:assets.length,checks},null,2))
console.log(JSON.stringify({editorialCount,operationCount,mirroredImages:assets.length,checks,verified:true}))
