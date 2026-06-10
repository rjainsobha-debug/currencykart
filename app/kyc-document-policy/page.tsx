import { PolicyPage } from "@/components/PolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "KYC and Document Policy",
  description: "Document requirements, review standards, secure uploads and customer responsibilities for travel-forex enquiries.",
  path: "/kyc-document-policy"
});

export default function KycDocumentPolicyPage() {
  return <PolicyPage eyebrow="Verification policy" title="KYC and Document Policy" introduction="Document requirements vary by service, travel purpose, customer profile, amount and fulfilment partner." sections={[
    { title: "Documents commonly requested", bullets: ["PAN and current address proof.", "Valid passport and relevant travel pages.", "Visa and confirmed travel ticket where applicable.", "University, employer, medical or other purpose-specific evidence.", "Existing card or transaction details for a reload request."] },
    { title: "Review standards", paragraphs: ["Documents must be valid, readable, complete and consistent with submitted information. Reviewers may request originals, clearer copies, additional pages or updated proof."] },
    { title: "Secure upload and access", paragraphs: ["Uploads should use private storage and time-limited signed links. Access is restricted to the customer and staff roles with a business need. Review and download events should be logged."] },
    { title: "Customer responsibility", bullets: ["Submit only genuine documents that belong to you or that you are authorised to provide.", "Do not conceal, alter or misrepresent material information.", "Notify support if a document or account may have been compromised."] },
    { title: "Rejection and retention", paragraphs: ["A document may be rejected with a reason. Records may be retained for statutory, contractual, fraud-prevention and audit periods, even where an enquiry is cancelled."] }
  ]} />;
}
