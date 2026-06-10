"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4">
      <div className="max-w-lg rounded-lg border border-red-100 bg-white p-7 text-center shadow-premium">
        <AlertTriangle className="mx-auto text-red-600" size={30} />
        <h1 className="mt-4 text-2xl font-semibold text-navy">Something could not be loaded</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">The incident has been logged. Please retry, or contact support if it continues.</p>
        {error.digest ? <p className="mt-3 text-xs font-semibold text-slate-500">Reference: {error.digest}</p> : null}
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={reset} className="rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white">Try again</button>
          <Link href="/contact" className="rounded-md border border-slate-200 px-5 py-2.5 text-sm font-semibold text-navy">Contact support</Link>
        </div>
      </div>
    </main>
  );
}
