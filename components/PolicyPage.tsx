import { FileText } from "lucide-react";
import { PremiumNavbar } from "./PremiumNavbar";
import { PublicPageHero } from "./PublicPageHero";

export type PolicySection = { title: string; paragraphs?: string[]; bullets?: string[] };

export function PolicyPage({
  eyebrow,
  title,
  introduction,
  sections,
  effectiveDate = "6 June 2026"
}: {
  eyebrow: string;
  title: string;
  introduction: string;
  sections: PolicySection[];
  effectiveDate?: string;
}) {
  return (
    <>
      <PremiumNavbar />
      <PublicPageHero eyebrow={eyebrow} title={title} copy={introduction} icon={FileText} />
      <main className="section-shell max-w-4xl py-12">
        <p className="rounded-md bg-mist px-4 py-3 text-sm text-slate-600">Effective date: {effectiveDate}. Replace placeholder legal-entity, licence, address and partner details before launch.</p>
        <div className="mt-8 grid gap-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold text-navy">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-3 leading-7 text-slate-600">{paragraph}</p>)}
              {section.bullets ? <ul className="mt-4 grid gap-3 pl-5 text-slate-600">{section.bullets.map((item) => <li key={item} className="list-disc leading-7">{item}</li>)}</ul> : null}
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
