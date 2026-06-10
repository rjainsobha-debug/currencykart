import { Headphones, MapPin, MessageCircle, Phone } from "lucide-react";
import { PremiumNavbar } from "@/components/PremiumNavbar";
import { LeadForm } from "@/components/LeadForm";
import { PublicPageHero } from "@/components/PublicPageHero";
import { MotionReveal } from "@/components/MotionReveal";
import { brand } from "@/config/brand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact CurrencyKart",
  description: "Request a callback, ask about serviceability or contact support for a travel-forex enquiry across Delhi NCR.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <>
      <PremiumNavbar />
      <PublicPageHero eyebrow="Concierge support" title="Talk to the travel forex desk" copy="Reach the support team for order guidance, service-area checks and travel-services assistance." icon={Headphones} />
      <main className="section-shell grid gap-8 py-10 lg:grid-cols-[0.78fr_1.22fr]">
        <MotionReveal className="grid content-start gap-4">
          {[
            [Phone, brand.supportPhone],
            [MessageCircle, brand.supportEmail],
            [MapPin, "Delhi, Gurugram, Noida, Greater Noida, Faridabad and Ghaziabad"]
          ].map(([Icon, copy]) => (
            <div key={String(copy)} className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-blue-50 text-royal"><Icon size={18} /></span>
              <p className="pt-2 text-sm leading-6 text-slate-700">{String(copy)}</p>
            </div>
          ))}
          <div className="grid h-56 place-items-center rounded-lg border border-slate-200 bg-gradient-to-br from-mist to-white px-6 text-center text-sm leading-6 text-slate-600 shadow-sm">Serving eligible locations across Delhi, Gurgaon, Noida, Greater Noida, Faridabad and Ghaziabad. Confirm your PIN code before placing an order.</div>
        </MotionReveal>
        <MotionReveal delay={0.1}><LeadForm title="Send a support request" fields={["Name", "Phone", "Email", "Subject", "Message"]} /></MotionReveal>
      </main>
    </>
  );
}
