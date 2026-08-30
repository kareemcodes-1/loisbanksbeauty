import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the story behind LoisBanks Beauty. We create luxury human hair wigs, athleisure and beauty essentials for women who never compromise on quality, texture or elegance.",
};

const AboutLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default AboutLayout;