import { Link, Text } from "@react-email/components";
import type { ReactNode } from "react";
import EmailLayout, {
  EmailButton,
  EmailCard,
  EmailEyebrow,
  EmailHeading,
  EmailText,
} from "./email-layout";

type Props = {
  name: string;
  orderReference: string;
};

const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "https://loisbanksbeauty.com";

// Store details
const STORE_ADDRESS =
  "33a Sedona Mall, Opp Monty Suites, Adebayo Doherty Street, Lekki Phase 1, Lagos";
const STORE_HOURS = "Monday – Saturday | 9:00 AM – 6:00 PM";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=33a+Sedona+Mall+Adebayo+Doherty+Street+Lekki+Phase+1+Lagos";

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

export default function OrderReadyForPickupEmail({
  name,
  orderReference,
}: Props) {
  return (
    <EmailLayout preview={`Your order #${orderReference} is ready for pickup`}>
      <EmailEyebrow>Ready for pickup</EmailEyebrow>
      <EmailHeading>Your order is ready!</EmailHeading>

      <EmailText center>
        Hi {name}, your order <strong>#{orderReference}</strong> is ready for
        pickup at our store. Please bring a valid ID when you come to collect
        it.
      </EmailText>

      {/* Pickup details */}
      <EmailCard>
        <Label>Order reference</Label>
        <Value>{orderReference}</Value>

        <Label>Pickup location</Label>
        <Value>{STORE_ADDRESS}</Value>

        <Label>Opening hours</Label>
        <Value>{STORE_HOURS}</Value>

        <Link
          href={MAPS_URL}
          className="text-[14px] font-medium text-[#FD3F92] underline"
        >
          View on Google Maps
        </Link>
      </EmailCard>

      <EmailButton href={`${FRONTEND_URL}/orders`}>View order</EmailButton>

      <Text className="m-0 text-center text-[13px] text-black/50">
        We look forward to seeing you!
      </Text>
    </EmailLayout>
  );
}