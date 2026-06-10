import {
  DocumentStatus,
  DocumentType,
  KycStatus,
  OrderEventType,
  OrderStatus,
  OrderType,
  PaymentStatus,
  PrismaClient,
  UserRole,
  UserStatus
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const currencies = [
  ["USD", "US Dollar", "$", "United States", "US", 84.3],
  ["EUR", "Euro", "EUR", "Eurozone", "EU", 91.2],
  ["GBP", "British Pound", "GBP", "United Kingdom", "GB", 107.8],
  ["SGD", "Singapore Dollar", "S$", "Singapore", "SG", 62.4],
  ["CAD", "Canadian Dollar", "C$", "Canada", "CA", 61.8],
  ["AUD", "Australian Dollar", "A$", "Australia", "AU", 55.1],
  ["NZD", "New Zealand Dollar", "NZ$", "New Zealand", "NZ", 50.6],
  ["CHF", "Swiss Franc", "CHF", "Switzerland", "CH", 95.9],
  ["JPY", "Japanese Yen", "JPY", "Japan", "JP", 0.58],
  ["AED", "UAE Dirham", "AED", "United Arab Emirates", "AE", 23.1],
  ["SAR", "Saudi Riyal", "SAR", "Saudi Arabia", "SA", 22.5],
  ["KWD", "Kuwaiti Dinar", "KD", "Kuwait", "KW", 274.2],
  ["THB", "Thai Baht", "THB", "Thailand", "TH", 2.34],
  ["IDR", "Indonesian Rupiah", "Rp", "Indonesia", "ID", 0.0053],
  ["VND", "Vietnamese Dong", "VND", "Vietnam", "VN", 0.0034],
  ["RUB", "Russian Ruble", "RUB", "Russia", "RU", 0.94],
  ["AZN", "Azerbaijani Manat", "AZN", "Azerbaijan", "AZ", 49.6],
  ["MYR", "Malaysian Ringgit", "RM", "Malaysia", "MY", 17.9],
  ["HKD", "Hong Kong Dollar", "HK$", "Hong Kong", "HK", 10.8],
  ["CNY", "Chinese Yuan", "CNY", "China", "CN", 11.7],
  ["TRY", "Turkish Lira", "TRY", "Turkey", "TR", 2.63],
  ["ZAR", "South African Rand", "R", "South Africa", "ZA", 4.62],
  ["QAR", "Qatari Riyal", "QAR", "Qatar", "QA", 23.2],
  ["OMR", "Omani Rial", "OMR", "Oman", "OM", 219.0],
  ["BHD", "Bahraini Dinar", "BD", "Bahrain", "BH", 224.0]
] as const;

async function seedCurrencies() {
  for (const [code, name, symbol, country, flagEmoji, mid] of currencies) {
    const currency = await prisma.currency.upsert({
      where: { code },
      update: { name, symbol, country, flagEmoji, isActive: true },
      create: { code, name, symbol, country, flagEmoji }
    });
    const existingRate = await prisma.currencyRate.findFirst({ where: { currencyId: currency.id } });
    if (!existingRate) {
      await prisma.currencyRate.create({
        data: {
          currencyId: currency.id,
          buyRate: Number(mid) + 0.7,
          sellRate: Math.max(Number(mid) - 0.7, 0.001),
          cardRate: Number(mid) + 0.9,
          margin: 0.018,
          source: "seed-demo"
        }
      });
    }
  }
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash("Demo1234!", 12);
  const users = [
    ["admin@currencykart.local", "Operations Admin", "+919810000001", UserRole.ADMIN],
    ["kyc@currencykart.local", "KYC Reviewer", "+919810000002", UserRole.KYC_REVIEWER],
    ["rates@currencykart.local", "Rate Manager", "+919810000003", UserRole.RATE_MANAGER],
    ["delivery@currencykart.local", "Delivery Manager", "+919810000004", UserRole.DELIVERY_MANAGER],
    ["aarav@example.com", "Aarav Mehta", "+919811111101", UserRole.CUSTOMER],
    ["naina@example.com", "Naina Kapoor", "+919811111102", UserRole.CUSTOMER],
    ["rohan@example.com", "Rohan Batra", "+919811111103", UserRole.CUSTOMER],
    ["ishita@example.com", "Ishita Rao", "+919811111104", UserRole.CUSTOMER]
  ] as const;

  for (const [email, name, phone, role] of users) {
    await prisma.user.upsert({
      where: { email },
      update: { name, phone, role, status: UserStatus.ACTIVE },
      create: {
        email,
        name,
        phone,
        role,
        status: UserStatus.ACTIVE,
        passwordHash,
        emailVerified: new Date(),
        phoneVerified: new Date()
      }
    });
  }
}

async function seedDemoOrders() {
  const admin = await prisma.user.findUniqueOrThrow({ where: { email: "admin@currencykart.local" } });
  const reviewer = await prisma.user.findUniqueOrThrow({ where: { email: "kyc@currencykart.local" } });
  const customers = await prisma.user.findMany({ where: { role: UserRole.CUSTOMER }, orderBy: { email: "asc" } });
  const specs = [
    { number: "CKFX-260606-A9K2Q1", user: customers[0], type: OrderType.BUY_FOREX, currency: "USD", amount: 2500, rate: 84.95, purpose: "Holiday travel", status: OrderStatus.KYC_PENDING, payment: PaymentStatus.PENDING, kyc: KycStatus.PENDING },
    { number: "CKFX-260605-P7D4L8", user: customers[1], type: OrderType.SELL_FOREX, currency: "EUR", amount: 850, rate: 89.95, purpose: "Returned from holiday", status: OrderStatus.PAYMENT_VERIFIED, payment: PaymentStatus.VERIFIED, kyc: KycStatus.APPROVED },
    { number: "CKFX-260604-S3M6X2", user: customers[2], type: OrderType.FOREX_CARD, currency: "GBP", amount: 1500, rate: 109.2, purpose: "Student education", status: OrderStatus.RATE_LOCKED, payment: PaymentStatus.PENDING, kyc: KycStatus.APPROVED },
    { number: "CKFX-260603-C8V1N5", user: customers[3], type: OrderType.CARD_RELOAD, currency: "AED", amount: 4000, rate: 23.45, purpose: "Business travel", status: OrderStatus.PROCESSING, payment: PaymentStatus.VERIFIED, kyc: KycStatus.APPROVED }
  ];

  for (const spec of specs) {
    await prisma.kycProfile.upsert({
      where: { userId: spec.user.id },
      update: { status: spec.kyc, reviewedBy: spec.kyc === KycStatus.APPROVED ? reviewer.id : null },
      create: {
        userId: spec.user.id,
        panNumber: `ABCDE${customers.indexOf(spec.user) + 1000}F`,
        passportNumber: `P${8500000 + customers.indexOf(spec.user)}`,
        address: "Delhi NCR demo address",
        status: spec.kyc,
        reviewedBy: spec.kyc === KycStatus.APPROVED ? reviewer.id : null,
        reviewNotes: spec.kyc === KycStatus.APPROVED ? "Demo KYC approved after document review." : null
      }
    });

    const lockActive = spec.status === OrderStatus.RATE_LOCKED;
    const order = await prisma.order.upsert({
      where: { orderNumber: spec.number },
      update: {
        status: spec.status,
        paymentStatus: spec.payment,
        kycStatus: spec.kyc,
        rateLockExpiresAt: lockActive ? new Date(Date.now() + 30 * 60_000) : undefined
      },
      create: {
        orderNumber: spec.number,
        userId: spec.user.id,
        type: spec.type,
        currencyCode: spec.currency,
        amount: spec.amount,
        rate: spec.rate,
        totalInINR: spec.amount * spec.rate,
        purpose: spec.purpose,
        destinationCountry: spec.currency === "AED" ? "United Arab Emirates" : "United Kingdom",
        travelDate: new Date("2026-07-15"),
        deliveryAddress: "Delhi NCR demo delivery address",
        status: spec.status,
        paymentStatus: spec.payment,
        kycStatus: spec.kyc,
        assignedTo: admin.id,
        rateLockedAt: lockActive ? new Date() : undefined,
        rateLockExpiresAt: lockActive ? new Date(Date.now() + 30 * 60_000) : undefined
      }
    });

    await prisma.document.deleteMany({ where: { orderId: order.id } });
    await prisma.document.createMany({
      data: [
        { userId: spec.user.id, orderId: order.id, type: DocumentType.PAN, fileUrl: `/secure-demo/${order.id}-pan.pdf`, status: DocumentStatus.APPROVED },
        { userId: spec.user.id, orderId: order.id, type: DocumentType.PASSPORT, fileUrl: `/secure-demo/${order.id}-passport.pdf`, status: spec.kyc === KycStatus.APPROVED ? DocumentStatus.APPROVED : DocumentStatus.PENDING }
      ]
    });

    await prisma.orderEvent.deleteMany({ where: { orderId: order.id } });
    await prisma.orderEvent.createMany({
      data: [
        { orderId: order.id, type: OrderEventType.ORDER_CREATED, title: "Order created", message: "Customer started the request." },
        { orderId: order.id, type: OrderEventType.ORDER_SUBMITTED, title: "Order submitted", message: "Documents and contact details submitted." },
        ...(spec.kyc === KycStatus.APPROVED ? [{ orderId: order.id, actorId: reviewer.id, type: OrderEventType.KYC_APPROVED, title: "KYC approved", message: "Required demo documents approved." }] : [])
      ]
    });

    if (spec.payment === PaymentStatus.VERIFIED) {
      await prisma.payment.upsert({
        where: { orderId: order.id },
        update: { status: PaymentStatus.VERIFIED, verifiedBy: admin.id, verifiedAt: new Date() },
        create: { orderId: order.id, provider: "demo-manual", providerPaymentId: `pay_demo_${order.id.slice(-6)}`, amount: order.totalInINR, status: PaymentStatus.VERIFIED, verifiedBy: admin.id, verifiedAt: new Date(), verificationNotes: "Seeded payment verification." }
      });
    }

    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: "DEMO_ORDER_SEEDED",
        entityType: "Order",
        entityId: order.id,
        newValue: { orderNumber: order.orderNumber, status: order.status }
      }
    });
  }
}

async function main() {
  await seedCurrencies();
  await seedUsers();
  await seedDemoOrders();
  console.log("Seeded currencies, staff, customers, KYC profiles, orders, payments, events and audit logs.");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
