import type { Metadata } from "next";
import "./globals.css";
import { brand } from "@/config/brand";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: { default: `${brand.name} | Premium Online Forex Assistance`, template: `%s | ${brand.name}` },
  description: brand.tagline,
  applicationName: brand.name,
  robots: { index: true, follow: true },
  openGraph: {
    siteName: brand.name,
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: `${brand.name} travel money assistance` }]
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/twitter-image.png"]
  },
  icons: {
    icon: [{ url: "/brand/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteFooter />
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
