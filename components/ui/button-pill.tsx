import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type ButtonPillVariant = "amber" | "dark" | "outline" | "teal" | "parchment"

interface ButtonPillProps {
  href?: string
  onClick?: () => void
  children: ReactNode
  variant?: ButtonPillVariant
  className?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  "aria-label"?: string
  hideIcon?: boolean
}

/**
 * MedWHOLE Signature Split Button ("tengilemalama"):
 * - Distinctive split two-box design: text label box + square arrow container
 * - Hover micro-interaction: icon box morphs from rounded-[4px] to rounded-[14px]
 * - Arrow smoothly translates on hover
 * - Variants: amber, dark, outline, teal, parchment
 */
export function ButtonPill({
  href,
  onClick,
  children,
  variant = "dark",
  className,
  type = "button",
  disabled = false,
  "aria-label": ariaLabel,
  hideIcon = false,
}: ButtonPillProps) {
  const variantStyles: Record<ButtonPillVariant, { text: string; icon: string }> = {
    amber: {
      text: "bg-amber-flame text-prussian-blue group-hover:bg-dark-azure group-hover:text-white group-focus-visible:bg-dark-azure group-focus-visible:text-white",
      icon: "bg-amber-flame text-prussian-blue group-hover:bg-dark-azure group-hover:text-white group-focus-visible:bg-dark-azure group-focus-visible:text-white",
    },
    dark: {
      text: "bg-dark-azure text-white group-hover:bg-pine-teal group-focus-visible:bg-pine-teal",
      icon: "bg-dark-azure text-white group-hover:bg-pine-teal group-focus-visible:bg-pine-teal",
    },
    outline: {
      text: "border border-current bg-transparent text-inherit group-hover:border-prussian-blue group-hover:bg-prussian-blue group-hover:text-white group-focus-visible:border-prussian-blue group-focus-visible:bg-prussian-blue group-focus-visible:text-white",
      icon: "border border-current bg-transparent text-inherit group-hover:border-prussian-blue group-hover:bg-prussian-blue group-hover:text-white group-focus-visible:border-prussian-blue group-focus-visible:bg-prussian-blue group-focus-visible:text-white",
    },
    teal: {
      text: "bg-pine-teal text-white group-hover:bg-dark-azure group-focus-visible:bg-dark-azure",
      icon: "bg-pine-teal text-white group-hover:bg-dark-azure group-focus-visible:bg-dark-azure",
    },
    parchment: {
      text: "bg-parchment text-prussian-blue border border-grey-azure/50 group-hover:border-pine-teal group-hover:text-pine-teal group-focus-visible:border-pine-teal",
      icon: "bg-parchment text-prussian-blue border border-grey-azure/50 group-hover:border-pine-teal group-hover:text-pine-teal group-focus-visible:border-pine-teal",
    },
  }

  const vStyles = variantStyles[variant] || variantStyles.dark

  const wrapperClasses = cn(
    "group inline-flex items-center gap-1 font-content outline-none focus-visible:ring-2 focus-visible:ring-amber-flame focus-visible:ring-offset-2 transition-transform duration-200 active:scale-[0.98]",
    disabled && "pointer-events-none opacity-50",
    className
  )

  const content = (
    <>
      <span
        className={cn(
          "inline-flex h-8 sm:h-9 items-center justify-center rounded-[4px] px-3 sm:px-3.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-350 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:rounded-full group-focus-visible:rounded-full",
          vStyles.text
        )}
      >
        {children}
      </span>
      {!hideIcon && (
        <span
          aria-hidden="true"
          className={cn(
            "relative inline-flex size-8 sm:size-9 items-center justify-center overflow-hidden rounded-[4px] transition-all duration-350 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:rounded-full group-focus-visible:rounded-full",
            vStyles.icon
          )}
        >
          <ArrowRight
            className="size-3.5 sm:size-4 transition-transform duration-350 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:translate-x-6"
            aria-hidden="true"
          />
          <ArrowRight
            className="absolute size-3.5 sm:size-4 -translate-x-6 transition-transform duration-350 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:translate-x-0"
            aria-hidden="true"
          />
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={wrapperClasses} aria-label={ariaLabel} data-no-transition>
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={wrapperClasses}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  )
}
