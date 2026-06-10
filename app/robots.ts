import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/dashboard", "/api", "/login", "/register", "/forgot-password"] }
    ],
    sitemap: new URL("/sitemap.xml", brand.siteUrl).toString()
  };
}
