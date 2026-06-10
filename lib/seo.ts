import type { Metadata } from "next";
import { brand } from "@/config/brand";

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = new URL(input.path, brand.siteUrl).toString();
  const socialTitle = `${input.title} | ${brand.name}`;
  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description: input.description,
      url,
      siteName: brand.name,
      locale: "en_IN",
      type: "website",
      images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: `${brand.name} travel money services` }]
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: input.description,
      images: ["/images/twitter-image.png"]
    }
  };
}
