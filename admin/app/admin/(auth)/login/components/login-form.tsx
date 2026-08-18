"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn("credentials", {
  redirect: false,
  email: email.trim().toLowerCase(),
  password,
});

console.log("LOGIN RESULT:", result);

if (!result?.ok) {
  toast.error(result?.error || "Login failed.");
  return;
}

      toast.success("Login successful.");

      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Admin login error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>

          <CardDescription>
            Enter your admin credentials to access the
            dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">
                  Email
                </FieldLabel>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">
                  Password
                </FieldLabel>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={loading}
                    className="pr-10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </Field>

              {/* Submit */}
              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  size={"lg"}
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}