import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Reset your password" copy="Enter your account email to request a secure password-reset link.">
      <ForgotPasswordForm />
      <p className="mt-6 text-sm text-slate-600"><Link href="/login">Return to login</Link></p>
    </AuthShell>
  );
}
