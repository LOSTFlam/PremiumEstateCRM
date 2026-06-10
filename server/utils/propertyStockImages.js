// Локальные стоковые фотографии недвижимости.
// Пути указывают на файлы из client/public/images/stock — они отдаются
// с того же домена, что и сайт, поэтому работают без VPN и внешних хостов.
const STOCK_FILES = {
  house: [
    "/images/stock/house-1.jpg",
    "/images/stock/house-2.jpg",
    "/images/stock/house-3.jpg",
  ],
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

const getStockImageForProperty = (propertyType, seed = "") => {
  const key = normalizePropertyTypeKey(propertyType);
  const files = STOCK_FILES[key] || STOCK_FILES.other;
  return files[deterministicIndex(String(seed || propertyType || key), files.length)];
};

const buildPhotoSet = (propertyType, seed = "", count = 3) => {
  const key = normalizePropertyTypeKey(propertyType);
  const files = STOCK_FILES[key] || STOCK_FILES.other;
  const startIndex = deterministicIndex(String(seed || propertyType || key), files.length);

  return Array.from({ length: count }, (_, index) => ({
    img: files[(startIndex + index) % files.length],
  }));
};

module.exports = {
  buildPhotoSet,
  getStockImageForProperty,
  normalizePropertyTypeKey,
};
