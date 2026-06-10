"use client";

import { useState } from "react";
import { PremiumButton } from "./PremiumButton";
import { StatusState } from "./StatusState";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.includes("@")) {
      setState("error");
      return;
    }
    setState("loading");
    window.setTimeout(() => setState("success"), 500);
  }

  return (
    <form onSubmit={submit} className="mt-7 grid gap-4" noValidate>
      <label className="grid gap-2 text-sm font-semibold text-navy">
        Email
        <input
          className="premium-field font-normal"
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      {state === "loading" ? <StatusState type="loading" message="Preparing password-reset instructions." /> : null}
      {state === "success" ? <StatusState type="success" message="If this account exists, reset instructions will be sent to the registered email." /> : null}
      {state === "error" ? <StatusState type="error" message="Enter a valid registered email address." /> : null}
      <PremiumButton className="w-full">Send reset link</PremiumButton>
    </form>
  );
}
