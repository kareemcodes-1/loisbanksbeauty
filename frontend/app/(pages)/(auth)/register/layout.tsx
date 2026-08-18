import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Sign up for a LoisBanks Beauty account to track orders, save addresses, and checkout faster.",
};

const RegisterLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default RegisterLayout;