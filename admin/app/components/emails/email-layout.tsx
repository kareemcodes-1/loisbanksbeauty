import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "https://loisbanksbeauty.com";
const LOGO_URL =
  "https://res.cloudinary.com/datpkisht/image/upload/v1786684533/gjxznh8gewb2j46cyvgt.jpg";

const BRAND = "#fd3f92";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

/* -------------------------------------------------------------------------- */
/*  Layout                                                                    */
/* -------------------------------------------------------------------------- */

type EmailLayoutProps = {
  preview: string;
  children: ReactNode;
};

export default function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Tailwind>
        <Head />
        <Preview>{preview}</Preview>
        <Body
          className="m-0 bg-[#f5f5f5] p-0"
          style={{ fontFamily: SANS }}
        >
          <Container className="mx-auto my-6 w-full max-w-[560px] overflow-hidden rounded-xl bg-white sm:my-10">
            {/* Brand accent */}
            <Section className="h-[4px] bg-[#fd3f92]" />

            {/* Header */}
            <Section className="px-6 pb-2 pt-8 text-center sm:px-10 sm:pt-10">
              <Link href={FRONTEND_URL}>
                <Img
                  src={LOGO_URL}
                  alt="LoisBanks Beauty"
                  width={120}
                  height={40}
                  className="mx-auto h-auto max-w-[120px] object-contain"
                />
              </Link>
            </Section>

            {/* Content */}
            <Section className="px-6 pb-8 pt-6 sm:px-10 sm:pb-10">
              {children}
            </Section>

            {/* Footer */}
            <Section className="bg-[#fafafa] px-6 py-8 text-center sm:px-10">
             <Text className="m-0 text-[13px] leading-[1.6] text-black/60">
                Need help?{" "}
                <Link
                  href={`${FRONTEND_URL}/contact`}
                  className="text-[#fd3f92] underline"
                >
                  Send us a message
                </Link>{" "}
                on our contact page, we&apos;re happy to help.
              </Text>

              <Text className="m-0 mt-4 text-[12px] leading-[1.8] text-black/50">
                <Link   href={`${FRONTEND_URL}/shop`} className="text-black/50 underline">
                  Shop
                </Link>
                {"  ·  "}
                <Link
                  href={`${FRONTEND_URL}/contact`}
                  className="text-black/50 underline"
                >
                  Contact
                </Link>
                {"  ·  "}
                <Link
                  href="https://www.instagram.com/loisbanks_hair"
                  className="text-black/50 underline"
                >
                  Instagram
                </Link>
              </Text>

              <Text className="m-0 mt-2 text-[12px] leading-[1.8] text-black/50">
                <Link
                  href="mailto:lbanksluxuryhairs@gmail.com"
                  className="text-black/50 underline"
                >
                  lbanksluxuryhairs@gmail.com
                </Link>
                {"  ·  "}
                <Link
                  href="https://wa.me/2348105001284"
                  className="text-black/50 underline"
                >
                  +234 810 500 1284
                </Link>
              </Text>

              <Text className="m-0 mt-6 text-[11px] text-black/30">
                © {new Date().getFullYear()} LoisBanks Beauty
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reusable building blocks (use these inside any email template)            */
/* -------------------------------------------------------------------------- */

/** Small gold-ish eyebrow label, mirrors the site's "subtitle" style. */
export function EmailEyebrow({ children }: { children: ReactNode }) {
  return (
    <Text className="m-0 mb-2 text-center text-[12px] font-medium uppercase tracking-[0.12em] text-[#caa11b]">
      {children}
    </Text>
  );
}

/** Serif heading, mirrors the site's h1/h2 style. */
export function EmailHeading({ children }: { children: ReactNode }) {
  return (
    <Text
      className="m-0 mb-4 text-center text-[26px] font-normal leading-[1.2] tracking-[-0.02em] text-[#171717] sm:text-[30px]"
      style={{ fontFamily: SERIF }}
    >
      {children}
    </Text>
  );
}

/** Body paragraph. */
export function EmailText({
  children,
  center = false,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <Text
      className={`m-0 mb-4 text-[15px] leading-[1.7] text-black/70 ${
        center ? "text-center" : "text-left"
      }`}
    >
      {children}
    </Text>
  );
}

/** Pill button, mirrors the site's .btn-primary. */
export function EmailButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Section className="my-6 text-center">
      <Button
        href={href}
        className="box-border inline-block rounded-full px-8 py-[14px] text-center text-[12px] font-medium uppercase tracking-[0.06em] text-white no-underline"
        style={{ backgroundColor: BRAND }}
      >
        {children}
      </Button>
    </Section>
  );
}

/** Soft grey box for order summaries, details, codes, etc. */
export function EmailCard({ children }: { children: ReactNode }) {
  return (
    <Section className="my-6 rounded-lg bg-[#fafafa] p-5">{children}</Section>
  );
}

/** Thin divider. */
export function EmailDivider() {
  return <Hr className="mx-0 my-6 border-0 border-t border-solid border-black/10" />;
}