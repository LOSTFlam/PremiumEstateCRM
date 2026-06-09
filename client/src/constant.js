export const constant = {
  baseUrl: import.meta.env.VITE_API_URL || "/",
};

export function normalizeUrl(url) {
  if (!url || typeof url !== "string") return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      return parsed.pathname + parsed.search + parsed.hash;
    }
  } catch {}
  return url;
}
