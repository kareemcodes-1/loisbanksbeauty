import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Collections | Admin",
    description:
        "Manage your collections and organize your products.",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}