import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getCompareIds,
  getFavoriteIds,
  getRecentlyViewedIds,
  getSavedSearches,
  removeSavedSearch,
  saveSearchSnapshot,
  toggleCompareId,
  toggleFavoriteId,
} from "./catalogStorage";
import {
  formatCompactNumber,
  getDocumentCount,
  getFloorPlanCount,
  getPhotoCount,
  isRichListing,
  normalizePropertyTypeKey,
  parsePrice,
} from "./catalogData";
import { fetchPublicCatalog } from "./catalogService";
import { getSeoCollectionConfig } from "./seoCollections";

export const DEFAULT_PUBLIC_FILTERS = {
  search: "",
  status: "all",
  type: "all",
  sortBy: "latest",
  page: 1,
  minPrice: "",
  maxPrice: "",
  bedrooms: "all",
  bathrooms: "all",
  onlyWithPhotos: false,
  onlyRich: false,
};

const booleanFromParam = (value) => value === "1" || value === "true";
const numberParam = (value, fallback = 1) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const buildFiltersFromParams = (searchParams, forcedType = null) => ({
  ...DEFAULT_PUBLIC_FILTERS,
  search: searchParams.get("search") || "",
  status: searchParams.get("status") || "all",
  type: forcedType || searchParams.get("type") || "all",
  sortBy: searchParams.get("sort") || "latest",
  page: numberParam(searchParams.get("page"), 1),
  minPrice: searchParams.get("minPrice") || "",
  maxPrice: searchParams.get("maxPrice") || "",
  bedrooms: searchParams.get("bedrooms") || "all",
  bathrooms: searchParams.get("bathrooms") || "all",
  onlyWithPhotos: booleanFromParam(searchParams.get("withPhotos")),
  onlyRich: booleanFromParam(searchParams.get("rich")),
});

const applyFiltersToParams = (filters) => {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.status !== "all") params.set("status", filters.status);
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.sortBy !== "latest") params.set("sort", filters.sortBy);
  if (Number(filters.page) > 1) params.set("page", String(filters.page));
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.bedrooms !== "all") params.set("bedrooms", String(filters.bedrooms));
  if (filters.bathrooms !== "all") params.set("bathrooms", String(filters.bathrooms));
  if (filters.onlyWithPhotos) params.set("withPhotos", "1");
  if (filters.onlyRich) params.set("rich", "1");

  return params;
};

const buildSavedSearchLabel = (filters, language = "en") => {
  const parts = [];
  if (filters.search) parts.push(filters.search);
  if (filters.type !== "all") parts.push(filters.type);
  if (filters.status !== "all") parts.push(filters.status);
  if (parts.length === 0) {
    parts.push(language?.startsWith("ru") ? "Кураторская подборка" : "Signature shortlist");
  }
  return parts.join(" · ");
};

const getRichScore = (property) =>
  (isRichListing(property) ? 1000 : 0) +
  getPhotoCount(property) * 10 +
  getDocumentCount(property) * 5 +
  getFloorPlanCount(property) * 8 +
  String(property?.marketingDescription || property?.propertyDescription || "").length;

