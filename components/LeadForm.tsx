"use client";

import { useState } from "react";
import { Send, ShieldCheck } from "lucide-react";
import { PremiumButton } from "./PremiumButton";
import { StatusState } from "./StatusState";

export function LeadForm({ title, fields }: { title: string; fields: string[] }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    window.setTimeout(() => setState("success"), 700);
  }

  return (
    <form onSubmit={submit} className="premium-gradient-border rounded-lg bg-white/92 p-5 shadow-premium backdrop-blur sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-royal">Secure request</p>
          <h2 className="mt-2 text-2xl font-semibold text-navy">{title}</h2>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-emerald/10 text-emerald">
          <ShieldCheck size={19} />
        </span>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {fields.map((field, index) => (
          <label key={field} className={index === fields.length - 1 && fields.length % 2 !== 0 ? "grid gap-2 text-sm font-semibold text-navy md:col-span-2" : "grid gap-2 text-sm font-semibold text-navy"}>
            {field}
            <input className="premium-field font-normal" placeholder={field} required />
          </label>
        ))}
      </div>
      <div className="mt-5 grid gap-3">
        {state === "loading" ? <StatusState type="loading" message="Preparing your request summary and validation checks." /> : null}
        {state === "success" ? <StatusState type="success" title="Request captured" message="A support executive can now review this lead in the admin workflow." /> : null}
        {state === "error" ? <StatusState type="error" message="Please check the details and try again." /> : null}
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">Rates and services are subject to final verification, availability, KYC checks and applicable guidelines.</p>
      <PremiumButton className="mt-5 w-full sm:w-auto">
        <Send size={16} />
        Send enquiry securely
      </PremiumButton>
    </form>
  );
}
