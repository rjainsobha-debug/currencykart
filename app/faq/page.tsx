import { CircleHelp } from "lucide-react";
import { PremiumNavbar } from "@/components/PremiumNavbar";
import { FAQAccordion } from "@/components/FAQAccordion";
import { PublicPageHero } from "@/components/PublicPageHero";
import { MotionReveal } from "@/components/MotionReveal";
import { StructuredData } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Travel Forex FAQ",
  description: "Answers about foreign currency enquiries, KYC documents, rate confirmation, delivery, payments and compliance.",
  path: "/faq"
});

export default function FAQPage() {
  return (
    <>
      <PremiumNavbar />
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Can I buy forex online?", acceptedAnswer: { "@type": "Answer", text: "You can submit an enquiry online. Fulfilment is subject to KYC, permitted purpose, availability and acceptance by an eligible authorised partner." } },
          { "@type": "Question", name: "Are website rates final?", acceptedAnswer: { "@type": "Answer", text: "No. Displayed rates are illustrative or indicative until a time-limited rate confirmation is issued after review." } },
          { "@type": "Question", name: "Which documents may be required?", acceptedAnswer: { "@type": "Answer", text: "PAN, passport, ticket, visa, address proof and purpose-specific documents may be requested depending on the transaction." } }
        ]
      }} />
      <PublicPageHero eyebrow="Help centre" title="Straight answers before you travel" copy="Understand forex requests, KYC, delivery, payment, insurance assistance and compliance basics." icon={CircleHelp} />
      <main className="section-shell max-w-5xl py-12">
        <MotionReveal><FAQAccordion /></MotionReveal>
      </main>
    </>
  );
}
