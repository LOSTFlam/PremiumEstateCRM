import { useEffect, useMemo, useState } from "react";
import { getApi } from "services/api";
import { extractCollection } from "utils/normalizeResponse";

const BRANDING_CACHE_KEY = "public:branding:active";

const normalizeBrandingItems = (items) =>
  Array.isArray(items) ? items.filter(Boolean) : [];

export const getActiveBrandRecord = (items = []) => {
  const normalizedItems = normalizeBrandingItems(items);
  return normalizedItems.find((item) => item?.isActive) || normalizedItems[0] || null;
};

export const getBrandLogoSrc = (brandRecord, variant = "large") => {
  if (!brandRecord) return "";

  if (variant === "small") {
    return brandRecord?.logoSmImg || brandRecord?.logoLgImg || "";
  }

  return brandRecord?.logoLgImg || brandRecord?.logoSmImg || "";
};

export default function useActiveBranding(initialItems = []) {
  const normalizedInitialItems = useMemo(
    () => normalizeBrandingItems(initialItems),
    [initialItems],
  );
  const [branding, setBranding] = useState(normalizedInitialItems);
  const [hasLoaded, setHasLoaded] = useState(Boolean(normalizedInitialItems.length));

  useEffect(() => {
    if (!normalizedInitialItems.length) return;
    setBranding(normalizedInitialItems);
    setHasLoaded(true);
  }, [normalizedInitialItems]);

  useEffect(() => {
    if (hasLoaded) return undefined;

    let isMounted = true;

    const fetchBranding = async () => {
      try {
        const response = await getApi("api/images/?isActive=true", {
          useCache: true,
          cacheKey: BRANDING_CACHE_KEY,
        });
        const collection = extractCollection(response);
        const activeItems = collection.filter((item) => item?.isActive);

        if (!isMounted) return;

        setBranding(activeItems.length ? activeItems : collection);
      } catch (error) {
        if (!isMounted) return;
        setBranding([]);
      } finally {
        if (isMounted) {
          setHasLoaded(true);
        }
      }
    };

    fetchBranding();

    return () => {
      isMounted = false;
    };
  }, [hasLoaded]);

  return branding;
}
