import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Orders | Admin",
    description:
        "Manage customer orders and order information.",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}