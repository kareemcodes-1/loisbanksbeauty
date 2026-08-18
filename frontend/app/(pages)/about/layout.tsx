import type { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "About us",
  description:
    "Learn about LoisBanks Beauty — our story, values, and commitment to premium hair and beauty products.",
};

const AboutLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default AboutLayout;