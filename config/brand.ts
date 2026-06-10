export const brand = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? "CurrencyKart",
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME ?? "CurrencyKart",
  domain: process.env.NEXT_PUBLIC_DOMAIN ?? "currencykart.in",
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME ?? "Your Legal Entity Name",
  tagline: "Premium online forex, travel card, currency buy/sell and travel insurance assistance",
  positioning:
    "CurrencyKart helps travellers, students, families and businesses request forex, forex cards, travel insurance and currency buyback assistance with secure KYC, document review and authorised-partner fulfilment.",
  cityFocus: "Delhi NCR",
  expansionFocus: "Delhi NCR first, expandable across India",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://currencykart.in",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+91 98765 43210",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@currencykart.in",
  ordersEmail: process.env.NEXT_PUBLIC_ORDERS_EMAIL ?? "orders@currencykart.in",
  kycEmail: process.env.NEXT_PUBLIC_KYC_EMAIL ?? "kyc@currencykart.in",
  whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/919876543210",
  registeredAddress: process.env.NEXT_PUBLIC_REGISTERED_ADDRESS ?? "Registered office address to be added before launch",
  licenceDetails: process.env.NEXT_PUBLIC_LICENCE_DETAILS ?? "",
  partnerDetails: process.env.NEXT_PUBLIC_AUTHORISED_PARTNER_DETAILS ?? "",
  logo: "/brand/logo.svg",
  logoDark: "/brand/logo-dark.svg",
  logoLight: "/brand/logo-light.svg",
  logoMark: "/brand/logo-mark.svg",
  complianceLine:
    "Foreign-exchange services are arranged through eligible authorised partners and remain subject to applicable FEMA/RBI requirements, KYC checks, document verification and availability.",
  disclaimer:
    "The website does not represent the placeholder brand as independently authorised by the Reserve Bank of India. Licence and partner details must be published only after verification."
};

export const serviceAreas = [
  { name: "Delhi", copy: "Travel-forex assistance for customers across Central, South, West, East and North Delhi, subject to serviceability." },
  { name: "Gurgaon", copy: "Order coordination for holiday, student and corporate travellers across Gurugram and nearby business districts." },
  { name: "Noida", copy: "Forex order and document-support assistance across Noida and Greater Noida serviceable locations." },
  { name: "Faridabad", copy: "Callback-led forex enquiries and eligible doorstep coordination across Faridabad." },
  { name: "Ghaziabad", copy: "Travel-money assistance for customers in Ghaziabad and nearby Delhi NCR areas, subject to verification." }
];
