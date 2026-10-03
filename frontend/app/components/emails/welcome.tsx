import EmailLayout, {
  EmailButton,
  EmailEyebrow,
  EmailHeading,
  EmailText,
} from "./email-layout";

type Props = {
  name: string;
};

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://loisbanksbeauty.com";

export default function WelcomeEmail({ name }: Props) {
  return (
    <EmailLayout preview="Welcome to LoisBanks Beauty">
      <EmailEyebrow>Welcome</EmailEyebrow>
      <EmailHeading>Welcome to LoisBanks Beauty</EmailHeading>

      <EmailText center>
        Hi {name}, we&apos;re so happy to have you here. Discover our latest
        collections, explore your favourites and enjoy exclusive offers made for
        our customers.
      </EmailText>

      <EmailButton href={`${APP_URL}/shop`}>Start shopping</EmailButton>
    </EmailLayout>
  );
}