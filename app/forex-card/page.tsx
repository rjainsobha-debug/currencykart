import { CreditCard } from "lucide-react";
import { PremiumNavbar } from "@/components/PremiumNavbar";
import { LeadForm } from "@/components/LeadForm";
import { PublicPageHero } from "@/components/PublicPageHero";
import { MotionReveal } from "@/components/MotionReveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Forex Card and Reload Assistance",
  description: "Request a new multi-currency forex card or reload assistance for eligible international travel through partner-led workflows.",
  path: "/forex-card",
  keywords: ["forex card Delhi", "forex card reload Gurgaon", "travel card Noida"]
});

export default function ForexCardPage() {
  return (
    <>
      <PremiumNavbar />
      <PublicPageHero eyebrow="Multi-currency travel card" title="Request a new forex card or reload" copy="A guided request flow for travel cards, reload assistance, KYC review and payment verification." icon={CreditCard} />
      <main className="section-shell grid gap-8 py-10 lg:grid-cols-[0.72fr_1.08fr]">
        <MotionReveal>
          <div className="rounded-lg bg-gradient-to-br from-navy to-[#174482] p-7 text-white shadow-premium">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Travel wallet</p>
            <h2 className="mt-3 text-2xl font-semibold">One request. Multiple currencies.</h2>
            <p className="mt-4 leading-7 text-white/68">Request support for card issuance or reload through structured partner workflows. Product availability and terms vary by provider.</p>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.1}><LeadForm title="Forex card request" fields={["Request type", "Currency", "Amount", "Travel country", "Travel date", "Phone"]} /></MotionReveal>
      </main>
    </>
  );
}
