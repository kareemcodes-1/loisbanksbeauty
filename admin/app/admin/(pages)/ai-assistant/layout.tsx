import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant",
  description:
    "Business info and FAQs used by the store chatbot. Your developer system rules stay separate.",
};

export default function AiAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}