import { PolicyPage } from "@/components/PolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Refund and Cancellation Policy",
  description: "General cancellation, repricing and refund principles for forex enquiries and related travel-service requests.",
  path: "/refund-cancellation"
});

export default function RefundCancellationPage() {
  return <PolicyPage eyebrow="Order policy" title="Refund and Cancellation Policy" introduction="Cancellation and refund eligibility depends on the stage of review, rate confirmation, payment, partner processing and service fulfilment." sections={[
    { title: "Before rate confirmation", paragraphs: ["An enquiry may generally be withdrawn before a rate is confirmed and before a fulfilment partner incurs a charge."] },
    { title: "After rate lock or payment", paragraphs: ["Market-linked orders may be subject to repricing, cancellation charges or partner costs after a rate is locked or payment is initiated. The applicable amount should be disclosed before cancellation is accepted."] },
    { title: "Document or compliance rejection", paragraphs: ["If a request cannot proceed because KYC, permitted-purpose or partner requirements are not met, eligible funds received should be returned through the original or verified payment channel after deducting disclosed, non-recoverable charges where lawful."] },
    { title: "Delivery and card services", bullets: ["Missed delivery or inaccurate address details may result in rescheduling charges.", "Card issuance, reload and insurance-related cancellations remain subject to the relevant provider's terms.", "Completed or consumed services may not be refundable."] },
    { title: "Refund processing", paragraphs: ["Approved refunds should be recorded in the order timeline and processed to a verified source account. Processing time depends on banks and payment providers. Cash refunds should not be promised unless specifically permitted and operationally supported."] },
    { title: "Finalisation required", paragraphs: ["Replace this framework with actual charge tables, processing timelines and provider terms before accepting live payments."] }
  ]} />;
}
