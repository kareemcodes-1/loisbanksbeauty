import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

type EmailLayoutProps = {
  preview: string;
  children: React.ReactNode;
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://loisbanksbeauty.com";
const LOGO_URL =
  "https://res.cloudinary.com/datpkisht/image/upload/v1786684533/gjxznh8gewb2j46cyvgt.jpg";

export default function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-[#fafafa] font-sans">
          <Container className="mx-auto my-10 max-w-[560px] overflow-hidden rounded-2xl bg-white">
            {/* Header */}
            <Section className="border-b border-black/5 px-10 py-8 text-center">
              <Link href={APP_URL}>
                <Img
                  src={LOGO_URL}
                  alt="LoisBanks Beauty"
                  width={140}
                  height={46}
                  className="mx-auto object-contain"
                />
              </Link>
            </Section>

            {/* Content */}
            <Section className="px-10 py-10">{children}</Section>

            {/* Footer */}
            <Section className="border-t border-black/5 bg-[#fafafa] px-10 py-8 text-center">
              <Text className="m-0 text-[13px] leading-relaxed text-black/60">
                Thanks for choosing LoisBanks Beauty.
              </Text>

              <Text className="mt-3 m-0 text-[12px] leading-relaxed text-black/45">
                If you have any questions or need help with your order, feel free
                to reach out to us.
              </Text>

              <Text className="mt-4 m-0 text-[12px] leading-relaxed text-black/45">
                <Link href={APP_URL} className="text-black/50 underline">
                  Visit our store
                </Link>
                {" · "}
                <Link
                  href={`${APP_URL}/contact`}
                  className="text-black/50 underline"
                >
                  Contact us
                </Link>
              </Text>

              <Text className="mt-3 m-0 text-[12px] leading-relaxed text-black/45">
                Email:{" "}
                <Link
                  href="mailto:lbanksluxuryhairs@gmail.com"
                  className="text-black/50 underline"
                >
                  lbanksluxuryhairs@gmail.com
                </Link>
              </Text>

              <Text className="mt-1 m-0 text-[12px] leading-relaxed text-black/45">
                WhatsApp:{" "}
                <Link
                  href="https://wa.me/2348105001284"
                  className="text-black/50 underline"
                >
                  +234 810 500 1284
                </Link>
              </Text>

              <Text className="mt-4 m-0 text-[12px] leading-relaxed text-black/45">
                Follow us on{" "}
                <Link
                  href="https://www.instagram.com/loisbanks_hair"
                  className="text-black/50 underline"
                >
                  Instagram
                </Link>
              </Text>

              <Text className="mt-6 m-0 text-[11px] text-black/30">
                LoisBanks Beauty · With love
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}