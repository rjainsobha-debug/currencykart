import { LucideIcon } from "lucide-react";
import { MotionReveal } from "./MotionReveal";

export function PublicPageHero({
  eyebrow,
  title,
  copy,
  icon: Icon
}: {
  eyebrow: string;
  title: string;
  copy: string;
  icon: LucideIcon;
}) {
  return (
    <section className="premium-noise text-white">
      <MotionReveal className="section-shell py-12 sm:py-16">
        <div className="max-w-3xl">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-white/10 text-gold ring-1 ring-white/15">
            <Icon size={22} />
          </span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-gold">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">{copy}</p>
        </div>
      </MotionReveal>
    </section>
  );
}
