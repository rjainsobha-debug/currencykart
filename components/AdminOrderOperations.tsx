"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, FileCheck2, Filter, Loader2, LockKeyhole, ReceiptText, Search, ShieldX, WalletCards } from "lucide-react";
import { StatusState } from "./StatusState";

type AdminOrder = {
  id: string;
  orderNumber: string;
  type: string;
  currencyCode: string;
  amount: string;
  status: string;
  paymentStatus: string;
  user: { name?: string | null; email?: string | null };
};

const actions = [
  [FileCheck2, "Approve KYC", "APPROVE_KYC"],
  [ShieldX, "Reject KYC", "REJECT_KYC"],
  [LockKeyhole, "Lock rate", "LOCK_RATE"],
  [WalletCards, "Verify payment", "VERIFY_PAYMENT"],
  [CheckCircle2, "Complete order", "COMPLETE_ORDER"],
  [ReceiptText, "Generate invoice", "GENERATE_INVOICE"]
] as const;

export function AdminOrderOperations() {
  const [filters, setFilters] = useState({ status: "", currency: "", paymentStatus: "", customer: "", dateFrom: "" });
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState("");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const fetchOrders = useCallback(async () => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    try {
      const response = await fetch(`/api/admin/orders?${params}`, { credentials: "include", cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? "Could not load orders.");
      setOrders(payload.orders);
      setSelected((current) => payload.orders.find((order: AdminOrder) => order.id === current?.id) ?? payload.orders[0] ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { void fetchOrders(); }, [fetchOrders]);

  async function loadOrders() {
    setLoading(true);
    setError("");
    await fetchOrders();
  }

  async function runAction(action: string) {
    if (!selected) return;
    setActing(action);
    setFeedback("");
    setError("");
    try {
      const response = await fetch(`/api/admin/orders/${selected.id}/actions`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          notes,
          ...(action === "LOCK_RATE" ? { rate: Number(selected.amount) > 0 ? undefined : undefined, lockMinutes: 30 } : {})
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? payload.error ?? "Action failed.");
      setFeedback(`${action.replaceAll("_", " ")} completed and audited.`);
      setNotes("");
      await loadOrders();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Action failed.");
    } finally {
      setActing("");
    }
  }

  return (
    <div className="mt-8 grid gap-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-navy"><Filter size={17} />Order filters</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <select className="premium-field" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All statuses</option>{["SUBMITTED", "KYC_PENDING", "KYC_APPROVED", "RATE_LOCKED", "PAYMENT_VERIFIED", "PROCESSING"].map((item) => <option key={item}>{item}</option>)}</select>
          <select className="premium-field" value={filters.currency} onChange={(e) => setFilters({ ...filters, currency: e.target.value })}><option value="">All currencies</option>{["USD", "EUR", "GBP", "AED"].map((item) => <option key={item}>{item}</option>)}</select>
          <select className="premium-field" value={filters.paymentStatus} onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}><option value="">All payments</option><option>PENDING</option><option>VERIFIED</option><option>FAILED</option></select>
          <label className="relative"><Search className="absolute left-3 top-3.5 text-slate-400" size={16} /><input className="premium-field w-full pl-9" placeholder="Customer" value={filters.customer} onChange={(e) => setFilters({ ...filters, customer: e.target.value })} /></label>
          <input className="premium-field" type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} />
        </div>
      </div>

      {error ? <StatusState type="error" message={error} /> : null}
      {feedback ? <StatusState type="success" title="Server action completed" message={feedback} /> : null}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5"><h2 className="font-semibold text-navy">Operations queue</h2><p className="mt-1 text-xs text-slate-500">{loading ? "Loading authenticated queue..." : `${orders.length} orders match current filters`}</p></div>
          {loading ? <div className="grid place-items-center p-12 text-slate-500"><Loader2 className="animate-spin" /></div> : orders.length === 0 ? <div className="p-6"><StatusState type="empty" message="No orders match these filters." /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-mist text-xs uppercase text-slate-500"><tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Service</th><th className="p-4">Currency</th><th className="p-4">Status</th></tr></thead>
                <tbody>{orders.map((order) => <tr key={order.id} onClick={() => setSelected(order)} className={`cursor-pointer border-t border-slate-100 transition hover:bg-blue-50/50 ${selected?.id === order.id ? "bg-blue-50" : ""}`}><td className="p-4 font-semibold text-navy">{order.orderNumber}</td><td className="p-4">{order.user.name ?? order.user.email}</td><td className="p-4">{order.type}</td><td className="p-4">{order.currencyCode} {String(order.amount)}</td><td className="p-4"><span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">{order.status}</span></td></tr>)}</tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal">Selected order</p>
          {selected ? <>
            <h2 className="mt-2 font-semibold text-navy">{selected.orderNumber}</h2>
            <p className="mt-1 text-sm text-slate-600">{selected.user.name} | {selected.type} | {selected.currencyCode} {String(selected.amount)}</p>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-5 min-h-24 w-full rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-royal focus:ring-4 focus:ring-blue-500/10" placeholder="Approval, rejection or review notes" />
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {actions.map(([Icon, label, action]) => <button key={action} disabled={Boolean(acting)} onClick={() => void runAction(action)} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-left text-sm font-semibold text-navy transition hover:border-blue-200 hover:bg-blue-50 disabled:opacity-50"><Icon size={16} />{acting === action ? "Working..." : label}</button>)}
            </div>
          </> : <StatusState type="empty" message="Select an order to review available server-side actions." />}
          <p className="mt-4 text-xs leading-5 text-slate-500">The API derives your identity from the session, enforces action-specific roles and writes an audit log.</p>
        </div>
      </div>
    </div>
  );
}
