import { getApi } from "services/api";
import { extractCollection, extractEntity } from "utils/normalizeResponse";
import { getCatalogDataset, normalizePropertyTypeKey, samplePublicProperties } from "./catalogData";

const MIN_TYPE_COUNTS = {
  house: 3,
  apartment: 3,
  land: 3,
  commercial: 3,
};

const ensureCatalogCoverage = (properties = []) => {
  const liveProperties = Array.isArray(properties) ? properties.filter(Boolean) : [];
  if (!liveProperties.length) {
    return samplePublicProperties;
  }

  const counts = liveProperties.reduce((acc, property) => {
    const key = normalizePropertyTypeKey(property?.propertyType);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const seenIds = new Set(liveProperties.map((property) => property?._id).filter(Boolean));
  const additions = samplePublicProperties.filter((property) => {
    const key = normalizePropertyTypeKey(property?.propertyType);
    if (!MIN_TYPE_COUNTS[key]) return false;
    if ((counts[key] || 0) >= MIN_TYPE_COUNTS[key]) return false;
    if (seenIds.has(property?._id)) return false;

    counts[key] = (counts[key] || 0) + 1;
    seenIds.add(property?._id);
    return true;
  });

  return [...liveProperties, ...additions];
};

export const fetchPublicCatalog = async (options = {}) => {
  try {
    const response = await getApi("api/property/public", {
      useCache: true,
      cacheKey: "public:catalog",
      silent: true,
      ...options,
    });
    const collection = extractCollection(response);
    return getCatalogDataset(ensureCatalogCoverage(collection));
  } catch (error) {
    // Error handled silently
    return getCatalogDataset(samplePublicProperties);
  }
};

export const fetchPublicPropertyById = async (id) => {
  const response = await getApi(`api/property/public/${id}`, {
    useCache: true,
    cacheKey: `public:property:${id}`,
    silent: true,
  });

  return extractEntity(response, "property");
};

export const fetchPublicPropertyBySlug = async (slug) => {
  const response = await getApi(`api/property/public/slug/${slug}`, {
    useCache: true,
    cacheKey: `public:property:slug:${slug}`,
    silent: true,
  });

  return extractEntity(response, "property");
};
