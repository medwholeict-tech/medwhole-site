import { faithAccessStatement } from "@/lib/website-copy"

export function FaithAccessStatement({ inverted = false }: { inverted?: boolean }) {
  return (
    <p
      className={
        inverted
          ? "max-w-3xl border-l-2 border-amber-flame pl-5 text-lg leading-8 text-white"
          : "max-w-3xl border-l-2 border-amber-flame pl-5 text-lg leading-8 text-dark-azure"
      }
    >
      {faithAccessStatement}
    </p>
  )
}

