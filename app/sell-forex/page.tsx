import { HandCoins, ShieldCheck } from "lucide-react";
import { PremiumNavbar } from "@/components/PremiumNavbar";
import { LeadForm } from "@/components/LeadForm";
import { KycUploadBox } from "@/components/KycUploadBox";
import { PublicPageHero } from "@/components/PublicPageHero";
import { MotionReveal } from "@/components/MotionReveal";
import { ServiceAreas } from "@/components/ServiceAreas";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sell Foreign Currency in Delhi NCR",
  description: "Request review and eligible pickup assistance for unused foreign currency in Delhi, Gurgaon, Noida, Faridabad and Ghaziabad.",
  path: "/sell-forex",
  keywords: ["sell foreign currency Delhi", "currency exchange Gurgaon", "sell forex Noida"]
});

export default function SellForexPage() {
  return (
    <>
      <PremiumNavbar />
      <PublicPageHero eyebrow="Return travel" title="Sell unused foreign currency with confidence" copy="Share the currency, amount and pickup location. Every request remains subject to document checks and admin approval." icon={HandCoins} />
      <main className="section-shell grid gap-8 py-10 lg:grid-cols-[1.08fr_0.72fr]">
        <MotionReveal><LeadForm title="Request a currency pickup" fields={["Currency", "Amount", "Pickup location", "Name", "Phone", "Email"]} /></MotionReveal>
        <MotionReveal delay={0.1} className="grid content-start gap-5">
          <KycUploadBox />
          <div className="rounded-lg bg-gradient-to-br from-navy to-[#12366d] p-6 text-white shadow-premium">
            <ShieldCheck className="text-gold" size={24} />
            <h2 className="mt-4 text-xl font-semibold">Approval before pickup</h2>
            <p className="mt-3 text-sm leading-6 text-white/68">The operations team reviews documents, currency condition, availability and applicable requirements before assignment.</p>
          </div>
        </MotionReveal>
      </main>
      <ServiceAreas />
    </>
  );
}
