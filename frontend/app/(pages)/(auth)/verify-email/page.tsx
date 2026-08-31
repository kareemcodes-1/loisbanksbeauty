"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const verifyEmail = async () => {
    if (!email) {
      toast.error("Email is missing.");
      return;
    }

    if (code.length !== 6) {
      toast.error("Enter the 6-digit verification code.");
      return;
    }

    try {
      setIsVerifying(true);

      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Verification failed.");
        return;
      }

      toast.success("Email verified successfully.");

      router.push("/login");
    } catch (error) {
      console.error("Verify email error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendCode = async () => {
    if (!email) {
      toast.error("Email is missing.");
      return;
    }

    try {
      setIsResending(true);

      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data.message || "Failed to resend verification code."
        );
        return;
      }

      toast.success("A new verification code has been sent.");
    } catch (error) {
      console.error("Resend verification error:", error);

      toast.error("Failed to resend verification code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="subtitle">
            Email Verification
          </span>

          <h1 className="heading-3 mt-3 text-black">
            Verify Your Email
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            We sent a 6-digit verification code to{" "}
            <span className="font-medium text-black">
              {email}
            </span>
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, ""))
            }
            placeholder="000000"
            className="h-14 w-full rounded-full border-black/15 px-5 text-center font-mono text-xl tracking-[0.4em] focus:border-[#FD3F92] focus:ring-[#FD3F92]/20"
          />

          <button
            type="button"
            onClick={verifyEmail}
            disabled={isVerifying || code.length !== 6}
            className="btn-primary w-full"
          >
            {isVerifying ? (
              <Loader2 className="mx-auto size-5 animate-spin" />
            ) : (
              "VERIFY EMAIL"
            )}
          </button>

          <button
            type="button"
            onClick={resendCode}
            disabled={isResending}
            className="w-full text-sm text-muted-foreground underline transition-colors hover:text-[#FD3F92]"
          >
            {isResending
              ? "Sending..."
              : "Resend verification code"}
          </button>
        </div>
      </div>
    </main>
  );
}