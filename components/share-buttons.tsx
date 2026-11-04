"use client"

import { Facebook, Linkedin, Share2, Twitter } from "lucide-react"

const buttonClass =
  "inline-flex h-9 items-center gap-2 rounded-[4px] border border-grey-azure/50 bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-dark-azure transition-colors hover:border-pine-teal hover:text-pine-teal"

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      window.prompt("Copy this link", url)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        className={buttonClass}
      >
        <Facebook className="h-4 w-4" aria-hidden="true" />
        Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noreferrer"
        className={buttonClass}
      >
        <Twitter className="h-4 w-4" aria-hidden="true" />
        Twitter
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        className={buttonClass}
      >
        <Linkedin className="h-4 w-4" aria-hidden="true" />
        LinkedIn
      </a>
      <button type="button" onClick={copyLink} className={buttonClass}>
        <Share2 className="h-4 w-4" aria-hidden="true" />
        Copy Link
      </button>
    </div>
  )
}
