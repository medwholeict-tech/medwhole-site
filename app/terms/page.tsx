import { LegalDocumentPage } from "@/components/legal-document-page"
import { termsOfService } from "@/lib/terms-of-service"

export default function TermsPage() {
  return <LegalDocumentPage document={termsOfService} />
}
