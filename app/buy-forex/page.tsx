import { Banknote, CheckCircle2 } from "lucide-react";
import { PremiumNavbar } from "@/components/PremiumNavbar";
import { LeadForm } from "@/components/LeadForm";
import { KycUploadBox } from "@/components/KycUploadBox";
import { PublicPageHero } from "@/components/PublicPageHero";
import { MotionReveal } from "@/components/MotionReveal";
import { ServiceAreas } from "@/components/ServiceAreas";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Buy Foreign Currency in Delhi NCR",
  description: "Submit a foreign-currency enquiry for international travel with KYC guidance and eligible doorstep coordination across Delhi NCR.",
  path: "/buy-forex",
  keywords: ["buy foreign currency Delhi", "forex Gurgaon", "foreign exchange Noida"]
});

export default function BuyForexPage() {
  return (
    <>
      <PremiumNavbar />
      <PublicPageHero eyebrow="Travel currency" title="Buy foreign currency with a guided review" copy="Get an indicative estimate, prepare your documents and coordinate eligible Delhi NCR delivery after verification." icon={Banknote} />
      <main className="section-shell grid gap-8 py-10 lg:grid-cols-[1.08fr_0.72fr]">
        <MotionReveal><LeadForm title="Build your forex request" fields={["Currency", "Amount", "Purpose of travel", "Destination country", "Travel date", "Delivery address"]} /></MotionReveal>
        <MotionReveal delay={0.1} className="grid content-start gap-5">
          <div className="rounded-lg bg-gradient-to-br from-navy to-[#12366d] p-6 text-white shadow-premium">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Indicative estimate</p>
            <p className="mt-3 text-3xl font-semibold">INR 84.95 / USD</p>
            <p className="mt-3 text-sm leading-6 text-white/66">Final rate is confirmed only after KYC, availability and admin verification.</p>
          </div>
          <KycUploadBox />
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-navy">Typical document checklist</h2>
            {["PAN", "Passport", "Visa or confirmed ticket", "Address and purpose documents"].map((item) => (
              <p key={item} className="mt-3 flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 size={15} className="text-emerald" />{item}</p>
            ))}
          </div>
        </MotionReveal>
      </main>
      <ServiceAreas />
    </>
  );
}
