import { cn } from "@/lib/utils";

export function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("glass premium-gradient-border rounded-lg p-6 shadow-premium", className)}>{children}</div>;
}
