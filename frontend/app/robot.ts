import type { MetadataRoute } from "next";

const BASE = "https://loisbanksbeauty.com";

const PRIVATE = [
  "/api/",
  "/admin/",
  "/checkout",
  "/orders",
  "/profile",
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      // A bot with its own group ignores the "*" group, so repeat the private paths
      {
        userAgent: ["OAI-SearchBot", "ChatGPT-User", "GPTBot"],
        allow: "/",
        disallow: PRIVATE,
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}