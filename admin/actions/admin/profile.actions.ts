export interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt?: string | Date;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone?: string;
}

export async function getAdminProfile(): Promise<AdminProfile> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/profile`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
}

export async function updateAdminProfile(data: UpdateProfilePayload) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to update profile");
  }

  return response.json();
}

export async function deleteAdminAccount() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/profile`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to delete account");
  }

  return response.json();
}