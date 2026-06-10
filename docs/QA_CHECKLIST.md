# Production QA Checklist

Record the tester, environment, date, result and evidence for every item.

## Authentication

- Register a new customer with a unique email and phone.
- Verify password requirements, duplicate-account handling and inactive-account rejection.
- Request mobile OTP; verify five-minute expiry, five-attempt maximum and 60-second resend cooldown.
- Confirm a verified OTP can establish one session and cannot be reused.
- Test Google OAuth callback and logout.
- Confirm customer, staff and suspended-user access boundaries.
- Enable `ADMIN_2FA_REQUIRED=true`; confirm admin APIs reject actions until 2FA succeeds.

## KYC and private documents

- Upload each supported MIME type and reject unsupported files or files over 8 MB.
- Confirm upload URLs expire and target a private bucket.
- Confirm customers cannot list or download another customer's documents.
- Confirm only permitted staff roles can download documents.
- Approve and reject KYC with notes; verify timeline, email and audit records.

## Orders

- Create BUY_FOREX, SELL_FOREX, FOREX_CARD and CARD_RELOAD orders.
- Verify dynamic document checklists for holiday, business, student and medical purposes.
- Confirm invalid lifecycle transitions return a controlled error.
- Verify customer ownership checks on order, invoice and document APIs.

## Admin operations

- Filter orders by status, currency, date, customer and payment status.
- Test order acceptance/rejection, KYC decisions and mandatory notes.
- Confirm every successful and denied admin action creates the expected audit entry.
- Confirm role-specific permissions for KYC, rates, delivery, support and admin users.

## Rate locks

- Lock a rate for a known duration and verify the customer countdown.
- Confirm an expired rate cannot be used for payment verification.
- Re-lock and confirm totals are recalculated and events are appended.

## Payments and invoices

- Create a Razorpay order with test credentials.
- Send valid, invalid and duplicate webhook events.
- Confirm invalid signatures are rejected and recorded.
- Confirm captured payments update payment and order state idempotently.
- Generate an invoice placeholder and request a signed private download.

## Notifications

- Test order-submitted, KYC-approved/rejected, payment-verified and order-completed email templates.
- Test approved WhatsApp templates and destination formatting.
- Confirm provider failures are logged without exposing credentials or document data.

## Responsive and accessibility QA

- Test 320 px, 375 px, 768 px, 1024 px and 1440 px widths.
- Test mobile navigation, calculators, forms, tables, dashboards and legal pages.
- Verify keyboard navigation, visible focus, labels, colour contrast and error announcements.
- Test Safari, Chrome, Firefox and Edge on supported versions.

## SEO and content

- Confirm page titles, descriptions, canonical URLs, Open Graph and Twitter previews.
- Validate `sitemap.xml`, `robots.txt`, LocalBusiness and FAQ structured data.
- Confirm private routes are not indexed.
- Replace fallback brand, legal, address, phone, email and social-preview details.

## Policies and compliance

- Complete Indian legal review of Terms, Privacy, Refund/Cancellation and KYC policies.
- Verify fulfilment-partner and licence details before publishing them.
- Confirm no page claims RBI authorisation without verified evidence.
- Review FEMA/RBI wording against current official directions before launch.
