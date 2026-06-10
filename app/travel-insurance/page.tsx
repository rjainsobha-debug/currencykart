import { ShieldPlus } from "lucide-react";
import { PremiumNavbar } from "@/components/PremiumNavbar";
import { LeadForm } from "@/components/LeadForm";
import { PublicPageHero } from "@/components/PublicPageHero";
import { MotionReveal } from "@/components/MotionReveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Travel Insurance Assistance in Delhi NCR",
  description: "Share your itinerary for travel insurance assistance subject to insurer terms, eligibility, exclusions and underwriting.",
  path: "/travel-insurance",
  keywords: ["travel insurance Delhi NCR", "international travel insurance Gurgaon", "travel insurance Noida"]
});

export default function TravelInsurancePage() {
  return (
    <>
      <PremiumNavbar />
      <PublicPageHero eyebrow="Trip protection assistance" title="Travel insurance support around your itinerary" copy="Share destination, dates, age and coverage preference for suitable partner-led insurance assistance." icon={ShieldPlus} />
      <main className="section-shell grid gap-8 py-10 lg:grid-cols-[0.72fr_1.08fr]">
        <MotionReveal>
          <div className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-semibold text-navy">Designed around your trip</h2>
            <p className="mt-4 leading-7 text-slate-600">Coverage preferences are indicative and remain subject to insurer terms, eligibility, exclusions and underwriting.</p>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.1}><LeadForm title="Insurance assistance request" fields={["Destination", "Start date", "End date", "Age", "Purpose", "Coverage preference"]} /></MotionReveal>
      </main>
    </>
  );
}
