import type { Metadata } from "next";
import "./globals.css";

import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const siteName = "LoisBanks Beauty";
const siteUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://loisbanksbeauty.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: `${siteName} — Premium Hair & Beauty`,
    template: `%s | ${siteName}`,
  },

  description:
    "Shop premium hair and beauty products at LoisBanks Beauty. Quality bundles, fast delivery, and verified customer reviews.",

  applicationName: siteName,

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName,
    title: `${siteName} — Premium Hair & Beauty`,
    description:
      "Shop premium hair and beauty products at LoisBanks Beauty. Quality bundles, fast delivery, and verified customer reviews.",
  },

  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Premium Hair & Beauty`,
    description:
      "Shop premium hair and beauty products at LoisBanks Beauty. Quality bundles, fast delivery, and verified customer reviews.",
  },

  robots: {
    index: true,
    follow: true,
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
        {children}
      </body>
    </html>
  );
}