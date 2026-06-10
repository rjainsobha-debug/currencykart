"use client";

import { Clock3 } from "lucide-react";
import { useEffect, useState } from "react";

export function RateLockTimer({ expiresAt }: { expiresAt: string }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => setRemaining(Math.max(0, new Date(expiresAt).getTime() - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const minutes = Math.floor(remaining / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  const expired = remaining === 0;

  return (
    <div className={`rounded-lg border p-4 ${expired ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-sm font-semibold"><Clock3 size={17} />{expired ? "Rate lock expired" : "Rate lock active"}</span>
        <span className="font-mono text-xl font-semibold">{expired ? "00:00" : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}</span>
      </div>
      <p className="mt-2 text-xs opacity-75">{expired ? "Ask the rate desk to issue a new lock before payment verification." : "Complete payment within this window. Final fulfilment remains subject to verification."}</p>
    </div>
  );
}
