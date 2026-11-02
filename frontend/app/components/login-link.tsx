// components/login-link.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { withCallback } from "@/lib/auth-redirect";

type Props = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void; // e.g. close the mobile menu
};

export default function LoginLink({ className, children, onClick }: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={withCallback("/login", pathname)}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}