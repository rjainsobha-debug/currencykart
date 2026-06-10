import Link from "next/link";
import { SearchX } from "lucide-react";
import { PremiumNavbar } from "@/components/PremiumNavbar";

export default function NotFound() {
  return (
    <>
      <PremiumNavbar />
      <main className="grid min-h-[70vh] place-items-center px-4 py-16">
        <div className="max-w-xl rounded-lg border border-slate-200 bg-white p-7 text-center shadow-premium">
          <SearchX className="mx-auto text-royal" size={32} />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-royal">404</p>
          <h1 className="mt-2 text-3xl font-semibold text-navy">Page not found</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">The page may have moved, or the link may no longer be active.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white">Go home</Link>
            <Link href="/contact" className="rounded-md border border-slate-200 px-5 py-2.5 text-sm font-semibold text-navy">Contact support</Link>
          </div>
        </div>
      </main>
    </>
  );
}
