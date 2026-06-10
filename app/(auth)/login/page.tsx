import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { CredentialsLoginForm } from "@/components/CredentialsLoginForm";

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" copy="Use your verified email, Google account or mobile OTP to continue.">
      <CredentialsLoginForm />
      <div className="mt-6 flex justify-between text-sm text-slate-600"><Link href="/register">Create account</Link><Link href="/forgot-password">Forgot password</Link></div>
    </AuthShell>
  );
}
