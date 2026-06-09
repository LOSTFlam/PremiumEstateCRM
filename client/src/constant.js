export const constant = {
  baseUrl: import.meta.env.VITE_API_URL || "/",
};

const REMOTE_IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%2312372a'/%3E%3Cstop offset='1' stop-color='%23d4af37'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3Ctext x='600' y='405' fill='white' font-family='Arial, sans-serif' font-size='54' font-weight='700' text-anchor='middle'%3EPremium Estate%3C/text%3E%3C/svg%3E";

export function normalizeUrl(url) {
  if (!url || typeof url !== "string") return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      return parsed.pathname + parsed.search + parsed.hash;
    }
    if (parsed.hostname === "images.unsplash.com") {
      return REMOTE_IMAGE_PLACEHOLDER;
    }
  } catch {
    // Keep the original URL when parsing fails.
  }
  return url;
}
