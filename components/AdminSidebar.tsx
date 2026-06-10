import Link from "next/link";
import { BarChart3, FileCheck, IndianRupee, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const items: Array<[string, LucideIcon]> = [
  ["Overview", BarChart3],
  ["KYC", FileCheck],
  ["Rates", IndianRupee],
  ["Customers", Users]
];

export function AdminSidebar() {
  return (
    <aside className="rounded-lg bg-gradient-to-b from-ink to-[#102a54] p-4 text-white shadow-premium">
      <p className="px-2 text-sm font-semibold text-white/65">Admin console</p>
      <div className="mt-4 grid gap-2">
        {items.map(([label, Icon]) => (
          <Link key={label} href="/admin" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white">
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
