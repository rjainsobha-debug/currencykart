export function StepTimeline({ steps }: { steps: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {steps.map((step, index) => (
        <div key={step} className="rounded-lg border border-slate-200 bg-white p-5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-sm font-bold text-ink">{index + 1}</span>
          <p className="mt-4 font-semibold text-navy">{step}</p>
        </div>
      ))}
    </div>
  );
}
