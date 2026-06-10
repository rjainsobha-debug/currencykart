import Image from "next/image";
import { Building2, Check, CreditCard, GraduationCap, MapPin, Plane, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { PremiumNavbar } from "@/components/PremiumNavbar";
import { HeroCurrencyCalculator } from "@/components/HeroCurrencyCalculator";
import { CurrencyRateCard } from "@/components/CurrencyRateCard";
import { CurrencyTable } from "@/components/CurrencyTable";
import { ServiceCard } from "@/components/ServiceCard";
import { TrustBadge } from "@/components/TrustBadge";
import { StepTimeline } from "@/components/StepTimeline";
import { FAQAccordion } from "@/components/FAQAccordion";
import { PremiumButton } from "@/components/PremiumButton";
import { MotionItem, MotionReveal, MotionStagger } from "@/components/MotionReveal";
import { brand } from "@/config/brand";
import { ServiceAreas } from "@/components/ServiceAreas";
import { StructuredData } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Premium Online Forex and Travel Money Assistance",
  description: "CurrencyKart helps travellers, students, families and businesses request forex, forex cards, currency buyback and travel insurance assistance across Delhi NCR.",
  path: "/",
  keywords: ["forex Delhi NCR", "foreign currency Delhi", "forex Gurgaon", "forex Noida", "travel forex assistance"]
});

