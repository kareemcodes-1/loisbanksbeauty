import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hero Banner | Admin",
    description:
        "Manage your hero banner content and appearance.",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}