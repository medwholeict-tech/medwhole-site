/** Convert the exported block format once into native Lexical content. */
export function toLexical(blocks = []) {
  const children = []
  for (const block of blocks) {
    if (block._type !== 'block') continue
    const spans = (block.children || []).map(span => {
      const marks = span.marks || []
      const text = { type: 'text', version: 1, text: span.text || '', format: (marks.includes('strong') ? 1 : 0) | (marks.includes('em') ? 2 : 0) | (marks.includes('underline') ? 8 : 0) | (marks.includes('code') ? 16 : 0), detail: 0, mode: 'normal', style: '' }
      const link = (block.markDefs || []).find(mark => marks.includes(mark._key) && mark._type === 'link')
      return link && /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(link.href || '')
        ? { type: 'link', version: 3, children: [text], direction: null, format: '', indent: 0, fields: { linkType: 'custom', url: link.href, newTab: false } }
        : text
    })
    const node = { type: /^h[1-6]$/.test(block.style) ? 'heading' : block.style === 'blockquote' ? 'quote' : 'paragraph', version: 1, children: spans, direction: null, format: '', indent: 0, ...( /^h[1-6]$/.test(block.style) ? { tag: block.style === 'h1' ? 'h2' : block.style } : {}) }
    if (block.listItem) {
      const listType = block.listItem === 'number' ? 'number' : 'bullet'
      let list = children.at(-1)
      if (list?.type !== 'list' || list.listType !== listType) {
        list = { type: 'list', version: 1, listType, tag: listType === 'number' ? 'ol' : 'ul', start: 1, direction: null, format: '', indent: 0, children: [] }
        children.push(list)
      }
      list.children.push({ ...node, type: 'listitem', value: list.children.length + 1 })
    } else children.push(node)
  }
  return children.length ? { root: { type: 'root', version: 1, children, direction: null, format: '', indent: 0 } } : null
}

export function publicDetails(document, images) {
  const image = value => {
    const asset = images[value?.asset?._ref]
    return asset ? { url: asset.url, alt: value.alt || asset.alt || document.title || '', caption: value.caption } : undefined
  }
  const keys = ['description','excerpt','status','showTime','schedule','venue','isFree','price','currency','capacity','requiresRegistration','registrationType','registrationForm','registrationDeadline','organizer','contactEmail','contactPhone','communityContext','whyItMatters','participation','closingReflection','impactFigures','programmePath','community','relatedPath']
  const details = Object.fromEntries(keys.filter(key => document[key] !== undefined).map(key => [key, document[key]]))
  details.publicImage = image(document.featuredImage)
  if (document.storyMoments) details.storyMoments = document.storyMoments.map(moment => ({ id: moment._key, title: moment.title, caption: moment.caption, image: image(moment.image) })).filter(moment => moment.image)
  return details
}
