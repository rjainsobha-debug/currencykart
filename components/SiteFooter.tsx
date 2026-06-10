import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { brand } from "@/config/brand";

const legalLinks = [
  ["Terms", "/terms"],
  ["Privacy", "/privacy"],
  ["Refunds & cancellations", "/refund-cancellation"],
  ["KYC & documents", "/kyc-document-policy"],
  ["FEMA/RBI information", "/compliance"]
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink px-4 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[1.2fr_0.8fr_0.9fr]">
        <div>
          <Image src={brand.logoLight} alt={`${brand.name} logo`} width={260} height={65} className="h-auto w-56" />
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/62">{brand.positioning} {brand.complianceLine}</p>
          <p className="mt-4 text-xs leading-5 text-white/44">{brand.disclaimer}</p>
          <p className="mt-3 text-xs leading-5 text-amber-200/70">Launch owner: replace all fallback legal, contact, address and authorisation details before publishing.</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Policies and information</p>
          <div className="mt-4 grid gap-3 text-sm text-white/62">
            {legalLinks.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-white">{label}</Link>)}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Enquiries</p>
          <div className="mt-4 grid gap-3 text-sm text-white/62">
            <a href={`tel:${brand.supportPhone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-white"><Phone size={15} />{brand.supportPhone}</a>
            <a href={`mailto:${brand.supportEmail}`} className="flex items-center gap-2 hover:text-white"><Mail size={15} />{brand.supportEmail}</a>
            <a href={`mailto:${brand.ordersEmail}`} className="flex items-center gap-2 hover:text-white"><Mail size={15} />{brand.ordersEmail}</a>
            <a href={`mailto:${brand.kycEmail}`} className="flex items-center gap-2 hover:text-white"><Mail size={15} />{brand.kycEmail}</a>
            <span className="flex items-start gap-2"><MapPin className="mt-0.5 shrink-0" size={15} />{brand.registeredAddress}</span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-9 max-w-7xl border-t border-white/10 pt-5 text-xs leading-5 text-white/42">
        Rates shown on this website are illustrative or indicative unless expressly confirmed in a time-limited rate lock. Transactions are subject to partner acceptance, permitted purpose, customer eligibility, KYC/AML checks and applicable law.
      </div>
    </footer>
  );
}
