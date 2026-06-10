import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { RegistrationForm } from "@/components/RegistrationForm";

export default function RegisterPage() {
  return (
    <AuthShell title="Create your account" copy="Set up a customer profile for KYC, order tracking, documents and notifications.">
      <RegistrationForm />
      <p className="mt-6 text-sm text-slate-600"><Link href="/login">Already registered? Login</Link></p>
    </AuthShell>
  );
}
