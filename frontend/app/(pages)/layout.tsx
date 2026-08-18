import Navbar from "../components/navbar";
import CTA from "../components/cta";
import Footer from "../components/footer";
import ChatWidget from "../components/chat/chat-widget";
import Curve from "../components/curve-transition";
import ScrollToTop from "../components/scroll-to-top";
import AuthProvider from "@/providers/session-provider";
import ToastProvider from "@/providers/toast-provider";
import NextTopLoader from "nextjs-toploader";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ToastProvider />

      <ScrollToTop />

      <Curve />

      <NextTopLoader
        color="#FD3F92"
        height={2}
        showSpinner={false}
        crawlSpeed={200}
        speed={400}
        shadow="0 0 10px #FD3F92, 0 0 5px #FD3F92"
      />

      <Navbar />

      <main>{children}</main>

      <CTA />

      <Footer />

      <ChatWidget />
    </AuthProvider>
  );
}