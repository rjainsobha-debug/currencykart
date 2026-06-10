"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PremiumButton } from "./PremiumButton";
import { StatusState } from "./StatusState";

export function RegistrationForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? "Registration failed.");
      router.push("/login?registered=1");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-semibold text-navy sm:col-span-2">Full name<input className="premium-field font-normal" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
      <label className="grid gap-2 text-sm font-semibold text-navy">Email<input className="premium-field font-normal" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" required /></label>
      <label className="grid gap-2 text-sm font-semibold text-navy">Mobile<input className="premium-field font-normal" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required /></label>
      <label className="grid gap-2 text-sm font-semibold text-navy sm:col-span-2">Password<input className="premium-field font-normal" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" minLength={12} required /><span className="text-xs font-normal text-slate-500">Minimum 12 characters.</span></label>
      {error ? <div className="sm:col-span-2"><StatusState type="error" message={error} /></div> : null}
      <PremiumButton className="w-full sm:col-span-2">{loading ? "Creating account..." : "Register and verify"}</PremiumButton>
    </form>
  );
}
