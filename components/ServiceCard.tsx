import { LucideIcon } from "lucide-react";
import Link from "next/link";

export function ServiceCard({ title, copy, href, icon: Icon }: { title: string; copy: string; href: string; icon: LucideIcon }) {
  return (
    <Link href={href} className="group rounded-lg border border-slate-200 bg-white/92 p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-premium">
      <div className="grid h-11 w-11 place-items-center rounded-md bg-gradient-to-br from-royal to-blue-700 text-white shadow-[0_14px_28px_rgba(36,88,255,0.22)] transition group-hover:scale-105">
        <Icon size={20} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
      <p className="mt-5 text-sm font-semibold text-royal">Explore service</p>
    </Link>
  );
}
