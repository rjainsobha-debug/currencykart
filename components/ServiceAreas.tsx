import { MapPin, MessageCircle, PhoneCall } from "lucide-react";
import { brand, serviceAreas } from "@/config/brand";
import { PremiumButton } from "./PremiumButton";
import { MotionItem, MotionReveal, MotionStagger } from "./MotionReveal";

export function ServiceAreas() {
  return (
    <section className="border-y border-slate-200 bg-white py-16">
      <div className="section-shell">
        <MotionReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-royal">Delhi NCR service coverage</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-navy sm:text-4xl">Local assistance from enquiry to eligible doorstep coordination</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">Serviceability depends on location, order type, document approval, partner availability and operational limits.</p>
        </MotionReveal>
        <MotionStagger className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {serviceAreas.map((area) => (
            <MotionItem key={area.name}>
              <div className="h-full rounded-lg border border-slate-200 bg-mist/60 p-5">
                <MapPin className="text-royal" size={19} />
                <h3 className="mt-4 font-semibold text-navy">{area.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{area.copy}</p>
              </div>
            </MotionItem>
          ))}
        </MotionStagger>
        <div className="mt-8 flex flex-col gap-3 rounded-lg bg-navy p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div><p className="font-semibold">Need a serviceability check?</p><p className="mt-1 text-sm text-white/62">Share your PIN code and travel requirement for a callback.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={brand.whatsappUrl} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald px-4 text-sm font-semibold"><MessageCircle size={16} />Ask on WhatsApp</a>
            <PremiumButton href="/contact" variant="secondary"><PhoneCall size={16} />Request a callback</PremiumButton>
          </div>
        </div>
      </div>
    </section>
  );
}
