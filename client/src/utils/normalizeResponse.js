export const isPlainObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const extractCollection = (response, key = "") => {
  if (Array.isArray(response)) return response;
  if (!isPlainObject(response)) return [];
  if (Array.isArray(response?.data)) return response.data;
  if (key && Array.isArray(response?.[key])) return response[key];
  if (key && Array.isArray(response?.data?.[key])) return response.data[key];
  return [];
};

export const extractEntity = (response, key = "") => {
  if (!isPlainObject(response)) return null;
  if (key && isPlainObject(response?.[key])) return response[key];
  if (key && isPlainObject(response?.data?.[key])) return response.data[key];
  if (isPlainObject(response?.data)) return response.data;
  return response;
};