export const usePublicCatalog = ({
  forcedType = null,
  collectionSlug = "",
  pageSize = 6,
  language = "ru",
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(buildFiltersFromParams(searchParams, forcedType));
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [recentIds, setRecentIds] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);

  useEffect(() => {
    setFilters(buildFiltersFromParams(searchParams, forcedType));
  }, [forcedType, searchParams]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchPublicCatalog();
      setProperties(data);
      setLoading(false);
    };

    load();
  }, []);

  useEffect(() => {
    setFavoriteIds(getFavoriteIds());
    setCompareIds(getCompareIds());
    setRecentIds(getRecentlyViewedIds());
    setSavedSearches(getSavedSearches());
  }, []);

  const collectionConfig = useMemo(
    () => (collectionSlug ? getSeoCollectionConfig(collectionSlug, language) : null),
    [collectionSlug, language],
  );

  const filteredProperties = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const minPrice = parsePrice(filters.minPrice);
    const maxPrice = parsePrice(filters.maxPrice);

    const base = properties.filter((property) => {
      const propertyTypeKey =
        property?.propertyTypeKey || normalizePropertyTypeKey(property?.propertyType);
      const price = parsePrice(property?.listingPrice);
      const bedrooms = Number(property?.numberofBedrooms || 0);
      const bathrooms = Number(property?.numberofBathrooms || 0);
      const status = String(property?.listingStatus || "").toLowerCase();
      const matchesCollection = collectionConfig?.filter ? collectionConfig.filter(property) : true;

      return (
        matchesCollection &&
        (!search || property?.searchableText?.includes(search)) &&
        (filters.status === "all" || status.includes(String(filters.status).toLowerCase())) &&
        (filters.type === "all" || propertyTypeKey === filters.type) &&
        (!minPrice || price >= minPrice) &&
        (!maxPrice || price <= maxPrice) &&
        (filters.bedrooms === "all" || bedrooms >= Number(filters.bedrooms)) &&
        (filters.bathrooms === "all" || bathrooms >= Number(filters.bathrooms)) &&
        (!filters.onlyWithPhotos || getPhotoCount(property) > 0) &&
        (!filters.onlyRich || isRichListing(property))
      );
    });

    return [...base].sort((left, right) => {
      if (filters.sortBy === "priceHigh") {
        return parsePrice(right?.listingPrice) - parsePrice(left?.listingPrice);
      }
      if (filters.sortBy === "priceLow") {
        return parsePrice(left?.listingPrice) - parsePrice(right?.listingPrice);
      }
      if (filters.sortBy === "bestFilled") {
        return getRichScore(right) - getRichScore(left);
      }
      return new Date(right?.updatedDate || right?.createdDate || 0) - new Date(left?.updatedDate || left?.createdDate || 0);
    });
  }, [collectionConfig, filters, properties]);

  const totalPages = Math.max(Math.ceil(filteredProperties.length / pageSize), 1);
  const currentPage = Math.min(filters.page || 1, totalPages);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    const params = applyFiltersToParams({ ...filters, page: currentPage });
    setSearchParams(params, { replace: true });
  }, [currentPage, filters, setSearchParams]);

  const featuredProperties = useMemo(
    () =>
      filteredProperties
        .filter((property) => getPhotoCount(property) > 0)
        .slice(0, 6),
    [filteredProperties],
  );

  const recentProperties = useMemo(
    () => recentIds.map((id) => properties.find((item) => item?._id === id)).filter(Boolean),
    [properties, recentIds],
  );

  const savedProperties = useMemo(
    () => favoriteIds.map((id) => properties.find((item) => item?._id === id)).filter(Boolean),
    [favoriteIds, properties],
  );

  const stats = useMemo(
    () => ({
      total: properties.length,
      filtered: filteredProperties.length,
      featured: featuredProperties.length,
      rich: properties.filter((property) => isRichListing(property)).length,
      activeShortlist: favoriteIds.length + compareIds.length,
      totalLabel: formatCompactNumber(properties.length),
    }),
    [compareIds.length, favoriteIds.length, featuredProperties.length, filteredProperties.length, properties],
  );

  const activeFilterCount = useMemo(
    () =>
      Object.entries(filters).reduce((count, [key, value]) => {
        if (key === "page") return count;
        if (key === "sortBy") return value !== DEFAULT_PUBLIC_FILTERS.sortBy ? count + 1 : count;
        if (typeof value === "boolean") return value ? count + 1 : count;
        return value && value !== "all" ? count + 1 : count;
      }, 0),
    [filters],
  );

  const updateFilters = (patch) => {
    setFilters((current) => ({
      ...current,
      ...patch,
      page: patch.page ?? (patch.page === 0 ? 1 : patch.page || 1),
    }));
  };

  const resetFilters = () => {
    setFilters({
      ...DEFAULT_PUBLIC_FILTERS,
      type: forcedType || "all",
    });
  };

  const toggleFavorite = (id) => {
    const next = toggleFavoriteId(id);
    setFavoriteIds(next);
    return next;
  };

  const toggleCompare = (id) => {
    const next = toggleCompareId(id);
    setCompareIds(next);
    return next;
  };

  const saveCurrentSearch = () => {
    const snapshot = {
      label: buildSavedSearchLabel(filters, language),
      filters: { ...filters, page: 1 },
      pathname: window.location.pathname,
      search: applyFiltersToParams({ ...filters, page: 1 }).toString(),
    };
    const next = saveSearchSnapshot(snapshot);
    setSavedSearches(next);
    return next;
  };

  const applySavedSearch = (snapshot) => {
    const nextFilters = {
      ...DEFAULT_PUBLIC_FILTERS,
      ...(snapshot?.filters || {}),
      type: forcedType || snapshot?.filters?.type || "all",
    };
    setFilters(nextFilters);
  };

  const removeSearch = (id) => {
    const next = removeSavedSearch(id);
    setSavedSearches(next);
    return next;
  };

  return {
    properties,
    filteredProperties,
    paginatedProperties,
    featuredProperties,
    savedProperties,
    recentProperties,
    loading,
    filters: { ...filters, page: currentPage },
    updateFilters,
    resetFilters,
    currentPage,
    totalPages,
    favoriteIds,
    compareIds,
    recentIds,
    savedSearches,
    saveCurrentSearch,
    applySavedSearch,
    removeSavedSearch: removeSearch,
    toggleFavorite,
    toggleCompare,
    stats,
    activeFilterCount,
    collectionConfig,
  };
};
