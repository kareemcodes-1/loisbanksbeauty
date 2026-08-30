import type { Metadata } from "next";
import "./globals.css";

import { Geist } from "next/font/google";
import OrganizationSchema from "./components/seo/organization-schema";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const siteName = "LoisBanks Beauty";
const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://loisbanksbeauty.com";

const title = `${siteName} — Premium Hair & Beauty`;
const description =
  "Shop premium human hair wigs and beauty products at LoisBanks Beauty. Quality pieces, fast delivery across Nigeria and beyond, and verified customer reviews.";

// Put og.jpg in /public, OR use a full CDN URL
const ogImage = "https://res.cloudinary.com/datpkisht/image/upload/v1787147828/i1avstooywwwrsd0l99t.jpg";
// Example CDN:
// const ogImage = "https://res.cloudinary.com/your-cloud/image/upload/v123/loisbanks-og.jpg";

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
    "human hair wigs",
    "luxury wigs Nigeria",
    "hair bundles",
    "premium wigs Lagos",
    "beauty products",
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
        alt: `${siteName} — Premium Hair & Beauty`,
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
    apple: "/favicon.jpeg",
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
         <OrganizationSchema />
        {children}
      </body>
    </html>
  );
}