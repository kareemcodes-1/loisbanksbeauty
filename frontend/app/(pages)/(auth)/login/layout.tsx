import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Log in to your LoisBanks Beauty account to view orders",
};

const LoginLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default LoginLayout;