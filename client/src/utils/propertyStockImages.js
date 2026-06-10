// Локальные стоковые фотографии недвижимости.
// Файлы лежат в client/public/images/stock и отдаются с того же домена,
// что и сайт, поэтому работают без VPN и внешних хостов (Unsplash и т.п.).
const STOCK_FILES = {
  house: ["/images/stock/house-1.jpg", "/images/stock/house-2.jpg", "/images/stock/house-3.jpg"],
  apartment: [
    "/images/stock/apartment-1.jpg",
    "/images/stock/apartment-2.jpg",
    "/images/stock/apartment-3.jpg",
  ],
  land: ["/images/stock/land-1.jpg", "/images/stock/land-2.jpg"],
  commercial: ["/images/stock/commercial-1.jpg", "/images/stock/commercial-2.jpg"],
  floorPlan: ["/images/stock/floorplan-1.jpg"],
  other: [
    "/images/stock/house-1.jpg",
    "/images/stock/apartment-1.jpg",
    "/images/stock/commercial-1.jpg",
  ],
};

const BLOCKED_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "images.pexels.com",
  "placehold.co",
  "picsum.photos",
  "source.unsplash.com",
]);

export const normalizePropertyTypeKey = (value = "") => {
  const normalized = String(value).toLowerCase();

  if (
    normalized.includes("house") ||
    normalized.includes("villa") ||
    normalized.includes("townhouse") ||
    normalized.includes("дом") ||
    normalized.includes("вилла") ||
    normalized.includes("таунхаус") ||
    normalized.includes("коттедж")
  ) {
    return "house";
  }

  if (
    normalized.includes("apartment") ||
    normalized.includes("flat") ||
    normalized.includes("residence") ||
    normalized.includes("квартира") ||
    normalized.includes("апартамент") ||
    normalized.includes("студия")
  ) {
    return "apartment";
  }

  if (
    normalized.includes("land") ||
    normalized.includes("plot") ||
    normalized.includes("lot") ||
    normalized.includes("участ") ||
    normalized.includes("земл")
  ) {
    return "land";
  }

  if (
    normalized.includes("commercial") ||
    normalized.includes("office") ||
    normalized.includes("retail") ||
    normalized.includes("коммер") ||
    normalized.includes("офис") ||
    normalized.includes("помещ")
  ) {
    return "commercial";
  }

  if (normalized.includes("floor") || normalized.includes("plan") || normalized.includes("план")) {
    return "floorPlan";
  }

  return "other";
};

const deterministicIndex = (value = "", length = 1) => {
  if (length <= 1) return 0;
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash) % length;
};

// Аварийный SVG-плейсхолдер (data URI) — отображается, если даже локальный
// файл фотографии недоступен. Не требует сети вообще.
export const inlinePropertyImage = ({
  title = "Объект",
  subtitle = "Premium Estate",
  primary = "#1a202c",
  secondary = "#243b32",
  accent = "#d4af37",
} = {}) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${primary}"/>
          <stop offset="0.62" stop-color="${secondary}"/>
          <stop offset="1" stop-color="${accent}"/>
        </linearGradient>
        <radialGradient id="glow" cx="30%" cy="24%" r="70%">
          <stop offset="0" stop-color="rgba(255,255,255,0.32)"/>
          <stop offset="1" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)"/>
      <rect width="1200" height="800" fill="url(#glow)"/>
      <path d="M120 560 L280 390 L420 470 L560 320 L820 560 Z" fill="rgba(255,255,255,0.22)"/>
      <circle cx="930" cy="170" r="72" fill="rgba(255,255,255,0.2)"/>
      <text x="90" y="120" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-size="58" font-weight="700">${title}</text>
      <text x="92" y="178" fill="rgba(255,255,255,0.76)" font-family="Arial, sans-serif" font-size="30">${subtitle}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const getStockImageForProperty = (propertyType, seed = "") => {
  const key = normalizePropertyTypeKey(propertyType);
  const files = STOCK_FILES[key] || STOCK_FILES.other;
  return files[deterministicIndex(String(seed || propertyType || key), files.length)];
};

export const placeholderImage = inlinePropertyImage();

const getRuntimeOrigin = () => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "http://localhost";
};

export const isExternalImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("data:") || url.startsWith("blob:")) return false;
  if (url.startsWith("/")) return false;

  try {
    const parsed = new URL(url, getRuntimeOrigin());
    if (parsed.origin === getRuntimeOrigin()) return false;
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const normalizeImageUrl = (url, propertyType = "") => {
  if (!url || typeof url !== "string") return url;

  try {
    const parsed = new URL(url, getRuntimeOrigin());
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      return parsed.pathname + parsed.search + parsed.hash;
    }

    if (isExternalImageUrl(url) || BLOCKED_IMAGE_HOSTS.has(parsed.hostname)) {
      return getStockImageForProperty(propertyType, url);
    }
  } catch {
    return getStockImageForProperty(propertyType, url);
  }

  return url;
};
