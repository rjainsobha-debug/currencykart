import { ShieldCheck } from "lucide-react";

export function TrustBadge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/86 shadow-sm backdrop-blur">
      <ShieldCheck size={16} />
      {text}
    </div>
  );
}
