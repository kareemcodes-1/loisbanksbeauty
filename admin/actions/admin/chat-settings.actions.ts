export interface FaqItem {
  _id?: string;
  question: string;
  answer: string;
}

export interface ChatSettingsPayload {
  brandName: string;
  about: string;
  owner: string;
  yearsActive: string;
  email: string;
  phone: string;
  whatsapp: string;
  storeLocation: string;
  howToOrder: string;
  faqs: { question: string; answer: string }[];
  adminInstructions: string;
}

export interface ChatSettings extends ChatSettingsPayload {
  _id: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export async function getChatSettings(): Promise<ChatSettings> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/chat-settings`,
    { method: "GET", cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch chat settings");
  }

  return response.json();
}

export async function updateChatSettings(data: ChatSettingsPayload) {
  const response = await fetch("/api/admin/chat-settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to update chat settings");
  }

  return response.json();
}