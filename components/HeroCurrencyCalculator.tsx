"use client";

import { Calculator, CheckCircle2, CreditCard, Plane, ShieldCheck, Timer } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { PremiumButton } from "./PremiumButton";

const services: Array<[string, LucideIcon, string]> = [
  ["Buy", Plane, "/buy-forex"],
  ["Sell", Calculator, "/sell-forex"],
  ["Card", CreditCard, "/forex-card"],
  ["Insurance", ShieldCheck, "/travel-insurance"]
];

const rates = {
  USD: { name: "US Dollar", buy: 84.95, sell: 83.2, card: 85.1 },
  EUR: { name: "Euro", buy: 91.8, sell: 89.95, card: 92.2 },
  GBP: { name: "British Pound", buy: 108.6, sell: 106.75, card: 109.2 },
  AED: { name: "UAE Dirham", buy: 23.35, sell: 22.75, card: 23.45 },
  SGD: { name: "Singapore Dollar", buy: 62.9, sell: 61.45, card: 63.1 }
};

export function HeroCurrencyCalculator() {
  const [service, setService] = useState("Buy");
  const [currency, setCurrency] = useState<keyof typeof rates>("USD");
  const [amount, setAmount] = useState("1000");
  const numericAmount = Number(amount.replace(/,/g, "")) || 0;

  const estimate = useMemo(() => {
    const rate = service === "Sell" ? rates[currency].sell : service === "Card" ? rates[currency].card : rates[currency].buy;
    return { rate, total: numericAmount * rate };
  }, [currency, numericAmount, service]);

  return (
    <GlassCard className="w-full max-w-xl p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-royal">Illustrative estimate</p>
          <h2 className="mt-1 text-xl font-semibold text-navy">Plan your forex enquiry</h2>
        </div>
        <div className="hidden rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald sm:block">KYC-ready</div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {services.map(([label, Icon]) => {
          const active = service === label;
          return (
            <button
              key={label}
              onClick={() => setService(label)}
              className={`relative grid h-16 place-items-center rounded-md text-xs font-semibold transition ${
                active ? "bg-navy text-white shadow-[0_14px_28px_rgba(7,17,31,0.22)]" : "bg-mist text-navy hover:bg-blue-50"
              }`}
            >
              {active ? <motion.span layoutId="calcActive" className="absolute inset-0 rounded-md bg-navy" /> : null}
              <span className="relative grid place-items-center gap-1">
                <Icon size={18} />
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-navy">
          Currency
          <select className="premium-field" value={currency} onChange={(event) => setCurrency(event.target.value as keyof typeof rates)}>
            {Object.entries(rates).map(([code, value]) => (
              <option key={code} value={code}>
                {code} - {value.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-navy">
          Foreign amount
          <input className="premium-field text-lg font-semibold" value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="numeric" />
        </label>

        <div className="rounded-lg bg-gradient-to-br from-navy to-[#112f5e] p-5 text-white shadow-[0_18px_45px_rgba(7,17,31,0.24)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/68">Estimated INR {service === "Sell" ? "receivable" : "payable"}</p>
              <p className="mt-1 text-3xl font-semibold">INR {estimate.total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="rounded-md bg-white/10 px-3 py-2 text-right">
              <p className="text-xs text-white/58">Rate</p>
              <p className="font-semibold">INR {estimate.rate.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 text-xs text-white/66 sm:grid-cols-2">
            <span className="flex items-center gap-2"><Timer size={14} /> Indicative rate lock after review</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Subject to KYC and availability</span>
          </div>
        </div>

        <PremiumButton href={services.find(([label]) => label === service)?.[2] ?? "/buy-forex"} className="w-full">
          Continue with {service.toLowerCase()} enquiry
        </PremiumButton>
      </div>
    </GlassCard>
  );
}
