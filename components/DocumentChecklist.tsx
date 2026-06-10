"use client";

import { CheckCircle2, Circle, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { getDocumentChecklist } from "@/lib/document-checklist";

export function DocumentChecklist() {
  const [orderType, setOrderType] = useState("BUY_FOREX");
  const [purpose, setPurpose] = useState("Holiday travel");
  const checklist = useMemo(() => getDocumentChecklist(orderType, purpose), [orderType, purpose]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-blue-50 text-royal"><FileText size={19} /></span>
        <div><h2 className="font-semibold text-navy">Dynamic document checklist</h2><p className="text-xs text-slate-500">Updates by service and travel purpose.</p></div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <select className="premium-field" value={orderType} onChange={(event) => setOrderType(event.target.value)}>
          <option value="BUY_FOREX">Buy forex</option>
          <option value="SELL_FOREX">Sell forex</option>
          <option value="FOREX_CARD">New forex card</option>
          <option value="CARD_RELOAD">Card reload</option>
        </select>
        <select className="premium-field" value={purpose} onChange={(event) => setPurpose(event.target.value)}>
          <option>Holiday travel</option>
          <option>Business travel</option>
          <option>Student education</option>
          <option>Medical travel</option>
        </select>
      </div>
      <div className="mt-5 grid gap-3">
        {checklist.map((item, index) => (
          <div key={`${item.type}-${item.label}`} className="flex items-start gap-3 rounded-md bg-mist p-4">
            {index < 2 ? <CheckCircle2 className="mt-0.5 text-emerald" size={17} /> : <Circle className="mt-0.5 text-slate-400" size={17} />}
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-navy">{item.label}</p><span className={`text-xs font-semibold ${item.required ? "text-red-600" : "text-slate-500"}`}>{item.required ? "Required" : "If applicable"}</span></div>
              <p className="mt-1 text-xs text-slate-500">{item.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
