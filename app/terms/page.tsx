import { PolicyPage } from "@/components/PolicyPage";
import { brand } from "@/config/brand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms and Conditions",
  description: `Terms governing enquiries, accounts, orders, rates, payments and partner-led services on ${brand.name}.`,
  path: "/terms"
});

export default function TermsPage() {
  return <PolicyPage eyebrow="Legal terms" title="Terms and Conditions" introduction={`These terms govern use of the ${brand.name} website and its enquiry, document, order-tracking and support features.`} sections={[
    { title: "Platform role", paragraphs: [`${brand.name} is currently a configurable platform brand. Unless verified licence details are published, the platform should be understood as facilitating enquiries and coordination with eligible authorised partners rather than independently conducting regulated money-changing activity.`] },
    { title: "Eligibility and permitted purpose", bullets: ["You must provide accurate identity, contact, travel and transaction information.", "A request may be declined where the purpose, documentation, location, amount or customer profile cannot be supported.", "Submitting an enquiry does not create an obligation to fulfil a transaction."] },
    { title: "Rates and availability", paragraphs: ["Website rates and calculator outputs are illustrative or indicative. A rate is binding only when expressly confirmed for a stated period and subject to the conditions in that confirmation."], bullets: ["Expired rate locks may require repricing.", "Currency denominations and delivery windows depend on availability.", "Taxes, partner charges or delivery charges must be disclosed before payment where applicable."] },
    { title: "KYC and documents", paragraphs: ["Customers must complete applicable KYC, AML and purpose-verification requirements. The platform or fulfilment partner may request additional information before approval."] },
    { title: "Payments and fulfilment", paragraphs: ["Payment instructions must be followed exactly. Orders are processed only after required approvals and payment verification. Delivery, pickup, card issuance and insurance assistance are subject to partner acceptance and serviceability."] },
    { title: "Acceptable use", bullets: ["Do not submit false, altered or third-party documents without authority.", "Do not use the platform for prohibited or unlawful purposes.", "Do not attempt to bypass authentication, rate limits or access controls."] },
    { title: "Liability and changes", paragraphs: ["Service interruptions, provider outages, market movement and regulatory requirements may affect an enquiry. These terms may be updated when products, providers or legal requirements change. Obtain legal review before publishing final launch terms."] }
  ]} />;
}
