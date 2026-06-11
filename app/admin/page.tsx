import { AdminSidebar } from "@/components/AdminSidebar";
import { DashboardCard } from "@/components/DashboardCard";
import { PremiumNavbar } from "@/components/PremiumNavbar";
import { MotionReveal, MotionStagger, MotionItem } from "@/components/MotionReveal";
import { StatusState } from "@/components/StatusState";
import { AdminOrderOperations } from "@/components/AdminOrderOperations";
import { AdminTwoFactorPanel } from "@/components/AdminTwoFactorPanel";

export const dynamic = "force-dynamic";

const queues = ["New orders", "Pending KYC", "Payment verification", "Currency rates", "Insurance leads", "Forex card leads", "Document review", "Delivery management", "Staff roles", "Audit logs", "Reports"];

export default function AdminDashboardPage() {
  return (
    <>
      <PremiumNavbar />
      <main className="section-shell grid gap-6 py-10 lg:grid-cols-[250px_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start"><AdminSidebar /></div>
        <section>
          <MotionReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-royal">Operations console</p>
            <h1 className="mt-2 text-3xl font-semibold text-navy">Admin dashboard</h1>
            <p className="mt-3 text-slate-600">Review exceptions first, then move orders through KYC, payment and fulfilment.</p>
            <p className="mt-2 text-xs font-semibold text-amber-700">Overview metrics below are illustrative until connected to live aggregate queries.</p>
          </MotionReveal>
          <MotionStagger className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MotionItem><DashboardCard label="New orders" value="18" note="Awaiting triage" /></MotionItem>
            <MotionItem><DashboardCard label="Pending KYC" value="11" note="Reviewer queue" /></MotionItem>
            <MotionItem><DashboardCard label="Payments" value="7" note="Need verification" /></MotionItem>
            <MotionItem><DashboardCard label="Rate updates" value="25" note="Active currencies" /></MotionItem>
          </MotionStagger>
          <MotionReveal className="mt-6"><StatusState type="error" title="Three ageing KYC cases" message="These requests have remained pending beyond the internal review target." /></MotionReveal>
          <AdminTwoFactorPanel />
          <AdminOrderOperations />
          <MotionStagger className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {queues.map((item) => (
              <MotionItem key={item}>
                <div className="h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-premium">
                  <p className="font-semibold text-navy">{item}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Search, filters, assignment, notes and audit history.</p>
                </div>
              </MotionItem>
            ))}
          </MotionStagger>
        </section>
      </main>
    </>
  );
}
