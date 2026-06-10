import { PolicyPage } from "@/components/PolicyPage";
import { brand } from "@/config/brand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${brand.name} collects, uses, stores and shares account, KYC, order and support information.`,
  path: "/privacy"
});

export default function PrivacyPage() {
  return <PolicyPage eyebrow="Data protection" title="Privacy Policy" introduction="This policy explains how information is handled when you create an account, submit an enquiry, upload documents or contact support." sections={[
    { title: "Information collected", bullets: ["Name, email, phone number and account credentials.", "PAN, passport, visa, ticket, address and purpose-related information where required.", "Order, payment-reference, support, notification and audit information.", "Device, IP address, session and security-event information."] },
    { title: "How information is used", bullets: ["To authenticate users and secure accounts.", "To evaluate enquiries, perform KYC and coordinate fulfilment.", "To verify payments, provide status updates and respond to support requests.", "To prevent misuse, maintain audit records and comply with legal obligations."] },
    { title: "Sharing", paragraphs: ["Information may be shared with eligible authorised forex partners, payment providers, insurers, communications vendors, storage providers, professional advisers and authorities where necessary and lawful. Data should not be sold for unrelated advertising."] },
    { title: "Storage and security", paragraphs: ["Sensitive documents should be stored privately with short-lived signed access. Access must be role-restricted and logged. No internet service can guarantee absolute security, but reasonable technical and organisational controls should be maintained."] },
    { title: "Retention and rights", paragraphs: ["Records may be retained for operational, contractual, audit and legal periods applicable to the transaction. Customers may request correction or account assistance using the published support contact, subject to mandatory retention requirements."] },
    { title: "Launch requirement", paragraphs: [`Before launch, ${brand.legalName} should complete a legal review, publish the final registered address and grievance contact, and align this policy with its actual processors and retention schedule.`] }
  ]} />;
}
