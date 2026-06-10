import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const brandDir = path.join(root, "public", "brand");
const imageDir = path.join(root, "public", "images");
await fs.mkdir(brandDir, { recursive: true });
await fs.mkdir(imageDir, { recursive: true });

function mark({ dark = false } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="CurrencyKart mark">
  <defs>
    <linearGradient id="g" x1="18" y1="14" x2="112" y2="116" gradientUnits="userSpaceOnUse"><stop stop-color="#0B1B32"/><stop offset="0.48" stop-color="#123F5A"/><stop offset="1" stop-color="#00A887"/></linearGradient>
    <linearGradient id="gold" x1="28" y1="20" x2="96" y2="100" gradientUnits="userSpaceOnUse"><stop stop-color="#F8D37B"/><stop offset="1" stop-color="#B88A2E"/></linearGradient>
  </defs>
  <rect x="10" y="10" width="108" height="108" rx="24" fill="${dark ? "#07111F" : "url(#g)"}"/>
  <path d="M36 46h56l-7 31H43L36 46Z" fill="none" stroke="url(#gold)" stroke-width="7" stroke-linejoin="round"/>
  <path d="M40 46c4-13 14-22 28-22 10 0 18 4 24 11" fill="none" stroke="#F8D37B" stroke-width="6" stroke-linecap="round"/>
  <path d="M91 35h15v15" fill="none" stroke="#F8D37B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M35 82c8 11 19 17 33 17 11 0 21-4 29-12" fill="none" stroke="#34D6B4" stroke-width="6" stroke-linecap="round"/>
  <path d="M35 82H20V67" fill="none" stroke="#34D6B4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="48" cy="91" r="5" fill="#F8D37B"/><circle cx="84" cy="91" r="5" fill="#F8D37B"/>
</svg>`;
}

function logo({ variant = "dark" } = {}) {
  const text = variant === "light" ? "#FFFFFF" : "#07111F";
  const sub = variant === "light" ? "#BBD4DD" : "#516173";
  const bg = variant === "light" ? "#07111F" : "transparent";
  const inner = mark({ dark: variant === "light" }).replace(/^<svg[^>]*>/, "").replace("</svg>", "");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 180" role="img" aria-label="CurrencyKart logo">
  <rect width="720" height="180" fill="${bg}"/>
  <g transform="translate(30 28) scale(.98)">${inner}</g>
  <text x="166" y="82" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="800" fill="${text}">CurrencyKart</text>
  <text x="170" y="116" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="600" letter-spacing="1.6" fill="${sub}">TRAVEL MONEY, DELIVERED SMARTLY</text>
  <path d="M170 136h212" stroke="#C9A24D" stroke-width="5" stroke-linecap="round"/>
</svg>`;
}

function scene(title, subtitle, theme) {
  const paths = {
    forex: ["M115 330h270", "M150 290h210", "M185 250h150"],
    card: ["M110 225h360v210H110z", "M140 282h320", "M140 365h110"],
    insurance: ["M290 140l145 56v112c0 92-64 138-145 164-81-26-145-72-145-164V196z", "M237 305l43 43 90-105"],
    student: ["M105 250l285-112 285 112-285 112z", "M204 312v88c90 48 186 48 276 0v-88"],
    corporate: ["M170 180h300v310H170z", "M225 230h55M340 230h55M225 295h55M340 295h55M225 360h55M340 360h55"],
    kyc: ["M190 150h300v360H190z", "M245 235h180M245 300h180M245 365h120", "M455 430l55 55 98-118"],
    doorstep: ["M120 360c110-120 240-120 350 0", "M350 190c58 0 105 47 105 105 0 70-105 170-105 170S245 365 245 295c0-58 47-105 105-105z"]
  }[theme];
  const inner = mark().replace(/^<svg[^>]*>/, "").replace("</svg>", "");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07111F"/><stop offset=".62" stop-color="#0E354B"/><stop offset="1" stop-color="#087F74"/></linearGradient></defs>
  <rect width="1200" height="760" fill="url(#bg)"/><circle cx="1020" cy="140" r="210" fill="#C9A24D" opacity=".12"/><circle cx="180" cy="680" r="260" fill="#34D6B4" opacity=".13"/>
  <g transform="translate(700 95)"><rect width="340" height="470" rx="28" fill="#FFFFFF" opacity=".12"/><path d="M50 120h240M50 180h200M50 240h245M50 300h165" stroke="#FFFFFF" opacity=".55" stroke-width="18" stroke-linecap="round"/><rect x="50" y="360" width="190" height="56" rx="14" fill="#C9A24D" opacity=".9"/></g>
  <g fill="none" stroke="#F6D37B" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">${paths.map((d) => `<path d="${d}"/>`).join("")}</g>
  <g transform="translate(78 82)">${inner}</g>
  <text x="84" y="610" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="800" fill="#FFFFFF">${title}</text>
  <text x="88" y="660" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="600" fill="#D8E7EE">${subtitle}</text>
</svg>`;
}

await fs.writeFile(path.join(brandDir, "logo-mark.svg"), mark());
await fs.writeFile(path.join(brandDir, "favicon.svg"), mark());
await fs.writeFile(path.join(brandDir, "logo.svg"), logo({ variant: "dark" }));
await fs.writeFile(path.join(brandDir, "logo-dark.svg"), logo({ variant: "dark" }));
await fs.writeFile(path.join(brandDir, "logo-light.svg"), logo({ variant: "light" }));

const images = [
  ["premium-currencykart-hero.png", "CurrencyKart", "Premium forex, cards and travel cover assistance", "forex", 1600, 960],
  ["forex-travel-card.png", "Forex Card", "Reload and travel card request workflow", "card", 1600, 960],
  ["travel-insurance.png", "Travel Insurance", "Partner-led trip protection assistance", "insurance", 1600, 960],
  ["student-forex.png", "Student Forex", "Study Abroad Money Support", "student", 1600, 960],
  ["corporate-forex.png", "Corporate Forex", "Managed employee travel requests", "corporate", 1600, 960],
  ["secure-kyc-documents.png", "Secure KYC", "Document review and status tracking", "kyc", 1600, 960],
  ["delhi-ncr-doorstep.png", "Delhi NCR Doorstep", "Eligible pickup and delivery coordination", "doorstep", 1600, 960],
  ["og-image.png", "CurrencyKart", "Travel Money, Delivered Smartly", "forex", 1200, 630],
  ["twitter-image.png", "CurrencyKart", "Forex, cards, buyback and insurance assistance", "forex", 1200, 630]
];

for (const [file, title, subtitle, theme, width, height] of images) {
  await sharp(Buffer.from(scene(title, subtitle, theme))).resize(width, height).png({ quality: 92 }).toFile(path.join(imageDir, file));
}
await sharp(Buffer.from(mark())).resize(180, 180).png().toFile(path.join(brandDir, "apple-touch-icon.png"));
await sharp(Buffer.from(mark())).resize(192, 192).png().toFile(path.join(brandDir, "icon-192.png"));
await sharp(Buffer.from(mark())).resize(512, 512).png().toFile(path.join(brandDir, "icon-512.png"));

console.log("Generated CurrencyKart brand assets.");
