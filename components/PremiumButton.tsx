import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function PremiumButton({ href, children, variant = "primary", className }: Props) {
  const classes = cn(
    "group inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-[0.98]",
    variant === "primary" && "bg-gradient-to-r from-royal to-blue-700 text-white shadow-[0_16px_38px_rgba(36,88,255,0.28)] hover:-translate-y-0.5 hover:shadow-[0_22px_46px_rgba(36,88,255,0.34)]",
    variant === "secondary" && "border border-white/70 bg-white text-navy shadow-sm hover:-translate-y-0.5 hover:bg-mist",
    variant === "ghost" && "text-white hover:bg-white/10",
    className
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
        <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}
