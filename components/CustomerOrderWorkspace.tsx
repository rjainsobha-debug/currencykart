"use client";

import { Download, Loader2, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { RateLockTimer } from "./RateLockTimer";
import { DocumentChecklist } from "./DocumentChecklist";
import { StatusState } from "./StatusState";
import { brand } from "@/config/brand";

type CustomerOrder = {
  id: string;
  orderNumber: string;
  type: string;
  currencyCode: string;
  amount: string;
  rate: string;
  status: string;
  rateLockExpiresAt?: string | null;
  invoiceUrl?: string | null;
  events: Array<{ id: string; title: string; message?: string | null; createdAt: string }>;
};

export function CustomerOrderWorkspace() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [selected, setSelected] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/orders", { credentials: "include", cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error?.message ?? "Could not load your orders.");
        setOrders(payload.orders);
        setSelected(payload.orders[0] ?? null);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Could not load your orders.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="mt-8 grid place-items-center rounded-lg border border-slate-200 bg-white p-12 text-slate-500"><Loader2 className="animate-spin" /></div>;
  if (error) return <StatusState className="mt-8" type="error" message={error} />;
  if (!selected) return <StatusState className="mt-8" type="empty" message="Your submitted forex requests will appear here." />;

  async function downloadInvoice() {
    if (!selected?.invoiceUrl) return;
    setInvoiceLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/orders/${selected.id}/invoice`, { credentials: "include", cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? "Invoice download is unavailable.");
      window.location.href = payload.downloadUrl;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Invoice download is unavailable.");
    } finally {
      setInvoiceLoading(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      <div className="grid gap-6 lg:col-span-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {orders.map((order) => <button key={order.id} onClick={() => setSelected(order)} className={`shrink-0 rounded-md px-3 py-2 text-sm font-semibold ${selected.id === order.id ? "bg-navy text-white" : "border border-slate-200 bg-white text-navy"}`}>{order.orderNumber}</button>)}
        </div>
        <DocumentChecklist />
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal">Active order</p><h2 className="mt-2 text-xl font-semibold text-navy">{selected.orderNumber}</h2><p className="mt-1 text-sm text-slate-500">{selected.type} | {selected.currencyCode} {String(selected.amount)} | Rate INR {String(selected.rate)}</p></div>
            <a href={brand.whatsappUrl} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald px-4 text-sm font-semibold text-white"><MessageCircle size={16} />WhatsApp support</a>
          </div>
          {selected.rateLockExpiresAt ? <div className="mt-5"><RateLockTimer expiresAt={selected.rateLockExpiresAt} /></div> : <div className="mt-5"><StatusState type="loading" title="Rate not locked yet" message="The rate desk will issue a time-limited lock after KYC approval." /></div>}
        </div>
      </div>
      <div className="grid content-start gap-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-navy">Order timeline</h2>
          <div className="mt-5 grid gap-4">{selected.events.map((event) => <div key={event.id} className="border-l-2 border-royal pl-4"><p className="text-sm font-semibold text-navy">{event.title}</p><p className="mt-1 text-xs text-slate-500">{event.message ?? new Date(event.createdAt).toLocaleString("en-IN")}</p></div>)}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <Download className="text-royal" size={20} /><h2 className="mt-4 font-semibold text-navy">Invoice and receipt</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Downloads are issued through authenticated, short-lived signed URLs when an invoice is available.</p>
          <button onClick={() => void downloadInvoice()} className="mt-4 rounded-md bg-mist px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 disabled:opacity-50" disabled={!selected.invoiceUrl || invoiceLoading}>{selected.invoiceUrl ? (invoiceLoading ? "Signing URL..." : "Request signed download") : "Invoice pending"}</button>
        </div>
      </div>
    </div>
  );
}
