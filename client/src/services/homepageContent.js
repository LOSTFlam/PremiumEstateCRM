import { clearApiCache, getApi, putApi } from "services/api";
import { mergeHomepageContent } from "utils/homepageContent";

const normalizeResponse = (response) =>
  mergeHomepageContent({
    visibility: response?.visibility || response?.data?.visibility,
    locales: response?.locales || response?.data?.locales,
    heroPropertyId: response?.heroPropertyId || response?.data?.heroPropertyId || null,
  });

export const fetchPublicHomepageContent = async () => {
  try {
    const response = await getApi("api/homepage-content/public", {
      useCache: true,
      cacheKey: "public:homepage-content",
      silent: true,
    });

    return {
      content: normalizeResponse(response),
      updatedDate: response?.updatedDate || response?.data?.updatedDate || null,
    };
  } catch {
    return {
      content: mergeHomepageContent(),
      updatedDate: null,
    };
  }
};

export const fetchHomepageContent = async () => {
  const response = await getApi("api/homepage-content");
  return {
    content: normalizeResponse(response),
    updatedDate: response?.updatedDate || response?.data?.updatedDate || null,
  };
};

export const updateHomepageContent = async (content) => {
  const payload = mergeHomepageContent(content);
  const response = await putApi("api/homepage-content/edit", payload);
  clearApiCache("public:homepage-content");

  return {
    content: normalizeResponse(response?.data || response),
    updatedDate: response?.data?.updatedDate || response?.updatedDate || null,
  };
};
