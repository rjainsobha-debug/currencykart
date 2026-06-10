"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { PremiumButton } from "./PremiumButton";
import { StatusState } from "./StatusState";
import { MobileOtpLogin } from "./MobileOtpLogin";

export function CredentialsLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/dashboard" });
    setLoading(false);
    if (result?.error) {
      setError("Login failed. Check your credentials or account status.");
      return;
    }
    window.location.href = result?.url ?? "/dashboard";
  }

  return (
    <>
      <form onSubmit={submit} className="mt-7 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-navy">Email<input className="premium-field font-normal" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" type="email" required /></label>
        <label className="grid gap-2 text-sm font-semibold text-navy">Password<input className="premium-field font-normal" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" type="password" required /></label>
        {error ? <StatusState type="error" message={error} /> : null}
        <PremiumButton className="mt-1 w-full">{loading ? "Signing in..." : "Login securely"}</PremiumButton>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />OR<span className="h-px flex-1 bg-slate-200" /></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <button onClick={() => void signIn("google", { callbackUrl: "/dashboard" })} className="h-11 rounded-md border border-slate-200 text-sm font-semibold text-navy transition hover:bg-mist">Continue with Google</button>
        <MobileOtpLogin />
      </div>
    </>
  );
}
