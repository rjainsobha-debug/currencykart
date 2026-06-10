import { Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { brand } from "@/config/brand";

export function AuthShell({ title, copy, children }: { title: string; copy: string; children: React.ReactNode }) {
  return (
    <main className="premium-noise grid min-h-screen place-items-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-white/12 bg-white shadow-[0_35px_100px_rgba(0,0,0,0.35)] lg:grid-cols-[0.85fr_1.15fr]">
        <section className="hidden bg-gradient-to-br from-navy to-[#12366d] p-9 text-white lg:block">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <Image src={brand.logoMark} alt={`${brand.name} logo mark`} width={44} height={44} className="h-11 w-11 rounded-lg" />
            <span>{brand.name}</span>
          </Link>
          <div className="mt-20">
            <Sparkles className="text-gold" size={24} />
            <h2 className="mt-5 text-3xl font-semibold">Travel money, kept beautifully organised.</h2>
            <p className="mt-4 leading-7 text-white/68">Track KYC, orders, payments and support through one secure customer account.</p>
          </div>
        </section>
        <section className="p-6 sm:p-9">
          <div className="flex items-center gap-3 lg:hidden">
            <Image src={brand.logoMark} alt={`${brand.name} logo mark`} width={40} height={40} className="h-10 w-10 rounded-md" />
            <span className="font-semibold text-navy">{brand.name}</span>
          </div>
          <h1 className="mt-7 text-3xl font-semibold text-navy lg:mt-0">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
          {children}
        </section>
      </div>
    </main>
  );
}
