import { GraduationCap, CheckCircle2 } from "lucide-react";
import { PremiumNavbar } from "@/components/PremiumNavbar";
import { LeadForm } from "@/components/LeadForm";
import { PublicPageHero } from "@/components/PublicPageHero";
import { MotionReveal } from "@/components/MotionReveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Student Forex Assistance for Study Abroad",
  description: "Organise student travel currency, card assistance and document preparation for overseas education from Delhi NCR.",
  path: "/student-forex",
  keywords: ["student forex Delhi", "study abroad forex Gurgaon", "student travel card Noida"]
});

export default function StudentForexPage() {
  return (
    <>
      <PremiumNavbar />
      <PublicPageHero eyebrow="Study abroad desk" title="Student forex for the journey ahead" copy="Organise travel currency, living expenses context, document checks and card assistance for overseas study." icon={GraduationCap} />
      <main className="section-shell grid gap-8 py-10 lg:grid-cols-2">
        <MotionReveal>
          <div className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-semibold text-navy">University travel checklist</h2>
            {["University offer letter", "Visa and passport", "Living expense planning", "Travel insurance and forex card"].map((item) => (
              <p key={item} className="mt-4 flex items-center gap-3 rounded-md bg-mist p-4 text-sm text-slate-700"><CheckCircle2 size={16} className="text-emerald" />{item}</p>
            ))}
          </div>
        </MotionReveal>
        <MotionReveal delay={0.1}><LeadForm title="Student forex request" fields={["University country", "Currency", "Amount", "Travel date", "Student name", "Phone"]} /></MotionReveal>
      </main>
    </>
  );
}
