import { LegalDocumentPage } from "@/components/legal-document-page"
import { privacyPolicy } from "@/lib/privacy-policy"

export default function PrivacyPage() {
  return <LegalDocumentPage document={privacyPolicy} />
}