export default function HomePage() {
  return (
    <>
      <PremiumNavbar />
      <main className="overflow-hidden">
        <StructuredData data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: brand.name,
          url: brand.siteUrl,
          telephone: brand.supportPhone,
          email: brand.supportEmail,
          description: brand.tagline,
          areaServed: ["Delhi NCR", "Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad"],
          address: { "@type": "PostalAddress", streetAddress: brand.registeredAddress, addressRegion: "Delhi NCR", addressCountry: "IN" },
          priceRange: "Rates on enquiry"
        }} />
        <section className="premium-noise relative text-white">
          <div className="section-shell grid min-h-[720px] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
            <MotionReveal>
              <div className="flex flex-wrap gap-2">
                <TrustBadge text="KYC-first workflow" />
                <TrustBadge text="Doorstep coordination across Delhi NCR" />
              </div>
              <p className="mt-8 flex items-center gap-2 text-sm font-semibold text-gold">
                <Sparkles size={16} />
                Travel money assistance with a clear review process
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
                Plan your travel money with more clarity and less chasing.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
                {brand.positioning} Delhi NCR is first, with a service model built to expand across India.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <PremiumButton href="/buy-forex">Start a forex enquiry</PremiumButton>
                <PremiumButton href="/contact" variant="secondary">Request a callback</PremiumButton>
              </div>
              <div className="mt-8 grid max-w-2xl gap-3 text-sm text-white/72 sm:grid-cols-3">
                {["Secure document review", "Transparent order tracking", "Partner-led fulfilment"].map((item) => (
                  <span key={item} className="flex items-center gap-2"><Check size={15} className="text-emerald" />{item}</span>
                ))}
              </div>
              <div className="relative mt-9 overflow-hidden rounded-lg border border-white/12 shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
                <Image
                  src="/images/premium-currencykart-hero.png"
                  alt="CurrencyKart premium travel money desk with passport, currency, travel card and mobile rate screen"
                  width={1600}
                  height={960}
                  priority
                  className="aspect-[16/8.5] w-full object-cover"
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-ink/78 px-3 py-2 text-xs backdrop-blur">
                  <MapPin size={14} className="text-gold" />
                  Delhi, Gurugram, Noida and wider NCR
                </div>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.12} className="flex justify-center lg:justify-end">
              <HeroCurrencyCalculator />
            </MotionReveal>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <MotionStagger className="section-shell grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
            <MotionItem><CurrencyRateCard code="USD" country="United States" rate="Buy from INR 84.95" flag="$" /></MotionItem>
            <MotionItem><CurrencyRateCard code="EUR" country="Eurozone" rate="Buy from INR 91.80" flag="EUR" /></MotionItem>
            <MotionItem><CurrencyRateCard code="GBP" country="United Kingdom" rate="Buy from INR 108.60" flag="GBP" /></MotionItem>
            <MotionItem><CurrencyRateCard code="AED" country="United Arab Emirates" rate="Buy from INR 23.35" flag="AED" /></MotionItem>
          </MotionStagger>
        </section>

        <section className="section-shell py-16">
          <MotionReveal className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-royal">Rate desk</p>
              <h2 className="mt-3 text-3xl font-semibold text-navy sm:text-4xl">Clear estimates before you commit</h2>
              <p className="mt-4 leading-7 text-slate-600">Use the sample rate view to understand the process. A transaction rate becomes actionable only when issued through a time-limited confirmation after KYC and availability checks.</p>
            </div>
            <CurrencyTable />
          </MotionReveal>
        </section>

        <section className="border-y border-slate-200 bg-white py-16">
          <div className="section-shell">
            <MotionReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-royal">One travel desk</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-navy sm:text-4xl">Everything around your travel money</h2>
            </MotionReveal>
            <MotionStagger className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <MotionItem><ServiceCard title="Buy foreign currency" copy="Get an estimate, complete KYC and coordinate delivery for your trip." href="/buy-forex" icon={Plane} /></MotionItem>
              <MotionItem><ServiceCard title="Sell foreign currency" copy="Request review and pickup for unused foreign currency after travel." href="/sell-forex" icon={Truck} /></MotionItem>
              <MotionItem><ServiceCard title="Forex card and reload" copy="Request new card or reload assistance through partner workflows." href="/forex-card" icon={CreditCard} /></MotionItem>
              <MotionItem><ServiceCard title="Travel insurance" copy="Share your itinerary for suitable travel insurance assistance." href="/travel-insurance" icon={ShieldCheck} /></MotionItem>
              <MotionItem><ServiceCard title="Student forex" copy="Support for university travel, tuition context and living expenses." href="/student-forex" icon={GraduationCap} /></MotionItem>
              <MotionItem><ServiceCard title="Corporate forex" copy="Account-managed support for employee travel and bulk requirements." href="/corporate-forex" icon={Building2} /></MotionItem>
            </MotionStagger>
          </div>
        </section>

        <section className="section-shell py-16">
          <MotionReveal>
            <div className="rounded-lg bg-gradient-to-br from-navy to-[#12366d] p-6 text-white shadow-premium sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Eligible doorstep coordination</p>
                  <h2 className="mt-3 text-3xl font-semibold">A local response for time-sensitive travel plans.</h2>
                  <p className="mt-4 leading-7 text-white/70">Coordinate eligible delivery or pickup across Delhi, Gurugram, Noida, Greater Noida, Faridabad and Ghaziabad after verification.</p>
                  <PremiumButton href="/contact" className="mt-6">Request a serviceability check</PremiumButton>
                </div>
                <StepTimeline steps={["Choose service", "Verify contact", "Upload documents", "Review and rate lock"]} />
              </div>
            </div>
          </MotionReveal>
        </section>

        <ServiceAreas />

        <section className="border-y border-slate-200 bg-mist py-16">
          <div className="section-shell grid gap-8 lg:grid-cols-2">
            <MotionReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-royal">Confidence by design</p>
              <h2 className="mt-3 text-3xl font-semibold text-navy sm:text-4xl">A calmer way to arrange travel forex</h2>
              <p className="mt-4 leading-7 text-slate-600">Every request follows a visible review path with document status, payment status, internal assignment and notifications.</p>
            </MotionReveal>
            <MotionStagger className="grid gap-4">
              {[
                ["Family traveller", "The checklist made our Europe travel preparation much easier."],
                ["International student", "I could see exactly what documents were still pending."],
                ["Corporate coordinator", "Employee travel requests were easier to organise and track."]
              ].map(([role, quote]) => (
                <MotionItem key={role}>
                  <blockquote className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="leading-7 text-slate-700">&quot;{quote}&quot;</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-royal">{role}</p>
                  </blockquote>
                </MotionItem>
              ))}
            </MotionStagger>
          </div>
        </section>

        <section className="section-shell max-w-5xl py-16">
          <MotionReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-royal">Answers before you travel</p>
            <h2 className="mt-3 text-3xl font-semibold text-navy sm:text-4xl">Frequently asked questions</h2>
            <div className="mt-8"><FAQAccordion /></div>
          </MotionReveal>
        </section>

      </main>
    </>
  );
}
