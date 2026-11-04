import type { ReactNode } from "react"

type Node = { type?: string; text?: string; format?: number; tag?: string; listType?: string; url?: string; fields?: { url?: string }; children?: Node[] }

function renderNode(node: Node, index: number): ReactNode {
  if (typeof node.text === "string") {
    let text: ReactNode = node.text
    if ((node.format || 0) & 1) text = <strong>{text}</strong>
    if ((node.format || 0) & 2) text = <em>{text}</em>
    if ((node.format || 0) & 8) text = <u>{text}</u>
    if ((node.format || 0) & 16) text = <code>{text}</code>
    return <span key={index}>{text}</span>
  }
  const children = node.children?.map(renderNode)
  if (node.type === "linebreak") return <br key={index} />
  if (node.type === "heading") {
    if (node.tag === "h2") return <h2 key={index}>{children}</h2>
    if (node.tag === "h4") return <h4 key={index}>{children}</h4>
    return <h3 key={index}>{children}</h3>
  }
  if (node.type === "quote") return <blockquote key={index}>{children}</blockquote>
  if (node.type === "list") return node.listType === "number" ? <ol key={index}>{children}</ol> : <ul key={index}>{children}</ul>
  if (node.type === "listitem") return <li key={index}>{children}</li>
  if (node.type === "link" || node.type === "autolink") {
    const href = node.fields?.url || node.url || ""
    return /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(href) ? <a key={index} href={href}>{children}</a> : <span key={index}>{children}</span>
  }
  return <p key={index}>{children}</p>
}

export function CmsRichText({ value }: { value: unknown }) {
  if (!value || typeof value !== "object" || !("root" in value)) return null
  const root = (value as { root?: Node }).root
  return <>{root?.children?.map(renderNode)}</>
}
