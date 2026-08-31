import {
  Button,
  Heading,
  Section,
  Text,
  Img,
  Row,
  Column,
  Hr,
} from "@react-email/components";
import EmailLayout from "./email-layout";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string | null;
};

type Props = {
  name: string;
  orderReference: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax?: number;
  totalAmount: number;
  paymentMethod: string;
  shippingMethod: "pickup" | "delivery";
  currency?: string;
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://loisbanksbeauty.com";

const formatMoney = (amount: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);

export default function OrderConfirmedEmail({
  name,
  orderReference,
  items,
  subtotal,
  shippingFee,
  tax = 0,
  totalAmount,
  paymentMethod,
  shippingMethod,
  currency = "NGN",
}: Props) {
  return (
    <EmailLayout preview={`Your order #${orderReference} has been confirmed`}>
      <Text className="m-0 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#FD3F92]">
        Order Confirmed
      </Text>

      <Heading className="mt-3 mb-0 text-center text-[24px] font-medium leading-tight text-black">
        Thank you for your order
      </Heading>

      <Text className="mt-4 mb-0 text-center text-[15px] leading-relaxed text-black/60">
        Hi {name}, thank you for shopping at LoisBanks Beauty.
        <br />
        Your order <strong>#{orderReference}</strong> has been confirmed and we
        have received your payment successfully.
      </Text>

      {/* Different message for Pickup vs Delivery */}
      <Text className="mt-5 mb-0 text-center text-[15px] leading-relaxed text-black/60">
        {shippingMethod === "pickup" ? (
          <>
            Your package will be available for pickup at our store. We will
            notify you once it is ready for collection.
          </>
        ) : (
          <>
            Your package will be prepared and shipped to you. We will notify you
            once it has been shipped.
          </>
        )}
      </Text>

      {/* Order Reference */}
      <Section className="mt-8 rounded-2xl bg-[#fafafa] px-5 py-4 text-center">
        <Text className="m-0 text-[11px] font-medium uppercase tracking-[0.14em] text-black/40">
          Order Reference
        </Text>
        <Text className="mt-1 mb-0 font-mono text-[15px] font-medium tracking-wide text-black">
          {orderReference}
        </Text>
      </Section>

      {/* Items */}
      <Section className="mt-10">
        <Text className="m-0 mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-black/50">
          Order Summary
        </Text>

        {items.map((item, index) => (
          <Row key={index} className="mb-4">
            {item.image && (
              <Column className="w-[64px] pr-3 align-top">
                <Img
                  src={item.image}
                  width="64"
                  height="64"
                  alt={item.name}
                  className="rounded-lg object-cover"
                />
              </Column>
            )}
            <Column className="align-top">
              <Text className="m-0 text-[14px] font-medium text-black">
                {item.name}
              </Text>
              <Text className="m-0 mt-1 text-[13px] text-black/50">
                Qty: {item.quantity}
                {item.size ? ` · Size: ${item.size}` : ""}
              </Text>
            </Column>
            <Column className="w-[90px] align-top text-right">
              <Text className="m-0 text-[14px] font-medium text-black">
                {formatMoney(item.price * item.quantity, currency)}
              </Text>
            </Column>
          </Row>
        ))}
      </Section>

      <Hr className="my-6 border-black/10" />

      {/* Totals */}
      <Section>
        <Row>
          <Column>
            <Text className="m-0 text-[14px] text-black/60">Subtotal</Text>
          </Column>
          <Column className="text-right">
            <Text className="m-0 text-[14px] text-black">
              {formatMoney(subtotal, currency)}
            </Text>
          </Column>
        </Row>

        {shippingMethod === "delivery" && (
          <Row className="mt-2">
            <Column>
              <Text className="m-0 text-[14px] text-black/60">Delivery Fee</Text>
            </Column>
            <Column className="text-right">
              <Text className="m-0 text-[14px] text-black">
                {shippingFee > 0
                  ? formatMoney(shippingFee, currency)
                  : "Free"}
              </Text>
            </Column>
          </Row>
        )}

        {tax > 0 && (
          <Row className="mt-2">
            <Column>
              <Text className="m-0 text-[14px] text-black/60">Tax</Text>
            </Column>
            <Column className="text-right">
              <Text className="m-0 text-[14px] text-black">
                {formatMoney(tax, currency)}
              </Text>
            </Column>
          </Row>
        )}

        <Row className="mt-4">
          <Column>
            <Text className="m-0 text-[15px] font-medium text-black">Total</Text>
          </Column>
          <Column className="text-right">
            <Text className="m-0 text-[15px] font-medium text-black">
              {formatMoney(totalAmount, currency)}
            </Text>
          </Column>
        </Row>
      </Section>

      <Hr className="my-6 border-black/10" />

      {/* Payment Method */}
      <Section>
        <Text className="m-0 text-[13px] font-medium uppercase tracking-[0.08em] text-black/50">
          Payment Method
        </Text>
        <Text className="mt-1 mb-0 text-[14px] text-black">
          {paymentMethod}
        </Text>
      </Section>

      <Section className="mt-10 text-center">
        <Button
          href={`${APP_URL}/orders`}
          className="rounded-full bg-[#FD3F92] px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-white no-underline"
        >
          View Order
        </Button>
      </Section>
    </EmailLayout>
  );
}