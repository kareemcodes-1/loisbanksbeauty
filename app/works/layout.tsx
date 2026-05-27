import type { Metadata } from "next";

export const metadata = {
  title: "Works — SitesByKareem",
  description:
    "Explore my portfolio of high-converting websites and see how I can help your business grow. From concept to launch, I deliver results that exceed expectations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    {children}
    </>
  );
}