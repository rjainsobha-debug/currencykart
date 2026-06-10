const rows = [
  ["USD", "US Dollar", "INR 84.95", "INR 83.20", "INR 85.10"],
  ["EUR", "Euro", "INR 91.80", "INR 89.95", "INR 92.20"],
  ["GBP", "British Pound", "INR 108.60", "INR 106.75", "INR 109.20"],
  ["AED", "UAE Dirham", "INR 23.35", "INR 22.75", "INR 23.45"],
  ["SGD", "Singapore Dollar", "INR 62.90", "INR 61.45", "INR 63.10"]
];

export function CurrencyTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-navy">Indicative live rates</p>
          <p className="mt-1 text-xs text-slate-500">Admin editable, with history and approval controls.</p>
        </div>
        <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">Illustrative sample rates</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-gradient-to-r from-navy to-[#12366d] text-white">
            <tr>
              <th className="p-4">Currency</th>
              <th className="p-4">Name</th>
              <th className="p-4">Buy</th>
              <th className="p-4">Sell</th>
              <th className="p-4">Card</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-t border-slate-100 transition hover:bg-blue-50/50">
                {row.map((cell) => (
                  <td key={cell} className="p-4 text-slate-700 first:font-semibold first:text-navy">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
