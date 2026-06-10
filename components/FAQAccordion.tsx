const faqs = [
  ["Can I complete a forex transaction entirely online?", "You can submit an enquiry, verify your account and upload documents online. Final approval, payment and fulfilment depend on KYC, permitted purpose, serviceability and acceptance by an eligible authorised partner."],
  ["Which documents may be required?", "PAN, passport, visa, confirmed ticket, address proof and purpose-specific documents may be requested. Requirements vary by service and customer profile."],
  ["Are website rates final?", "No. Website rates and calculator outputs are illustrative or indicative. A rate becomes actionable only when expressly confirmed for a stated period after review."],
  ["Is doorstep service available across Delhi NCR?", "Eligible delivery or pickup may be coordinated in serviceable parts of Delhi, Gurgaon, Noida, Greater Noida, Faridabad and Ghaziabad after verification."],
  ["Who provides travel insurance?", "Insurance enquiries are shared with suitable providers or intermediaries. Coverage, premium, exclusions and issuance remain subject to the relevant insurer's terms and underwriting."]
];

export function FAQAccordion() {
  return (
    <div className="grid gap-3">
      {faqs.map(([q, a]) => (
        <details key={q} className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition open:border-blue-200 open:shadow-premium">
          <summary className="cursor-pointer font-semibold text-navy marker:text-royal">{q}</summary>
          <p className="mt-3 text-sm leading-6 text-slate-600">{a}</p>
        </details>
      ))}
    </div>
  );
}
