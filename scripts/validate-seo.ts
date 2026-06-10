import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
import { pageMetadata } from "../lib/seo";
import { brand } from "../config/brand";

const expectedPaths = [
  "/", "/buy-forex", "/sell-forex", "/forex-card", "/travel-insurance",
  "/student-forex", "/corporate-forex", "/about", "/contact", "/faq",
  "/terms", "/privacy", "/refund-cancellation", "/kyc-document-policy", "/compliance"
];
const errors: string[] = [];
const origin = new URL(brand.siteUrl);
const allowedOrigins = new Set(["https://currencykart.in", "https://staging.currencykart.in"]);

if (origin.protocol !== "https:") errors.push("Configured site URL must use HTTPS.");
if (["localhost", "127.0.0.1", "example.com", "example.invalid"].includes(origin.hostname)) errors.push("Configured site URL must be a real staging or production domain.");
if (!allowedOrigins.has(origin.origin)) errors.push("Configured site URL must be https://currencykart.in or https://staging.currencykart.in.");

const sitemapEntries = sitemap();
for (const path of expectedPaths) {
  const expected = new URL(path, origin).toString();
  if (!sitemapEntries.some((entry) => entry.url === expected)) errors.push(`Sitemap is missing ${expected}`);
}
for (const entry of sitemapEntries) {
  if (new URL(entry.url).origin !== origin.origin) errors.push(`Sitemap URL uses the wrong origin: ${entry.url}`);
}

const robotsValue = robots();
if (robotsValue.sitemap !== new URL("/sitemap.xml", origin).toString()) errors.push("robots.txt sitemap URL does not use the configured origin.");

for (const path of expectedPaths) {
  const routeFile = path === "/" ? join(process.cwd(), "app", "page.tsx") : join(process.cwd(), "app", path.slice(1), "page.tsx");
  if (!existsSync(routeFile)) {
    errors.push(`Public route file is missing: ${routeFile}`);
    continue;
  }
  const source = readFileSync(routeFile, "utf8");
  if (!source.includes("pageMetadata")) errors.push(`${path} does not use pageMetadata.`);
  const metadata = pageMetadata({ title: "Validation", description: "SEO validation description.", path });
  if (metadata.alternates?.canonical !== new URL(path, origin).toString()) errors.push(`Canonical generation failed for ${path}`);
}

if (errors.length) {
  console.error("SEO validation failed:\n" + errors.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`SEO validation passed for ${origin.origin}.`);
