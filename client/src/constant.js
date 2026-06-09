export const constant = {
  baseUrl: import.meta.env.VITE_API_URL || "/",
};

export {
  getStockImageForProperty,
  inlinePropertyImage,
  normalizeImageUrl as normalizeUrl,
  placeholderImage,
} from "utils/propertyStockImages";
