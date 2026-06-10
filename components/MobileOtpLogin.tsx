"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { StatusState } from "./StatusState";

export function MobileOtpLogin() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const phoneIsValid = phone.trim().length >= 10;
  const codeIsValid = /^\d{6}$/.test(code.trim());

  async function requestOtp() {
    if (!phoneIsValid) {
      setMessage("Enter a valid mobile number before requesting OTP.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? "OTP request failed.");
      setChallengeId(payload.challengeId);
      setMessage("OTP sent. It expires in five minutes.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "OTP request failed.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp() {
    if (!phoneIsValid || !codeIsValid || !challengeId) {
      setMessage("Enter the mobile number and 6-digit OTP to continue.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/otp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, code, challengeId }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? "OTP verification failed.");
      const result = await signIn("mobile-otp", { phone, challengeId, redirect: false, callbackUrl: "/dashboard" });
      if (result?.error) throw new Error("Could not establish the verified session.");
      window.location.href = result?.url ?? "/dashboard";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "OTP verification failed.");
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={() => setOpen((value) => !value)} className="h-11 w-full rounded-md bg-mist text-sm font-semibold text-navy transition hover:bg-blue-50">Mobile OTP</button>
      {open ? (
        <div className="mt-3 grid gap-3 rounded-lg border border-slate-200 bg-mist/60 p-4 sm:col-span-2">
          <input className="premium-field" placeholder="+91 mobile number" value={phone} onChange={(event) => setPhone(event.target.value)} />
          {challengeId ? <input className="premium-field" placeholder="6-digit OTP" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} inputMode="numeric" maxLength={6} /> : null}
          <button type="button" onClick={() => void (challengeId ? verifyOtp() : requestOtp())} disabled={busy || !phoneIsValid || Boolean(challengeId && !codeIsValid)} className="h-10 rounded-md bg-navy text-sm font-semibold text-white disabled:opacity-50">{busy ? "Please wait..." : challengeId ? "Verify and login" : "Request OTP"}</button>
          {message ? <StatusState type={message.includes("sent") ? "success" : "error"} message={message} /> : null}
          {challengeId ? <button type="button" onClick={() => void requestOtp()} disabled={busy} className="text-xs font-semibold text-royal">Resend after cooldown</button> : null}
        </div>
      ) : null}
    </div>
  );
}
