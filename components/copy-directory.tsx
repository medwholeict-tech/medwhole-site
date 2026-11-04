"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

export type DirectoryItem = {
  path: string; title: string; summary?: string; pillar: string; programme?: string;
  communities: string[]; status: string; date?: string; end?: string; time?: string; venue?: string; isFree?: boolean;
}
const fieldClass = "mt-2 min-h-11 w-full border border-grey-azure bg-white px-3 py-2 text-graphite focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine-teal"

export function CopyDirectory({ items, events = false }: { items: DirectoryItem[]; events?: boolean }) {
  const [pillar, setPillar] = useState("")
  const [community, setCommunity] = useState("")
  const [status, setStatus] = useState("")
  const [programme, setProgramme] = useState("")
  const [view, setView] = useState("list")
  const dates = items.flatMap((item) => item.date ? [item.date.slice(0, 7)] : []).sort()
  const [month, setMonth] = useState(dates.at(-1) || new Date().toISOString().slice(0, 7))
  const filtered = useMemo(() => items.filter((item) =>
    (!pillar || item.pillar === pillar) && (!community || item.communities.includes(community)) &&
    (!programme || item.programme === programme) && (!status || (status === "Past" ? item.status === "Completed" : status === "Upcoming" ? item.status !== "Completed" : item.status === status))
  ), [items, pillar, community, programme, status])
  const programmes = [...new Set(items.map((item) => item.programme).filter(Boolean))] as string[]
  function select(label: string, value: string, update: (value: string) => void, options: string[]) {
    return <label className="text-sm font-semibold text-dark-azure">{label}<select aria-label={label} className={fieldClass} value={value} onChange={(event) => update(event.target.value)}><option value="">All</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
  }
  const renderItem = (item: DirectoryItem) => <article key={item.path} className="min-w-0 border-t border-grey-azure py-6">
    <p className="text-sm text-pine-teal">{item.pillar} · {item.communities.join(", ")} · {item.status}</p>
    <h3 className="mt-3 font-sans text-xl font-bold text-dark-azure"><Link className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-pine-teal" href={item.path}>{item.title}</Link></h3>
    {item.date ? <p className="mt-3 text-sm"><time dateTime={item.date}>{new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" }).format(new Date(item.date))}</time>{item.end && item.end !== item.date ? ` – ${item.end}` : ""}{item.time ? ` · ${item.time}` : ""}</p> : null}
    {item.venue ? <p className="mt-2 text-sm">{item.venue}</p> : null}
    {item.programme ? <p className="mt-2 text-sm">{item.programme}</p> : null}
    {item.summary ? <p className="mt-3 text-base leading-7">{item.summary}</p> : null}
    {events ? <p className="mt-3 font-semibold text-pine-teal">{item.isFree ? "Free to attend" : "See event for cost"}</p> : null}
  </article>

  const firstDay = new Date(`${month}-01T12:00:00+01:00`)
  const days = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0).getDate()
  return <div>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {select("Pillar", pillar, setPillar, ["Health", "Literacy", "Empowerment"])}
      {events ? select("Programme", programme, setProgramme, programmes) : null}
      {select("Community", community, setCommunity, ["Gosa", "Kunyami", "Toge"])}
      {select("Status", status, setStatus, events ? ["Upcoming", "Past", "Running"] : ["Active", "In development"])}
    </div>
    {events ? <div className="mt-7 flex flex-wrap gap-4" role="group" aria-label="Event view">{["list", "calendar"].map((value) => <button key={value} type="button" aria-pressed={view === value} onClick={() => setView(value)} className={`min-h-11 border px-5 py-2 capitalize focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine-teal ${view === value ? "border-pine-teal bg-pine-teal text-white" : "border-grey-azure"}`}>{value}</button>)}</div> : null}
    <p className="mt-7 text-sm" role="status">{filtered.length} {events ? "events" : "programmes"}</p>
    {view === "calendar" && events ? <div className="mt-6">
      <label className="text-sm font-semibold">Month<input type="month" value={month} onChange={(event) => { if (event.target.value) setMonth(event.target.value) }} className={fieldClass} /></label>
      <div className="mt-6 grid grid-cols-7 border-l border-t border-grey-azure" aria-label="Calendar">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="border-b border-r border-grey-azure p-1 text-center text-xs font-bold sm:p-3">{day}</div>)}
        {Array.from({ length: firstDay.getDay() }, (_, index) => <div key={`blank-${index}`} className="border-b border-r border-grey-azure bg-parchment" />)}
        {Array.from({ length: days }, (_, index) => {
          const date = `${month}-${String(index + 1).padStart(2, "0")}`
          const dayEvents = filtered.filter((item) => item.date && item.date <= date && (item.end || item.date) >= date)
          return <div key={date} className="min-h-20 min-w-0 border-b border-r border-grey-azure p-1 sm:min-h-28 sm:p-3"><time dateTime={date} className="text-xs">{index + 1}</time>{dayEvents.map((item) => <Link key={item.path} href={item.path} className="mt-2 block break-words bg-parchment p-1 text-[10px] font-semibold text-pine-teal underline sm:text-xs"><span className="hidden sm:inline">{item.title}</span><span className="sm:hidden">{item.communities[0]}</span><span className="sr-only sm:not-sr-only"> {item.time}</span></Link>)}</div>
        })}
      </div>
      <div className="mt-6">{filtered.filter((item) => item.date?.slice(0, 7) === month).map(renderItem)}</div>
    </div> : <div className={`mt-6 ${events ? "" : "grid gap-x-10 md:grid-cols-2"}`}>{filtered.map(renderItem)}</div>}
  </div>
}
