import { Column, Hr, Row, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import EmailLayout, {
  EmailButton,
  EmailCard,
  EmailEyebrow,
  EmailHeading,
  EmailText,
} from "./email-layout";
import { priceFormatter } from "@/lib/priceFormatter";
import type { CurrencyCode } from "@/lib/currency";

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
  size?: string | null;
};

type Props = {
  reference: string;
  customerName: string; // first name
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod?: string | null; // e.g. "Card", "Bank transfer"
  currency?: CurrencyCode;
  isGuest: boolean;
  ordersUrl: string; // members: link to their orders
  registerUrl: string; // guests: link to create an account
};

function Label({ children }: { children: ReactNode }) {
  return (
    <Text className="m-0 text-[11px] font-medium uppercase tracking-[0.12em] text-black/40">
      {children}
    </Text>
  );
}

function Value({ children }: { children: ReactNode }) {
  return (
    <Text
      className="m-0 mb-4 mt-1 text-[15px] font-medium leading-[1.5] text-black"
      style={{ wordBreak: "break-word" }}
    >
      {children}
    </Text>
  );
}

export default function OrderReceivedEmail({
  reference,
  customerName,
  customerEmail,
  items,
  totalAmount,
  paymentMethod,
  currency = "NGN",
  isGuest,
  ordersUrl,
  registerUrl,
}: Props) {
  const money = (amount: number) => priceFormatter(amount, currency);

  return (
    <EmailLayout preview={`We received your order #${reference}`}>
      <EmailEyebrow>Order received</EmailEyebrow>
      <EmailHeading>Thank you for your order</EmailHeading>
      <EmailText center>
        Hi {customerName}, we've received your order and it is currently{" "}
        <strong>pending</strong>.
      </EmailText>
      <EmailText center>
        Confirmation takes up to 24 to 48 hours. As soon as your order is
        confirmed, we'll email you right away, so please stay on standby and
        keep an eye on your inbox (and your spam folder, just in case).
      </EmailText>

      {/* Order details */}
      <EmailCard>
        <Label>Order reference</Label>
        <Value>#{reference}</Value>

        <Label>Status</Label>
        {paymentMethod ? (
          <Value>Pending confirmation</Value>
        ) : (
          <Text className="m-0 mt-1 text-[15px] font-medium text-black">
            Pending confirmation
          </Text>
        )}

        {paymentMethod ? (
          <>
            <Label>Payment method</Label>
            <Text className="m-0 mt-1 text-[15px] font-medium text-black">
              {paymentMethod}
            </Text>
          </>
        ) : null}
      </EmailCard>

      {/* Items */}
      <Section className="my-6">
        <Label>Your items</Label>

        {items.map((item, index) => (
          <Section key={`${item.name}-${index}`}>
            <Row className="mt-3">
              <Column className="align-top">
                <Text
                  className="m-0 text-[15px] font-medium leading-[1.4] text-black"
                  style={{ wordBreak: "break-word" }}
                >
                  {item.name}
                </Text>
                <Text className="m-0 mt-1 text-[13px] text-black/50">
                  Qty {item.quantity}
                  {item.size ? ` · Size ${item.size}` : ""}
                </Text>
              </Column>
              <Column
                className="whitespace-nowrap pl-3 text-right align-top"
                style={{ width: "1%" }}
              >
                <Text className="m-0 text-[15px] font-medium text-black">
                  {money(item.price * item.quantity)}
                </Text>
              </Column>
            </Row>
            <Hr className="mx-0 mb-0 mt-3 border-0 border-t border-solid border-black/10" />
          </Section>
        ))}

        {/* Total */}
        <Row className="mt-4">
          <Column className="align-middle">
            <Text className="m-0 text-[13px] font-medium uppercase tracking-[0.08em] text-black/60">
              Total
            </Text>
          </Column>
          <Column
            className="whitespace-nowrap pl-3 text-right align-middle"
            style={{ width: "1%" }}
          >
            <Text className="m-0 text-[20px] font-semibold text-black">
              {money(totalAmount)}
            </Text>
          </Column>
        </Row>
      </Section>

      {/* Call to action */}
      {isGuest ? (
        <>
          <EmailText center>
            Want to track this order? Create an account with{" "}
            <strong style={{ wordBreak: "break-word" }}>{customerEmail}</strong>{" "}
            and it will appear in your order history automatically.
          </EmailText>
          <EmailButton href={registerUrl}>Create an account</EmailButton>
        </>
      ) : (
        <EmailButton href={ordersUrl}>View my orders</EmailButton>
      )}
    </EmailLayout>
  );
}