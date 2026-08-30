import type { Metadata } from "next";
import "./globals.css";

import { Geist } from "next/font/google";
import OrganizationSchema from "./components/seo/organization-schema";
import WebsiteSchema from "./components/seo/website-schema";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const siteName = "LoisBanks Beauty";
const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://loisbanksbeauty.com";

const title = "LoisBanks Beauty | Luxury Human Hair Wigs, Athleisure & Beauty Essentials";
const description =
  "Shop luxury human hair wigs, athleisure wear and beauty essentials. Premium quality, flawless textures, effortless glam — worldwide delivery.";

// Put og.jpg in /public, OR use a full CDN URL
const ogImage =
  "https://res.cloudinary.com/datpkisht/image/upload/v1787147828/i1avstooywwwrsd0l99t.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: title,
    template: `%s | ${siteName}`,
  },

  description,

  applicationName: siteName,

  keywords: [
    "LoisBanks Beauty",
    "luxury hair wigs Nigeria",
    "human hair wigs Lagos",
    "premium wigs Lekki",
    "athleisure wear Nigeria",
    "beauty essentials Lagos",
    "hair bundles Nigeria",
    "quality wigs Lagos",
  ],

  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName,
    title,
    description,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "LoisBanks Beauty — Luxury Hair Wigs, Athleisure & Beauty Essentials",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-white text-black antialiased">
        <WebsiteSchema />
        <OrganizationSchema />
        {children}
      </body>
    </html>
  );
}