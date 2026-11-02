const AUTH_PAGES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

export function getSafeCallbackUrl(url?: string | null): string {
  if (!url) return "/";

  // Must be a relative path on this site
  if (!url.startsWith("/") || url.startsWith("//") || url.startsWith("/\\")) {
    return "/";
  }

  // Never send someone back to an auth page
  if (AUTH_PAGES.some((p) => url === p || url.startsWith(`${p}/`) || url.startsWith(`${p}?`))) {
    return "/";
  }

  return url;
}

export function withCallback(path: string, callbackUrl?: string | null) {
  const safe = getSafeCallbackUrl(callbackUrl);
  if (safe === "/") return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}callbackUrl=${encodeURIComponent(safe)}`;
}