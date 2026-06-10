import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "", "/buy-forex", "/sell-forex", "/forex-card", "/travel-insurance",
    "/student-forex", "/corporate-forex", "/about", "/contact", "/faq",
    "/terms", "/privacy", "/refund-cancellation", "/kyc-document-policy", "/compliance"
  ];
  return routes.map((route) => ({
    url: new URL(route || "/", brand.siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.includes("forex") ? 0.8 : 0.6
  }));
}
