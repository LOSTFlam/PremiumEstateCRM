import { getApi } from "services/api";
import { extractCollection, extractEntity } from "utils/normalizeResponse";
import { getCatalogDataset, samplePublicProperties } from "./catalogData";

export const fetchPublicCatalog = async (options = {}) => {
  try {
    const response = await getApi("api/property/public", {
      useCache: true,
      cacheKey: "public:catalog",
      ...options,
    });
    const collection = extractCollection(response);
    return getCatalogDataset(collection.length ? collection : samplePublicProperties);
  } catch (error) {
    console.error("Failed to fetch public catalog:", error);
    return getCatalogDataset(samplePublicProperties);
  }
};

export const fetchPublicPropertyById = async (id) => {
  const response = await getApi(`api/property/public/${id}`, {
    useCache: true,
    cacheKey: `public:property:${id}`,
  });

  return extractEntity(response, "property");
};

export const fetchPublicPropertyBySlug = async (slug) => {
  const response = await getApi(`api/property/public/slug/${slug}`, {
    useCache: true,
    cacheKey: `public:property:slug:${slug}`,
  });

  return extractEntity(response, "property");
};
