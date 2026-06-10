import { Landmark, ShieldCheck, MapPin } from "lucide-react";
import { PremiumNavbar } from "@/components/PremiumNavbar";
import { PublicPageHero } from "@/components/PublicPageHero";
import { MotionReveal, MotionStagger, MotionItem } from "@/components/MotionReveal";
import { brand } from "@/config/brand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Our Delhi NCR Travel Forex Desk",
  description: "Learn about the platform's secure enquiry, KYC, order tracking and authorised-partner fulfilment approach.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <PremiumNavbar />
      <PublicPageHero eyebrow="About the platform" title={`A considered travel money experience for ${brand.cityFocus}`} copy="Built around secure request capture, clear status tracking, document review and partner-led fulfilment." icon={Landmark} />
      <main className="section-shell py-12">
        <MotionStagger className="grid gap-5 md:grid-cols-3">
          {[
            [ShieldCheck, "Compliance-aware", "Neutral wording, KYC-first workflows and explicit approval steps."],
            [MapPin, "NCR focused", "Service coordination designed around Delhi, Gurugram, Noida and wider NCR."],
            [Landmark, "Operationally clear", "Admin assignments, audit logs, rates, payments and document review."]
          ].map(([Icon, title, copy]) => (
            <MotionItem key={String(title)}>
              <div className="h-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <Icon className="text-royal" size={23} />
                <h2 className="mt-5 text-xl font-semibold text-navy">{String(title)}</h2>
                <p className="mt-3 leading-7 text-slate-600">{String(copy)}</p>
              </div>
            </MotionItem>
          ))}
        </MotionStagger>
        <MotionReveal className="mt-8 rounded-lg bg-navy p-7 text-white shadow-premium">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Compliance position</p>
          <p className="mt-4 max-w-4xl leading-7 text-white/70">{brand.complianceLine}</p>
        </MotionReveal>
      </main>
    </>
  );
}
