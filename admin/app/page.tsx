// app/(admin)/page.tsx  or  app/admin/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminIndexPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  // Optional: only allow admins
  if (session.user.role !== "admin") {
    redirect("/admin/login");
  }

  redirect("/admin/dashboard");
}