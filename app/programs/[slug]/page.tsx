import { permanentRedirect } from "next/navigation"

import { legacyProgramRoutes } from "@/lib/legacy-program-routes.mjs"


export default async function LegacyProgramPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  permanentRedirect((legacyProgramRoutes as Record<string, string>)[params.slug] ?? "/our-work")
}
