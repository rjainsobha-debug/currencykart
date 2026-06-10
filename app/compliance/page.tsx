import Link from "next/link";
import { PolicyPage } from "@/components/PolicyPage";
import { brand } from "@/config/brand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FEMA and RBI Compliance Information",
  description: "General information about authorised persons, KYC and regulatory review for foreign-exchange transactions in India.",
  path: "/compliance"
});

export default function CompliancePage() {
  return (
    <>
      <PolicyPage eyebrow="Regulatory information" title="FEMA and RBI Compliance Information" introduction="This page provides general information only. It is not legal advice and does not replace FEMA, RBI directions or professional guidance." sections={[
        { title: "Authorised persons", paragraphs: ["Under FEMA, an authorised person is an authorised dealer, money changer or another person authorised by the Reserve Bank of India under Section 10 to deal in foreign exchange. Foreign-exchange transactions should be undertaken with authorised persons and for permitted purposes."] },
        { title: "Platform position", paragraphs: [`${brand.name} is a configurable placeholder brand. Unless verified authorisation and licence details are published, this website must not be interpreted as claiming that the brand itself is RBI-authorised. Requests are described as being arranged through eligible authorised partners.`] },
        { title: "KYC, AML and purpose checks", paragraphs: ["RBI directions for money-changing activities include customer-identification and KYC/AML expectations. Depending on the service, customers may need to provide identity, address, travel and purpose documents before a request can be accepted."] },
        { title: "Rates and fulfilment", paragraphs: ["Displaying a calculator or sample rate does not guarantee a transaction. Availability, permitted purpose, documentation, partner approval, payment verification and time-limited rate confirmation may all apply."] },
        { title: "Customer care", bullets: ["Verify the legal name and authorisation details of the entity fulfilling the transaction.", "Use verified payment instructions and retain transaction receipts.", "Do not transact for prohibited purposes or provide inaccurate declarations.", "Refer to current RBI directions because regulatory requirements can change."] }
      ]} />
      <section className="section-shell max-w-4xl pb-12">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-navy">Official references</h2>
          <div className="mt-4 grid gap-3 text-sm text-royal">
            <Link href="https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=11518">RBI Master Direction: Money Changing Activities</Link>
            <Link href="https://www.rbi.org.in/scripts/FS_FAQs.aspx?Id=146">RBI FAQ: Foreign Exchange Transactions</Link>
            <Link href="https://www.indiacode.nic.in/handle/123456789/1988?locale=en">India Code: Foreign Exchange Management Act, 1999</Link>
          </div>
        </div>
      </section>
    </>
  );
}
