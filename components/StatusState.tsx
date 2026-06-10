import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  empty: { icon: Clock, title: "Nothing here yet", tone: "bg-slate-50 text-slate-700 border-slate-200" },
  loading: { icon: Loader2, title: "Loading", tone: "bg-blue-50 text-blue-800 border-blue-100" },
  error: { icon: AlertCircle, title: "Needs attention", tone: "bg-red-50 text-red-800 border-red-100" },
  success: { icon: CheckCircle2, title: "All set", tone: "bg-emerald-50 text-emerald-800 border-emerald-100" }
};

export function StatusState({
  type,
  title,
  message,
  className
}: {
  type: keyof typeof variants;
  title?: string;
  message: string;
  className?: string;
}) {
  const variant = variants[type];
  const Icon = variant.icon;

  return (
    <div className={cn("rounded-lg border p-4", variant.tone, className)}>
      <div className="flex items-start gap-3">
        <Icon className={type === "loading" ? "mt-0.5 animate-spin" : "mt-0.5"} size={18} />
        <div>
          <p className="text-sm font-semibold">{title ?? variant.title}</p>
          <p className="mt-1 text-sm opacity-80">{message}</p>
        </div>
      </div>
    </div>
  );
}
