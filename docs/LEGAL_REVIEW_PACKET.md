# Indian Legal and FEMA Review Packet

This document identifies public content that requires review by Indian counsel or a FEMA/RBI compliance consultant. It is not legal advice.

## Entity and authorisation facts to confirm

- Final brand and legal-entity name.
- Registered office, grievance contact and customer-support details.
- Whether the entity itself holds any RBI/FEMA authorisation.
- Legal name, licence category and scope of every fulfilment partner.
- How partner identity is disclosed before transaction acceptance.
- Permitted service areas, products, transaction limits and customer categories.

## Public pages requiring review

### Homepage and shared footer

Files:

- `app/page.tsx`
- `components/SiteFooter.tsx`
- `components/ServiceAreas.tsx`
- `config/brand.ts`

Review:

- Authorised-partner wording.
- Doorstep-delivery and serviceability statements.
- Rate, estimate and rate-lock disclaimers.
- LocalBusiness structured-data claims.
- Whether contact and address information meets consumer/grievance requirements.

### Service pages

- `app/buy-forex/page.tsx`
- `app/sell-forex/page.tsx`
- `app/forex-card/page.tsx`
- `app/student-forex/page.tsx`
- `app/corporate-forex/page.tsx`
- `app/travel-insurance/page.tsx`

Review:

- Permitted-purpose language and document requirements.
- Currency sale/purchase, card issuance/reload and delivery representations.
- Insurance intermediary/distribution wording and insurer responsibility.
- Corporate and student remittance distinctions.

### Terms and Conditions

File: `app/terms/page.tsx`

Review:

- Platform versus regulated service-provider role.
- Contract formation, rate-lock effect, charges, taxes and fulfilment obligations.
- Customer declarations, prohibited use, limitation of liability and dispute terms.
- Governing law, jurisdiction and grievance process.

### Privacy Policy

File: `app/privacy/page.tsx`

Review:

- DPDP Act applicability, consent/notice requirements and data-principal rights.
- Sensitive KYC-document collection, processors, cross-border transfers and retention.
- Grievance/contact requirements, breach response and lawful disclosure.

### Refund and Cancellation Policy

File: `app/refund-cancellation/page.tsx`

Review:

- Actual cancellation charges and rate-loss treatment.
- Refund eligibility, timelines, payment channels and non-refundable provider costs.
- Card, delivery and insurance-provider terms.

### KYC and Document Policy

File: `app/kyc-document-policy/page.tsx`

Review:

- Applicable KYC/AML rules, document lists and enhanced due diligence.
- Original-document verification, beneficial ownership and record retention.
- Rejection reasons and secure storage/access.

### FEMA/RBI Information

File: `app/compliance/page.tsx`

Review:

- Section 10 “authorised person” explanation.
- RBI Master Direction references and current applicability.
- LRS, permitted-purpose and transaction-limit implications.
- Whether any disclaimer could still imply authorisation or regulatory endorsement.

### FAQ, SEO and structured data

Files:

- `app/faq/page.tsx`
- `components/FAQAccordion.tsx`
- `lib/seo.ts`
- `app/sitemap.ts`

Review:

- Simplified compliance answers.
- Local service and fulfilment claims.
- Search snippets and schema fields that could be treated as advertising claims.

## Operational communications requiring review

- Email templates for order submission, KYC decisions, payment verification and completion.
- WhatsApp approved templates.
- SMS OTP wording and sender identification.
- Invoice/receipt format, partner identity, taxes, charges and regulatory disclosures.
- Customer declarations collected during order submission.

## Required counsel output

- Approved marked-up copy for every page/template.
- Verified authorisation/partner disclosure wording.
- Final retention schedule and privacy notice.
- Final refund/cancellation table.
- Required customer declarations and invoice fields.
- Grievance, jurisdiction and escalation wording.
- Written list of prohibited claims and mandatory evidence.
