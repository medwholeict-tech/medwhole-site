"use client"

import { useState } from "react"
import type { CmsCollection, CmsDocument } from "@/lib/cms/types"
import { Button } from "@/components/ui/button"

const workflowStatuses = ["new", "in_review", "replied", "resolved", "archived"]

function primaryValue(record: CmsDocument) {
  for (const field of ["subject", "fullName", "organisation", "email", "reference", "template"]) {
    const value = record[field]
    if (typeof value === "string" && value) return value
  }
  return `Record ${record.id}`
}

function dateLabel(value: unknown) {
  if (typeof value !== "string") return "—"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString()
}

export function SubmissionInbox({ collection, records }: { collection: CmsCollection; records: CmsDocument[] }) {
  const statuses = collection === "email-deliveries" ? ["queued", "sent", "failed", "retry"] : workflowStatuses
  const [items, setItems] = useState(records)
  const [pending, setPending] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  async function update(id: string, status: string) {
    setPending(id)
    setMessage("")
    try {
      const response = await fetch(`/api/admin/cms/private/${collection}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      if (!response.ok) throw new Error("Update failed")
      const updated = await response.json() as CmsDocument
      setItems((current) => current.map((item) => item.id === id ? updated : item))
      setMessage("Status saved.")
    } catch {
      setMessage("Could not save. Check the Payload role and connection, then retry.")
    } finally {
      setPending(null)
    }
  }

  if (!items.length) return <p className="py-8 text-sm text-graphite">No records in this inbox yet.</p>
  return <>
    {message && <p role="status" className="mb-3 text-sm text-graphite">{message}</p>}
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead><tr className="border-b border-grey-azure text-graphite"><th className="py-3 pr-4 font-medium">Record</th><th className="py-3 pr-4 font-medium">Email</th><th className="py-3 pr-4 font-medium">Received</th><th className="py-3 pr-4 font-medium">Status</th><th className="py-3 font-medium">Update</th></tr></thead>
        <tbody>{items.map((item) => <SubmissionRow key={item.id} item={item} statuses={statuses} pending={pending === item.id} onUpdate={(status) => update(item.id, status)} />)}</tbody>
      </table>
    </div>
  </>
}

function SubmissionRow({ item, statuses, pending, onUpdate }: { item: CmsDocument; statuses: string[]; pending: boolean; onUpdate: (status: string) => void }) {
  const current = typeof item.status === "string" && statuses.includes(item.status) ? item.status : "new"
  const [nextStatus, setNextStatus] = useState(current)
  return <tr className="border-b border-grey-azure/60 align-top last:border-0">
    <td className="py-4 pr-4"><div className="font-medium text-dark-azure">{primaryValue(item)}</div>{typeof item.message === "string" && <p className="mt-1 max-w-md whitespace-pre-wrap text-xs text-graphite">{item.message}</p>}</td>
    <td className="py-4 pr-4 text-graphite">{typeof item.email === "string" ? item.email : "—"}</td>
    <td className="py-4 pr-4 text-graphite">{dateLabel(item.submittedAt || item.createdAt)}</td>
    <td className="py-4 pr-4 capitalize text-graphite">{current.replaceAll("_", " ")}</td>
    <td className="py-4"><div className="flex items-center gap-2"><select aria-label={`Status for ${primaryValue(item)}`} className="h-9 rounded-md border border-grey-azure bg-white px-2" value={nextStatus} onChange={(event) => setNextStatus(event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select><Button size="sm" variant="outline" disabled={pending || current === nextStatus} onClick={() => onUpdate(nextStatus)}>{pending ? "Saving…" : "Save"}</Button></div></td>
  </tr>
}
