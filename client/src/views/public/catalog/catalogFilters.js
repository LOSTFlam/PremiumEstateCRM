import {
  getDocumentCount,
  getFloorPlanCount,
  getPhotoCount,
  isRichListing,
  normalizePropertyTypeKey,
  parsePrice,
} from "./catalogData";

export const DEFAULT_PUBLIC_FILTERS = {
  search: "",
  status: "all",
  type: "all",
  dealType: "all",
  sortBy: "latest",
  page: 1,
  minPrice: "",
  maxPrice: "",
  bedrooms: "all",
  bathrooms: "all",
  onlyWithPhotos: false,
  onlyRich: false,
  verificationStatus: "all",
  featuredCollection: "",
};

export const extractPresetFilters = (preset = {}) => ({
  status: preset.status || "all",
  type: preset.type || "all",
  dealType: preset.dealType || "all",
  sortBy: preset.sortBy || "latest",
  minPrice: String(preset.minPrice ?? ""),
  maxPrice: String(preset.maxPrice ?? ""),
  bedrooms: String(preset.bedrooms || "all"),
  bathrooms: String(preset.bathrooms || "all"),
  onlyWithPhotos: Boolean(preset.onlyWithPhotos),
  onlyRich: Boolean(preset.onlyRich),
  verificationStatus: String(preset.verificationStatus || "all"),
  featuredCollection: String(preset.featuredCollection || ""),
});

const getSearchableText = (property = {}) =>
  String(
    property?.searchableText ||
      [
        property?.name,
        property?.propertyAddress,
        property?.propertyType,
        property?.marketingDescription,
        property?.propertyDescription,
      ]
        .filter(Boolean)
        .join(" ")
  ).toLowerCase();

export const getPublicCatalogRichScore = (property) =>
  (isRichListing(property) ? 1000 : 0) +
  getPhotoCount(property) * 10 +
  getDocumentCount(property) * 5 +
  getFloorPlanCount(property) * 8 +
  String(property?.marketingDescription || property?.propertyDescription || "").length;

export const matchesPublicCatalogFilters = (property, filters = {}) => {
  const normalizedFilters = {
    ...DEFAULT_PUBLIC_FILTERS,
    ...filters,
  };
  const search = String(normalizedFilters.search || "")
    .trim()
    .toLowerCase();
  const minPrice = parsePrice(normalizedFilters.minPrice);
  const maxPrice = parsePrice(normalizedFilters.maxPrice);
  const propertyTypeKey =
    property?.propertyTypeKey || normalizePropertyTypeKey(property?.propertyType);
  const price = parsePrice(property?.listingPrice);
  const bedrooms = Number(property?.numberofBedrooms || 0);
  const bathrooms = Number(property?.numberofBathrooms || 0);
  const status = String(property?.listingStatus || "").toLowerCase();
  const verificationStatus = String(
    property?.verification?.status || property?.verificationStatus || ""
  ).toLowerCase();
  const featuredCollections = Array.isArray(property?.featuredCollections)
    ? property.featuredCollections
    : [];

  const dealType = property?.dealType === "rent" ? "rent" : "sale";

  return (
    (!search || getSearchableText(property).includes(search)) &&
    (normalizedFilters.status === "all" ||
      status.includes(String(normalizedFilters.status).toLowerCase())) &&
    (normalizedFilters.type === "all" || propertyTypeKey === normalizedFilters.type) &&
    (normalizedFilters.dealType === "all" || dealType === normalizedFilters.dealType) &&
    (!minPrice || price >= minPrice) &&
    (!maxPrice || price <= maxPrice) &&
    (normalizedFilters.bedrooms === "all" || bedrooms >= Number(normalizedFilters.bedrooms)) &&
    (normalizedFilters.bathrooms === "all" || bathrooms >= Number(normalizedFilters.bathrooms)) &&
    (!normalizedFilters.onlyWithPhotos || getPhotoCount(property) > 0) &&
    (!normalizedFilters.onlyRich || isRichListing(property)) &&
    (normalizedFilters.verificationStatus === "all" ||
      verificationStatus === String(normalizedFilters.verificationStatus).toLowerCase()) &&
    (!normalizedFilters.featuredCollection ||
      featuredCollections.includes(normalizedFilters.featuredCollection))
  );
};

export const filterCatalogProperties = (properties = [], filters = {}) =>
  (Array.isArray(properties) ? properties : []).filter((property) =>
    matchesPublicCatalogFilters(property, filters)
  );

export const sortCatalogProperties = (properties = [], sortBy = "latest") => {
  const items = Array.isArray(properties) ? [...properties] : [];

  return items.sort((left, right) => {
    if (sortBy === "priceHigh") {
      return parsePrice(right?.listingPrice) - parsePrice(left?.listingPrice);
    }

    if (sortBy === "priceLow") {
      return parsePrice(left?.listingPrice) - parsePrice(right?.listingPrice);
    }

    if (sortBy === "bestFilled") {
      return getPublicCatalogRichScore(right) - getPublicCatalogRichScore(left);
    }

    return (
      new Date(right?.updatedDate || right?.createdDate || right?.listingDate || 0) -
      new Date(left?.updatedDate || left?.createdDate || left?.listingDate || 0)
    );
  });
};

export const filterAndSortCatalogProperties = (properties = [], filters = {}) =>
  sortCatalogProperties(
    filterCatalogProperties(properties, filters),
    filters?.sortBy || DEFAULT_PUBLIC_FILTERS.sortBy
  );

export const countCatalogProperties = (properties = [], filters = {}) =>
  filterCatalogProperties(properties, filters).length;
