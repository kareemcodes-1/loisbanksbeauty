import type { Metadata } from "next";
import "./globals.css";

import { Geist } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import NextTopLoader from "nextjs-toploader";
import ToastProvider from "@/providers/toast-provider";
import AuthProvider from "@/providers/session-provider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LoisBanks Beauty — Admin",
    template: "%s | LoisBanks Beauty Admin",
  },
  description: "LoisBanks Beauty administration dashboard.",
  applicationName: "LoisBanks Beauty Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
      <AuthProvider>
      <ToastProvider />

      <NextTopLoader
        color="#FD3F92"
        height={2}
        showSpinner={false}
        crawlSpeed={200}
        speed={400}
        shadow="0 0 10px #FD3F92, 0 0 5px #FD3F92"
      />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}