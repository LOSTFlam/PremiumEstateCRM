const OFFICIAL_RATE_PAGE_URL = "https://www.cbr.ru/eng/currency_base/daily/";
const OFFICIAL_RATE_XML_URL = "https://www.cbr.ru/scripts/XML_daily.asp";
const CACHE_TTL_MS = 60 * 60 * 1000;

let rateCache = null;

const parseNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const normalized = String(value).replace(/\s/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const roundAmount = (value, fractionDigits = 2) => {
  if (!Number.isFinite(Number(value))) {
    return null;
  }

  return Number(Number(value).toFixed(fractionDigits));
};

const fetchXmlWithTimeout = async (url, timeoutMs = 10000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/xml,text/xml,text/plain,*/*",
        "User-Agent": "PremiumEstateCRM/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Exchange rate source returned ${response.status}`);
    }

    return response.text();
  } finally {
    clearTimeout(timeout);
  }
};

const parseUsdRubRateFromXml = (xml) => {
  const usdBlockMatch = xml.match(
    /<Valute[^>]*>[\s\S]*?<CharCode>\s*USD\s*<\/CharCode>[\s\S]*?<Nominal>\s*([^<]+)\s*<\/Nominal>[\s\S]*?<Value>\s*([^<]+)\s*<\/Value>[\s\S]*?<\/Valute>/i,
  );

  if (!usdBlockMatch) {
    throw new Error("USD rate block not found in Bank of Russia response");
  }

  const nominal = parseNumber(usdBlockMatch[1]);
  const rubValue = parseNumber(usdBlockMatch[2]);

  if (!nominal || !rubValue) {
    throw new Error("Unable to parse USD/RUB rate from Bank of Russia response");
  }

  const effectiveDate = xml.match(/Date="([^"]+)"/i)?.[1] || null;
  const rate = rubValue / nominal;

  return {
    baseCurrency: "USD",
    quoteCurrency: "RUB",
    rate: roundAmount(rate, 4),
    inverseRate: roundAmount(1 / rate, 6),
    effectiveDate,
  };
};

const getCachedRate = () => {
  if (!rateCache) {
    return null;
  }

  if (Date.now() - rateCache.cachedAt > CACHE_TTL_MS) {
    rateCache = null;
    return null;
  }

  return rateCache;
};

const getUsdRubRate = async ({ forceRefresh = false } = {}) => {
  if (!forceRefresh) {
    const cached = getCachedRate();
    if (cached) {
      return {
        ...cached,
        cached: true,
      };
    }
  }

  const xml = await fetchXmlWithTimeout(OFFICIAL_RATE_XML_URL);
  const parsed = parseUsdRubRateFromXml(xml);
  const fetchedAt = new Date().toISOString();

  rateCache = {
    ...parsed,
    fetchedAt,
    source: "Bank of Russia",
    sourceUrl: OFFICIAL_RATE_PAGE_URL,
    sourceXmlUrl: OFFICIAL_RATE_XML_URL,
    cachedAt: Date.now(),
  };

  return {
    ...rateCache,
    cached: false,
  };
};

module.exports = {
  OFFICIAL_RATE_PAGE_URL,
  OFFICIAL_RATE_XML_URL,
  getUsdRubRate,
  roundAmount,
};
