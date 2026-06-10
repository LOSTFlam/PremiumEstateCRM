import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchPublicStorefrontSettings } from "services/storefrontSettings";
import {
  DEFAULT_STOREFRONT_PRESETS,
  getStorefrontPresetBySlug,
  resolveStorefrontPresetSlug,
} from "utils/storefrontPresets";
import {
  getCompareIds,
  getFavoriteIds,
  getSavedSearches,
  removeSavedSearch,
  saveSearchSnapshot,
  toggleCompareId,
  toggleFavoriteId,
} from "./catalogStorage";
import { formatCompactNumber, getPhotoCount, isRichListing } from "./catalogData";
import {
  DEFAULT_PUBLIC_FILTERS,
  extractPresetFilters,
  filterAndSortCatalogProperties,
} from "./catalogFilters";
import { fetchPublicCatalog } from "./catalogService";
import { getSeoCollectionConfig } from "./seoCollections";

const booleanFromParam = (value) => value === "1" || value === "true";
const numberParam = (value, fallback = 1) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const buildFiltersFromParams = (searchParams, forcedType = null, presetFilters = null) => {
  const preset = extractPresetFilters(presetFilters);
  const hasWithPhotos = searchParams.has("withPhotos");
  const hasRich = searchParams.has("rich");

  return {
    ...DEFAULT_PUBLIC_FILTERS,
    ...preset,
    search: searchParams.get("search") || preset.search || "",
    status: searchParams.get("status") || preset.status || "all",
    type: forcedType || searchParams.get("type") || preset.type || "all",
    dealType: searchParams.get("deal") || preset.dealType || "all",
    sortBy: searchParams.get("sort") || preset.sortBy || "latest",
    page: numberParam(searchParams.get("page"), 1),
    minPrice: searchParams.get("minPrice") || preset.minPrice || "",
    maxPrice: searchParams.get("maxPrice") || preset.maxPrice || "",
    bedrooms: searchParams.get("bedrooms") || preset.bedrooms || "all",
    bathrooms: searchParams.get("bathrooms") || preset.bathrooms || "all",
    onlyWithPhotos: hasWithPhotos
      ? booleanFromParam(searchParams.get("withPhotos"))
      : Boolean(preset.onlyWithPhotos),
    onlyRich: hasRich ? booleanFromParam(searchParams.get("rich")) : Boolean(preset.onlyRich),
    verificationStatus:
      searchParams.get("verificationStatus") || preset.verificationStatus || "all",
    featuredCollection: searchParams.get("collection") || preset.featuredCollection || "",
  };
};

const applyFiltersToParams = (filters) => {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.status !== "all") params.set("status", filters.status);
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.dealType && filters.dealType !== "all") params.set("deal", filters.dealType);
  if (filters.sortBy !== "latest") params.set("sort", filters.sortBy);
  if (Number(filters.page) > 1) params.set("page", String(filters.page));
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.bedrooms !== "all") params.set("bedrooms", String(filters.bedrooms));
  if (filters.bathrooms !== "all") params.set("bathrooms", String(filters.bathrooms));
  if (filters.onlyWithPhotos) params.set("withPhotos", "1");
  if (filters.onlyRich) params.set("rich", "1");
  if (filters.verificationStatus !== "all")
    params.set("verificationStatus", String(filters.verificationStatus));
  if (filters.featuredCollection) params.set("collection", String(filters.featuredCollection));

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

export const usePublicCatalog = ({
  forcedType = null,
  collectionSlug = "",
  pageSize = 6,
  language = "ru",
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [presetsLoading, setPresetsLoading] = useState(true);
  const activePresetSlug = useMemo(
    () => resolveStorefrontPresetSlug({ forcedType, collectionSlug }),
    [collectionSlug, forcedType]
  );
  const [storefrontPresets, setStorefrontPresets] = useState(DEFAULT_STOREFRONT_PRESETS);
  const activePreset = useMemo(
    () => getStorefrontPresetBySlug(storefrontPresets, activePresetSlug),
    [activePresetSlug, storefrontPresets]
  );
  const [filters, setFilters] = useState(
    buildFiltersFromParams(
      searchParams,
      forcedType,
      getStorefrontPresetBySlug(DEFAULT_STOREFRONT_PRESETS, activePresetSlug)
    )
  );
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);

  useEffect(() => {
    setFilters(buildFiltersFromParams(searchParams, forcedType, activePreset));
  }, [activePreset, forcedType, searchParams]);

  useEffect(() => {
    let ignore = false;

    const loadPresets = async () => {
      setPresetsLoading(true);

      try {
        const response = await fetchPublicStorefrontSettings();
        if (!ignore) {
          setStorefrontPresets(response.presets);
        }
      } finally {
        if (!ignore) {
          setPresetsLoading(false);
        }
      }
    };

    loadPresets();

    return () => {
      ignore = true;
    };
  }, []);

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
    setSavedSearches(getSavedSearches());
  }, []);

  const collectionConfig = useMemo(
    () => (collectionSlug ? getSeoCollectionConfig(collectionSlug, language) : null),
    [collectionSlug, language]
  );

  const filteredProperties = useMemo(
    () => filterAndSortCatalogProperties(properties, filters),
    [filters, properties]
  );

  const totalPages = Math.max(Math.ceil(filteredProperties.length / pageSize), 1);
  const currentPage = Math.min(filters.page || 1, totalPages);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    const params = applyFiltersToParams({ ...filters, page: currentPage });
    setSearchParams(params, { replace: true });
  }, [currentPage, filters, setSearchParams]);

  const featuredProperties = useMemo(
    () => filteredProperties.filter((property) => getPhotoCount(property) > 0).slice(0, 6),
    [filteredProperties]
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
    [
      compareIds.length,
      favoriteIds.length,
      featuredProperties.length,
      filteredProperties.length,
      properties,
    ]
  );

  const activeFilterCount = useMemo(
    () =>
      Object.entries(filters).reduce((count, [key, value]) => {
        if (key === "page") return count;
        if (key === "sortBy") return value !== DEFAULT_PUBLIC_FILTERS.sortBy ? count + 1 : count;
        if (typeof value === "boolean") return value ? count + 1 : count;
        return value && value !== "all" ? count + 1 : count;
      }, 0),
    [filters]
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
      ...extractPresetFilters(activePreset),
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
    loading: loading || presetsLoading,
    filters: { ...filters, page: currentPage },
    updateFilters,
    resetFilters,
    currentPage,
    totalPages,
    favoriteIds,
    compareIds,
    savedSearches,
    saveCurrentSearch,
    applySavedSearch,
    removeSavedSearch: removeSearch,
    toggleFavorite,
    toggleCompare,
    stats,
    activeFilterCount,
    collectionConfig,
    activePresetSlug,
    storefrontPresets,
  };
};
