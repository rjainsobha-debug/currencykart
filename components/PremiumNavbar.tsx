"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { brand } from "@/config/brand";
import { PremiumButton } from "./PremiumButton";

const links = [
  ["Buy", "/buy-forex"],
  ["Sell", "/sell-forex"],
  ["Card", "/forex-card"],
  ["Insurance", "/travel-insurance"],
  ["Student", "/student-forex"],
  ["Corporate", "/corporate-forex"],
  ["FAQ", "/faq"]
];

export function PremiumNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/92 text-white shadow-[0_12px_40px_rgba(7,17,31,0.18)] backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <Image src={brand.logoMark} alt={`${brand.name} logo mark`} width={40} height={40} className="h-10 w-10 rounded-lg" priority />
          <span className="leading-tight">
            <span className="block">{brand.name}</span>
            <span className="hidden text-xs font-medium text-white/54 sm:block">{brand.cityFocus} travel desk</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/6 p-1 text-sm text-white/76 lg:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm text-white/72 transition hover:text-white">
            Login
          </Link>
          <PremiumButton href="/buy-forex" className="h-10 px-4">
            Start an enquiry
          </PremiumButton>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-md border border-white/12 bg-white/8 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-ink/98 px-4 pb-4 pt-2 lg:hidden">
          <nav className="grid gap-1 text-sm text-white/82">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-md px-3 py-3 hover:bg-white/10" onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <PremiumButton href="/login" variant="secondary" className="h-10">
              Login
            </PremiumButton>
            <PremiumButton href="/buy-forex" className="h-10">
              Enquire
            </PremiumButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}
