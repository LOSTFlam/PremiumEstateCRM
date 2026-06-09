const STORAGE_KEY = "premium_estate_usd_rub";
const CACHE_TTL_MS = 60 * 60 * 1000;
const DEFAULT_RATE = 88;
const API_URL = "/api/exchange-rates/latest/USD";

export const getRate = () => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return DEFAULT_RATE;
    const { rate, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL_MS) return DEFAULT_RATE;
    return rate;
  } catch {
    return DEFAULT_RATE;
  }
};

export const initExchangeRate = async () => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const { timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp <= CACHE_TTL_MS) return;
      } catch {
        // Ignore corrupt cached exchange-rate metadata and refresh it below.
      }
    }
    const res = await fetch(API_URL);
    const data = await res.json();
    const rate = data.rates?.RUB || DEFAULT_RATE;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rate, timestamp: Date.now() }));
  } catch {
    // Silently fall back to default rate
  }
};

export const formatWithCurrency = (amount, locale = "en-US", currency = "USD") => {
  if (!amount || !Number.isFinite(amount)) return null;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};
