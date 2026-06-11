import { PremiumNavbar } from "@/components/PremiumNavbar";
import { DashboardCard } from "@/components/DashboardCard";
import { KycUploadBox } from "@/components/KycUploadBox";
import { MotionReveal, MotionStagger, MotionItem } from "@/components/MotionReveal";
import { StatusState } from "@/components/StatusState";
import { CustomerOrderWorkspace } from "@/components/CustomerOrderWorkspace";

export const dynamic = "force-dynamic";

export default function CustomerDashboardPage() {
  return (
    <>
      <PremiumNavbar />
      <main className="section-shell py-10">
        <MotionReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-royal">My account</p>
          <h1 className="mt-2 text-3xl font-semibold text-navy">Travel money dashboard</h1>
          <p className="mt-3 text-slate-600">Track documents, orders, payments, notifications and support from one place.</p>
          <p className="mt-2 text-xs font-semibold text-amber-700">Summary cards show illustrative values; the order workspace below loads authenticated records.</p>
        </MotionReveal>
        <MotionStagger className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MotionItem><DashboardCard label="KYC status" value="Pending" note="Upload documents for review" /></MotionItem>
          <MotionItem><DashboardCard label="Orders" value="3" note="One requires payment" /></MotionItem>
          <MotionItem><DashboardCard label="Payments" value="INR 84,950" note="Pending verification" /></MotionItem>
          <MotionItem><DashboardCard label="Notifications" value="5" note="Configured account and order channels" /></MotionItem>
        </MotionStagger>
        <CustomerOrderWorkspace />
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <MotionReveal><KycUploadBox /></MotionReveal>
          <MotionReveal className="grid gap-4 lg:col-span-2">
            <StatusState type="empty" title="No open support tickets" message="New support conversations will appear here with their assigned executive." />
            <StatusState type="success" title="Notifications active" message="Order updates are queued for verified email and mobile channels." />
          </MotionReveal>
        </section>
      </main>
    </>
  );
}
