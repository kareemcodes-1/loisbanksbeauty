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
const LOGO_URL = `https://res.cloudinary.com/datpkisht/image/upload/v1786684533/gjxznh8gewb2j46cyvgt.jpg`; // public logo URL

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
              <Text className="m-0 text-xs leading-relaxed text-black/40">
                LoisBanks Beauty · With love
              </Text>
              <Text className="mt-2 m-0 text-xs text-black/30">
                <Link href={APP_URL} className="text-black/40 underline">
                  Visit store
                </Link>
                {" · "}
                <Link
                  href={`${APP_URL}/contact`}
                  className="text-black/40 underline"
                >
                  Contact us
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}