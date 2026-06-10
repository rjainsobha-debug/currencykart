"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="en">
      <body>
        <main className="grid min-h-screen place-items-center bg-mist px-4">
          <div className="max-w-lg rounded-lg border border-red-100 bg-white p-7 text-center shadow-premium">
            <AlertTriangle className="mx-auto text-red-600" size={30} />
            <h1 className="mt-4 text-2xl font-semibold text-navy">Service temporarily unavailable</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Please refresh the page or contact support if the issue continues.</p>
            {error.digest ? <p className="mt-3 text-xs font-semibold text-slate-500">Reference: {error.digest}</p> : null}
            <Link href="/" className="mt-5 inline-flex rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white">Return home</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
