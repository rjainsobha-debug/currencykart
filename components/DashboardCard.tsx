export function DashboardCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-premium">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-navy">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{note}</p>
    </div>
  );
}
