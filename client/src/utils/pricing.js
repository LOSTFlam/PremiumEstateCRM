export const USD_CURRENCY = "USD";
export const RUB_CURRENCY = "RUB";
export const USD_RUB_RATE_STORAGE_KEY = "premiumEstateUsdRubRate";

export const isRussianLanguage = (language = "") =>
  String(language).toLowerCase().startsWith("ru");

export const parseNumericAmount = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const normalized = String(value)
    .replace(/\s/g, "")
    .replace(/,/g, ".")
    .replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

export const roundAmount = (value, fractionDigits = 2) => {
  const parsed = parseNumericAmount(value);
  if (parsed === null) {
    return null;
  }

  return Number(parsed.toFixed(fractionDigits));
};

export const getPreferredCurrency = (language = "") =>
  isRussianLanguage(language) ? RUB_CURRENCY : USD_CURRENCY;

export const getSecondaryCurrency = (language = "") =>
  getPreferredCurrency(language) === RUB_CURRENCY ? USD_CURRENCY : RUB_CURRENCY;

export const getStoredUsdRubRate = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(USD_RUB_RATE_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return parsed?.rate ? parsed : null;
  } catch (error) {
    console.error("Failed to parse stored exchange rate", error);
    return null;
  }
};

export const storeUsdRubRate = (rateData) => {
  if (typeof window === "undefined" || !rateData?.rate) {
    return;
  }

  window.localStorage.setItem(
    USD_RUB_RATE_STORAGE_KEY,
    JSON.stringify(rateData),
  );
};

export const getUsdRubRateValue = (rateData) =>
  parseNumericAmount(
    rateData?.rate ?? rateData?.priceExchangeRate ?? getStoredUsdRubRate()?.rate,
  );

export const convertUsdToRub = (amount, rateData) => {
  const usdAmount = parseNumericAmount(amount);
  const rate = getUsdRubRateValue(rateData);

  if (usdAmount === null || !rate) {
    return null;
  }

  return roundAmount(usdAmount * rate, 0);
};

export const convertRubToUsd = (amount, rateData) => {
  const rubAmount = parseNumericAmount(amount);
  const rate = getUsdRubRateValue(rateData);

  if (rubAmount === null || !rate) {
    return null;
  }

  return roundAmount(rubAmount / rate, 2);
};

export const formatCurrencyAmount = (
  amount,
  { currency = USD_CURRENCY, language = "en", maximumFractionDigits = 0 } = {},
) => {
  const parsed = parseNumericAmount(amount);
  if (parsed === null) {
    return null;
  }

  return new Intl.NumberFormat(
    isRussianLanguage(language) ? "ru-RU" : "en-US",
    {
      style: "currency",
      currency,
      maximumFractionDigits,
    },
  ).format(parsed);
};

export const getPropertyUsdAmount = (propertyOrValue, rateData) => {
  if (
    propertyOrValue === null ||
    propertyOrValue === undefined ||
    typeof propertyOrValue !== "object" ||
    Array.isArray(propertyOrValue)
  ) {
    return parseNumericAmount(propertyOrValue);
  }

  const usdAmount = parseNumericAmount(propertyOrValue?.listingPrice);
  if (usdAmount !== null) {
    return usdAmount;
  }

  if (String(propertyOrValue?.priceCurrency || "").toUpperCase() === RUB_CURRENCY) {
    return convertRubToUsd(
      propertyOrValue?.listingPriceRub ?? propertyOrValue?.listingPrice,
      propertyOrValue?.priceExchangeRate || rateData,
    );
  }

  return null;
};

export const getPropertyRubAmount = (propertyOrValue, rateData) => {
  if (
    propertyOrValue !== null &&
    propertyOrValue !== undefined &&
    typeof propertyOrValue === "object" &&
    !Array.isArray(propertyOrValue)
  ) {
    const rubAmount = parseNumericAmount(propertyOrValue?.listingPriceRub);
    if (rubAmount !== null) {
      return rubAmount;
    }
  }

  const usdAmount = getPropertyUsdAmount(propertyOrValue, rateData);
  return convertUsdToRub(usdAmount, propertyOrValue?.priceExchangeRate || rateData);
};

export const formatPropertyPrice = (
  propertyOrValue,
  { language = "en", t, rateData, preferredCurrency } = {},
) => {
  const fallback =
    t?.("publicListing.priceOnRequest") ||
    (isRussianLanguage(language) ? "Цена по запросу" : "Price on request");

  const currency = preferredCurrency || getPreferredCurrency(language);
  const amount =
    currency === RUB_CURRENCY
      ? getPropertyRubAmount(propertyOrValue, rateData)
      : getPropertyUsdAmount(propertyOrValue, rateData);

  return formatCurrencyAmount(amount, { currency, language }) || fallback;
};

export const formatPropertyPriceSecondary = (
  propertyOrValue,
  { language = "en", rateData } = {},
) => {
    const currency = getSecondaryCurrency(language);
    const amount =
      currency === RUB_CURRENCY
        ? getPropertyRubAmount(propertyOrValue, rateData)
        : getPropertyUsdAmount(propertyOrValue, rateData);

    return formatCurrencyAmount(amount, { currency, language });
};

export const buildPropertyPricingPayload = ({
  amount,
  currency = USD_CURRENCY,
  rateData,
}) => {
  const normalizedCurrency =
    String(currency).toUpperCase() === RUB_CURRENCY ? RUB_CURRENCY : USD_CURRENCY;
  const parsedAmount = parseNumericAmount(amount);

  if (parsedAmount === null) {
    return {
      listingPrice: "",
      listingPriceRub: "",
      priceCurrency: normalizedCurrency,
      priceExchangeRate: getUsdRubRateValue(rateData) || "",
      priceExchangeUpdatedAt: rateData?.fetchedAt || "",
    };
  }

  const usdAmount =
    normalizedCurrency === RUB_CURRENCY
      ? convertRubToUsd(parsedAmount, rateData)
      : roundAmount(parsedAmount, 2);
  const rubAmount =
    normalizedCurrency === RUB_CURRENCY
      ? roundAmount(parsedAmount, 0)
      : convertUsdToRub(parsedAmount, rateData);

  return {
    listingPrice: usdAmount ?? "",
    listingPriceRub: rubAmount ?? "",
    priceCurrency: normalizedCurrency,
    priceExchangeRate: getUsdRubRateValue(rateData) || "",
    priceExchangeUpdatedAt: rateData?.fetchedAt || "",
  };
};
