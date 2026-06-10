import { UploadCloud } from "lucide-react";

export function KycUploadBox() {
  return (
    <div className="rounded-lg border border-dashed border-royal/60 bg-gradient-to-br from-blue-50 to-white p-6 text-center shadow-sm">
      <UploadCloud className="mx-auto text-royal" size={32} />
      <p className="mt-3 font-semibold text-navy">Upload documents securely</p>
      <p className="mt-1 text-sm text-slate-600">PAN, passport, visa, ticket and address proof can be reviewed by the KYC team.</p>
      <button className="mt-4 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(7,17,31,0.18)] transition hover:-translate-y-0.5">Choose file</button>
    </div>
  );
}
