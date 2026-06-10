export function CurrencyRateCard({ code, country, rate, flag }: { code: string; country: string; rate: string; flag: string }) {
  return (
    <div className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-premium">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-mist text-sm font-semibold text-navy">{flag}</span>
        <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-royal">{code}</span>
      </div>
      <p className="mt-4 text-sm text-slate-500">{country}</p>
      <p className="mt-1 text-xl font-semibold text-navy">{rate}</p>
      <p className="mt-3 text-xs text-slate-500">Illustrative only. A confirmed rate requires review.</p>
    </div>
  );
}
