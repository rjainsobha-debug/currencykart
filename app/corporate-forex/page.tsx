import { Building2 } from "lucide-react";
import { PremiumNavbar } from "@/components/PremiumNavbar";
import { LeadForm } from "@/components/LeadForm";
import { PublicPageHero } from "@/components/PublicPageHero";
import { MotionReveal } from "@/components/MotionReveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Corporate Travel Forex Assistance",
  description: "Coordinate employee travel-forex enquiries, document status and fulfilment workflows for businesses across Delhi NCR.",
  path: "/corporate-forex",
  keywords: ["corporate forex Delhi NCR", "business travel forex Gurgaon", "employee forex Noida"]
});

export default function CorporateForexPage() {
  return (
    <>
      <PremiumNavbar />
      <PublicPageHero eyebrow="Business travel desk" title="Corporate forex without operational clutter" copy="Coordinate employee travel, bulk requirements, assignment, notes and reporting through an account-managed workflow." icon={Building2} />
      <main className="section-shell grid gap-8 py-10 lg:grid-cols-[0.72fr_1.08fr]">
        <MotionReveal>
          <div className="rounded-lg bg-gradient-to-br from-navy to-[#12366d] p-7 text-white shadow-premium">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Account-managed</p>
            <h2 className="mt-3 text-2xl font-semibold">A structured desk for employee travel</h2>
            <p className="mt-4 leading-7 text-white/68">Centralise requirements, assigned staff, internal notes, KYC status, payment verification and fulfilment reporting.</p>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.1}><LeadForm title="Corporate enquiry" fields={["Company name", "Contact person", "Monthly travel volume", "Currency", "Amount", "Email"]} /></MotionReveal>
      </main>
    </>
  );
}
