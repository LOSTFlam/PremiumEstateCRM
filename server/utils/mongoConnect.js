const mongoose = require("mongoose");

const isSrvDnsError = (error) => {
  const message = String(error?.message || "");
  return (
    message.includes("querySrv") ||
    message.includes("ENOTFOUND") ||
    message.includes("ECONNREFUSED _mongodb._tcp")
  );
};

const normalizeDbNameOption = (dbName) => (dbName ? { dbName } : {});

const connectWithFallback = async ({
  primaryUri,
  fallbackUri,
  dbName,
  context = "mongodb",
}) => {
  const primaryOptions = normalizeDbNameOption(dbName);

  try {
    await mongoose.connect(primaryUri, primaryOptions);
    return { uri: primaryUri, usedFallback: false };
  } catch (primaryError) {
    if (!fallbackUri || !isSrvDnsError(primaryError)) {
      throw primaryError;
    }

    await mongoose.disconnect().catch(() => {});

    const fallbackOptions = normalizeDbNameOption(dbName);
    await mongoose.connect(fallbackUri, fallbackOptions);

    console.warn(
      `[${context}] SRV DNS error. Connected using DB_URL_FALLBACK (mongodb://...)`
    );

    return { uri: fallbackUri, usedFallback: true };
  }
};

module.exports = {
  connectWithFallback,
  isSrvDnsError,
};

