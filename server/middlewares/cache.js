const mongoose = require("mongoose");

const redisCache = new Map();
const DEFAULT_TTL = 5 * 60 * 1000;

const cacheMiddleware = (ttl = DEFAULT_TTL) => (req, res, next) => {
  if (req.method !== "GET") {
    return next();
  }

  const key = req.originalUrl || req.url;
  const cached = redisCache.get(key);

  if (cached && Date.now() - cached.timestamp < ttl) {
    return res.json(cached.data);
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    redisCache.set(key, {
      data: body,
      timestamp: Date.now(),
      ttl,
    });
    return originalJson(body);
  };

  next();
};

const invalidateCache = (pattern) => {
  if (!pattern) {
    redisCache.clear();
    return;
  }

  for (const key of redisCache.keys()) {
    if (key.includes(pattern)) {
      redisCache.delete(key);
    }
  }
};

const invalidateCacheByPrefix = (prefix) => {
  for (const key of redisCache.keys()) {
    if (key.startsWith(prefix)) {
      redisCache.delete(key);
    }
  }
};

const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [key, entry] of redisCache.entries()) {
    if (now - entry.timestamp >= entry.ttl) {
      redisCache.delete(key);
    }
  }
};

const cacheCleanupInterval = setInterval(cleanExpiredCache, 60 * 1000);
cacheCleanupInterval.unref();

const getCacheStats = () => ({
  size: redisCache.size,
  keys: Array.from(redisCache.keys()),
});

module.exports = {
  cacheMiddleware,
  invalidateCache,
  invalidateCacheByPrefix,
  cleanExpiredCache,
  getCacheStats,
};
