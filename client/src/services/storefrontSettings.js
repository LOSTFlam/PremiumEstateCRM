import { clearApiCache, getApi, putApi } from "services/api";
import { DEFAULT_STOREFRONT_PRESETS, mergeStorefrontPresets } from "utils/storefrontPresets";

const normalizeResponsePresets = (response) =>
  mergeStorefrontPresets(response?.presets || response?.data?.presets || []);

export const fetchPublicStorefrontSettings = async () => {
  try {
    const response = await getApi("api/storefront-settings/public", {
      useCache: true,
      cacheKey: "public:storefront-settings",
      silent: true,
    });

    return {
      presets: normalizeResponsePresets(response),
      updatedDate: response?.updatedDate || response?.data?.updatedDate || null,
    };
  } catch (error) {
    // Console statement removed
    return {
      presets: DEFAULT_STOREFRONT_PRESETS,
      updatedDate: null,
    };
  }
};

export const fetchStorefrontSettings = async () => {
  const response = await getApi("api/storefront-settings");
  return {
    presets: normalizeResponsePresets(response),
    updatedDate: response?.updatedDate || response?.data?.updatedDate || null,
  };
};

export const updateStorefrontSettings = async (presets = []) => {
  const response = await putApi("api/storefront-settings/edit", {
    presets: mergeStorefrontPresets(presets),
  });

  clearApiCache("public:storefront-settings");
  return {
    presets: normalizeResponsePresets(response?.data || response),
    updatedDate: response?.data?.updatedDate || response?.updatedDate || null,
  };
};
