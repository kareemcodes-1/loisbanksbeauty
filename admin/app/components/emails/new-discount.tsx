import {
  Button,
  Heading,
  Link,
  Section,
  Text,
} from "@react-email/components";
import EmailLayout from "./email-layout";

type Props = {
  title: string;
  description?: string;
  discountLabel: string; // e.g. "20% OFF" or "₦5,000 OFF"
  expiresAt?: string; // formatted date
  productCount?: number;
  unsubscribeUrl: string;
};

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://loisbanksbeauty.com";

export default function NewDiscountEmail({
  title,
  description,
  discountLabel,
  expiresAt,
  productCount,
  unsubscribeUrl,
}: Props) {
  return (
    <EmailLayout preview={`${discountLabel} — ${title}`}>
      <Text className="m-0 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#FD3F92]">
        Special Offer
      </Text>

      <Heading className="mt-3 mb-0 text-center text-[24px] font-medium leading-tight text-black">
        A new discount is available
      </Heading>

      <Text className="mt-4 mb-0 text-center text-[15px] leading-relaxed text-black/60">
        Hi there — we just added a new offer at LoisBanks Beauty.
      </Text>

      <Text className="mt-5 mb-0 text-center text-[18px] font-medium text-black">
        {title}
      </Text>

      {description ? (
        <Text className="mt-3 mb-0 text-center text-[14px] leading-relaxed text-black/60">
          {description}
        </Text>
      ) : null}

      {/* Discount badge */}
      <Section className="mt-8 text-center">
        <Text className="m-0 inline-block rounded-full bg-[#FD3F92] px-6 py-3 text-[18px] font-medium tracking-wide text-white">
          {discountLabel}
        </Text>
      </Section>

      {typeof productCount === "number" && productCount > 0 ? (
        <Text className="mt-4 mb-0 text-center text-[13px] text-black/50">
          Available on {productCount} product
          {productCount === 1 ? "" : "s"}
        </Text>
      ) : null}

      {expiresAt ? (
        <Text className="mt-3 mb-0 text-center text-[13px] text-black/45">
          Offer ends {expiresAt}
        </Text>
      ) : null}

      <Text className="mt-6 mb-0 text-center text-[15px] leading-relaxed text-black/60">
        Shop selected products and enjoy this deal while it lasts.
      </Text>

      <Section className="mt-8 text-center">
        <Button
          href={`${APP_URL}/shop`}
          className="rounded-full bg-[#FD3F92] px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-white no-underline"
        >
          Shop the Offer
        </Button>
      </Section>

      <Text className="mt-10 mb-0 text-center text-[11px] leading-relaxed text-black/35">
        You’re receiving this because you subscribed to LoisBanks Beauty
        updates.
        <br />
        <Link href={unsubscribeUrl} className="text-black/40 underline">
          Unsubscribe
        </Link>
      </Text>
    </EmailLayout>
  );
}