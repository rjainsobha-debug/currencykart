export function DashboardSkeleton() {
  return (
    <div className="section-shell animate-pulse py-10">
      <div className="h-4 w-32 rounded bg-slate-200" />
      <div className="mt-4 h-9 w-72 rounded bg-slate-200" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => <div key={item} className="h-28 rounded-lg bg-slate-200" />)}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="h-96 rounded-lg bg-slate-200 lg:col-span-2" />
        <div className="h-96 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}
