export const constant = {
  baseUrl: import.meta.env.VITE_API_URL || "/",
};

const REMOTE_IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%2312372a'/%3E%3Cstop offset='1' stop-color='%23d4af37'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3Ctext x='600' y='405' fill='white' font-family='Arial, sans-serif' font-size='54' font-weight='700' text-anchor='middle'%3EPremium Estate%3C/text%3E%3C/svg%3E";

const STOCK_IMAGE_SETS = {
  house: [
    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ],
  apartment: [
    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ],
  land: [
    "https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/461960/pexels-photo-461960.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ],
  commercial: [
    "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ],
  floorPlan: ["https://placehold.co/1200x800/f7f4ec/2d3748?text=Premium+Estate+Floor+Plan"],
  other: [
    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ],
};

const UNSPLASH_FALLBACKS = {
  "photo-1500382017468-9049fed747ef": "land",
  "photo-1472396961693-142e6e269027": "land",
  "photo-1500530855697-b586d89ba3ee": "land",
  "photo-1441974231531-c6227db76b6e": "land",
  "photo-1545324418-cc1a3fa10c00": "apartment",
  "photo-1502672260266-1c1ef2d93688": "apartment",
  "photo-1560185127-6ed189bf02f4": "apartment",
  "photo-1560448204-e02f11c3d0e2": "apartment",
  "photo-1512917774080-9991f1c4c750": "house",
  "photo-1494526585095-c41746248156": "house",
  "photo-1613490493576-7fde63acd811": "house",
  "photo-1613545325278-f24b0cae1224": "house",
  "photo-1613977257363-707ba9348227": "house",
  "photo-1600596542815-ffad4c1539a9": "house",
  "photo-1600607687939-ce8a6c25118c": "house",
  "photo-1600566753190-17f0baa2a6c3": "house",
  "photo-1497366754035-f200968a6e72": "commercial",
  "photo-1497366216548-37526070297c": "commercial",
  "photo-1497366412874-3415097a27e7": "commercial",
  "photo-1441986300917-64674bd600d8": "commercial",
  "photo-1524758631624-e2822e304c36": "commercial",
  "photo-1441984904996-e0b6ba687e04": "commercial",
  "photo-1580587771525-78b9dba3b914": "floorPlan",
};

const normalizePropertyTypeKey = (value = "") => {
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

export const getStockImageForProperty = (propertyType, seed = "") => {
  const key = normalizePropertyTypeKey(propertyType);
  const set = STOCK_IMAGE_SETS[key] || STOCK_IMAGE_SETS.other;
  return (
    set[deterministicIndex(String(seed || propertyType || key), set.length)] ||
    REMOTE_IMAGE_PLACEHOLDER
  );
};

const getUnsplashFallback = (url, propertyType) => {
  const matchedKey = Object.keys(UNSPLASH_FALLBACKS).find((photoId) => url.includes(photoId));
  const fallbackType = propertyType || (matchedKey ? UNSPLASH_FALLBACKS[matchedKey] : "");
  return getStockImageForProperty(fallbackType, url);
};

export function normalizeUrl(url, propertyType = "") {
  if (!url || typeof url !== "string") return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      return parsed.pathname + parsed.search + parsed.hash;
    }
    if (parsed.hostname === "images.unsplash.com") {
      return getUnsplashFallback(url, propertyType);
    }
  } catch {
    // Keep the original URL when parsing fails.
  }
  return url;
}
