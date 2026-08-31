import {
  Button,
  Heading,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import EmailLayout from "./email-layout";

type Props = {
  productName: string;
  productImage?: string;
  productSlug: string;
  price: string; // formatted current price
  originalPrice?: string; // formatted original price if discounted
  discountLabel?: string; // e.g. "20% OFF"
  description?: string;
  unsubscribeUrl: string;
};

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://loisbanksbeauty.com";

export default function NewProductEmail({
  productName,
  productImage,
  productSlug,
  price,
  originalPrice,
  discountLabel,
  description,
  unsubscribeUrl,
}: Props) {
  return (
    <EmailLayout preview={`New drop: ${productName}`}>
      <Text className="m-0 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#FD3F92]">
        Just Dropped
      </Text>

      <Heading className="mt-3 mb-0 text-center text-[24px] font-medium leading-tight text-black">
        A new product is here
      </Heading>

      <Text className="mt-3 mb-0 text-center text-[15px] leading-relaxed text-black/55">
        Hi there — something new just landed at LoisBanks Beauty.
      </Text>

      {/* Product image */}
      {productImage ? (
        <Section className="mt-8 overflow-hidden rounded-2xl bg-[#f5f5f5]">
          <Img
            src={productImage}
            alt={productName}
            width="100%"
            className="block w-full object-cover"
            style={{ maxHeight: "360px" }}
          />
        </Section>
      ) : null}

      {/* Product details */}
      <Section className="mt-8 text-center">
        <Text className="m-0 text-[18px] font-medium leading-snug text-black">
          {productName}
        </Text>

        {discountLabel ? (
          <Text className="mt-3 mb-0 text-[12px] font-medium uppercase tracking-[0.12em] text-[#FD3F92]">
            {discountLabel}
          </Text>
        ) : null}

        <Text className="mt-2 mb-0 text-[26px] font-medium leading-none text-black">
          {price}
        </Text>

        {originalPrice ? (
          <Text className="mt-1 mb-0 text-[14px] text-black/40 line-through">
            {originalPrice}
          </Text>
        ) : null}

        {description ? (
          <Text className="mt-4 mb-0 text-[14px] leading-relaxed text-black/60">
            {description}
          </Text>
        ) : (
          <Text className="mt-4 mb-0 text-[14px] leading-relaxed text-black/60">
            Soft textures, refined finish — made to stand out. Shop it while it’s
            available.
          </Text>
        )}
      </Section>

      {/* CTA */}
      <Section className="mt-8 text-center">
        <Button
          href={`${APP_URL}/shop/p/${productSlug}`}
          className="rounded-full bg-[#FD3F92] px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-white no-underline"
        >
          Shop Now
        </Button>
      </Section>

      <Text className="mt-6 mb-0 text-center text-[13px] text-black/40">
        Or{" "}
        <Link
          href={`${APP_URL}/shop`}
          className="font-medium text-black underline"
        >
          browse the full collection
        </Link>
      </Text>

      {/* Unsubscribe */}
      <Text className="mt-10 mb-0 text-center text-[11px] leading-relaxed text-black/35">
        You’re receiving this because you subscribed to LoisBanks Beauty updates.
        <br />
        <Link
          href={unsubscribeUrl}
          className="text-black/40 underline"
        >
          Unsubscribe
        </Link>
      </Text>
    </EmailLayout>
  );
}