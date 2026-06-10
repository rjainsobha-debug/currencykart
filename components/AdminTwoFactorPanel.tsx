"use client";

import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { StatusState } from "./StatusState";

export function AdminTwoFactorPanel() {
  const [challengeId, setChallengeId] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function requestCode() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/2fa/request", { method: "POST", credentials: "include" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? "Could not request 2FA code.");
      setChallengeId(payload.challengeId);
      setMessage("A staff verification code was sent.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not request 2FA code.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/2fa/verify", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ challengeId, code }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? "2FA verification failed.");
      setMessage("Administrator two-factor verification is active for this session.");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "2FA verification failed.");
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-5">
      <div className="flex items-center gap-3"><ShieldCheck className="text-royal" size={20} /><div><p className="font-semibold text-navy">Administrator two-factor verification</p><p className="text-xs text-slate-600">Enable enforcement with ADMIN_2FA_REQUIRED=true.</p></div></div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        {challengeId ? <input className="premium-field" placeholder="6-digit code" value={code} onChange={(event) => setCode(event.target.value)} maxLength={6} /> : null}
        <button onClick={() => void (challengeId ? verifyCode() : requestCode())} disabled={busy} className="h-11 rounded-md bg-navy px-4 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Please wait..." : challengeId ? "Verify 2FA" : "Send 2FA code"}</button>
      </div>
      {message ? <div className="mt-3"><StatusState type={message.includes("active") || message.includes("sent") ? "success" : "error"} message={message} /></div> : null}
    </div>
  );
}
