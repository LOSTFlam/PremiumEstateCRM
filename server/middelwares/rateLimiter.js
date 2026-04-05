/**
 * Rate Limiting Middleware
 * Protects authentication endpoints from brute force attacks
 * - Login: 5 attempts per 15 minutes per IP
 * - Password reset: 3 attempts per hour per IP
 * - Register: 3 attempts per hour per IP
 * 
 * Supports both in-memory store (development) and Redis (production)
 * In production, Redis is REQUIRED for rate limiting to work correctly
 * across multiple server instances.
 * 
 * ⚠️ IMPORTANT: Fail-Closed Behavior in Production
 * -------------------------------------------------
 * When Redis is unavailable in production, this middleware returns HTTP 503
 * (Service Unavailable) for ALL rate-limited requests. This is intentional
 * and prevents brute force attacks from succeeding when rate limiting is down.
 * 
 * If you experience 503 errors in production:
 * 1. Check that REDIS_URL is correctly configured in environment variables
 * 2. Verify Redis is running and accessible from the application server
 * 3. Check Redis logs for connection errors or memory issues
 * 4. Consider using Redis Cluster for high availability
 * 
 * DO NOT disable rate limiting in production - it is a critical security measure.
 */

// Try to use Redis for persistent storage, fallback to in-memory
let redisClient = null;
let rateLimitStore = new Map();
let isProduction = process.env.NODE_ENV === 'production';
let redisAvailable = false;
const MAX_RATE_LIMIT_STORE_SIZE = 10000; // Maximum entries to prevent memory exhaustion

const initRedis = async () => {
  if (process.env.REDIS_URL) {
    try {
      const redis = require('redis');
      redisClient = redis.createClient({ url: process.env.REDIS_URL });
      redisClient.on('error', (err) => {
        console.error('Redis rate limiter error:', err);
        redisAvailable = false;
      });
      redisClient.on('connect', () => {
        redisAvailable = true;
        console.log('Redis rate limiter connected');
      });
      await redisClient.connect();
      redisAvailable = true;
      return true;
    } catch (error) {
      console.warn('Redis connection failed:', error.message);
      redisClient = null;
      redisAvailable = false;
      
      // In production, Redis is required for rate limiting
      if (isProduction) {
        console.error('CRITICAL: Redis connection failed in production. Rate limiting will fail closed.');
      } else {
        console.warn('Falling back to in-memory rate limiting (development only)');
      }
      return false;
    }
  } else if (isProduction) {
    console.error('CRITICAL: REDIS_URL not configured. Rate limiting will fail closed in production.');
    return false;
  }
  return false;
};

// Initialize Redis if available
initRedis().catch(console.error);

// Rate limit configurations
const RATE_LIMITS = {
  login: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    maxAttempts: 5,
    message: 'Too many login attempts. Please try again later.',
  },
  passwordReset: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxAttempts: 3,
    message: 'Too many password reset attempts. Please try again later.',
  },
  register: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxAttempts: 3,
    message: 'Too many registration attempts. Please try again later.',
  },
  refresh: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxAttempts: 50,  // Higher limit for token refresh
    message: 'Too many token refresh attempts. Please try again later.',
  },
  passwordChange: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxAttempts: 5,  // Limit password changes to prevent abuse
    message: 'Too many password change attempts. Please try again later.',
  },
  api: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    maxAttempts: 100,
    message: 'Too many API requests. Please try again later.',
  },
};

/**
 * Clean up expired entries from the in-memory store
 * (Not needed for Redis as it handles expiration automatically)
 */
const cleanupExpiredEntries = () => {
  if (redisClient) return; // Redis handles TTL automatically
  
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.windowEnd < now) {
      rateLimitStore.delete(key);
    }
  }
  
  // If store is still too large after cleanup, remove oldest entries
  if (rateLimitStore.size > MAX_RATE_LIMIT_STORE_SIZE) {
    const excess = rateLimitStore.size - MAX_RATE_LIMIT_STORE_SIZE;
    const keysToRemove = Array.from(rateLimitStore.keys()).slice(0, excess);
    keysToRemove.forEach(key => rateLimitStore.delete(key));
  }
};

// Run cleanup every 5 minutes (only for in-memory store)
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

/**
 * Create rate limiter middleware
 * @param {string} type - Rate limit type (login, passwordReset, register, api)
 */
const rateLimiter = (type = 'api') => {
  const config = RATE_LIMITS[type] || RATE_LIMITS.api;

  return async (req, res, next) => {
    // Fail closed in production when Redis is not available
    // This prevents brute force attacks from succeeding when rate limiting is down
    if (isProduction && !redisAvailable) {
      console.error('CRITICAL: Rate limiting unavailable in production (Redis not connected)');
      return res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable. Please contact support.',
      });
    }
    
    // Get client identifier (IP address or X-Forwarded-For)
    // FIX: Take the last IP from X-Forwarded-For chain to prevent spoofing
    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIp = forwardedFor 
      ? forwardedFor.split(',').pop().trim() 
      : (req.connection.remoteAddress || 'unknown');
    const key = `ratelimit:${type}:${clientIp}`;
    const now = Date.now();

    try {
      if (redisClient) {
        // Use Redis for rate limiting with atomic INCR operation
        // First, try to increment the counter atomically
        const count = await redisClient.incr(key);
        
        // If this is the first request, set the expiration window
        if (count === 1) {
          await redisClient.expire(key, Math.ceil(config.windowMs / 1000));
        }
        
        const ttl = await redisClient.ttl(key);
        const effectiveTtl = Math.max(0, ttl > 0 ? ttl : Math.ceil(config.windowMs / 1000));
        
        if (count > config.maxAttempts) {
          res.set({
            'Retry-After': String(effectiveTtl),
            'X-RateLimit-Limit': String(config.maxAttempts),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(now + effectiveTtl * 1000),
          });

          return res.status(429).json({
            success: false,
            message: config.message,
            retryAfter: effectiveTtl,
            retryAfterText: `Please wait ${effectiveTtl} seconds before trying again.`,
          });
        }

        res.set({
          'X-RateLimit-Limit': String(config.maxAttempts),
          'X-RateLimit-Remaining': String(config.maxAttempts - count),
          'X-RateLimit-Reset': String(now + effectiveTtl * 1000),
        });
      } else {
        // Use in-memory store (development only)
        // Check store size limit to prevent memory exhaustion
        if (rateLimitStore.size >= MAX_RATE_LIMIT_STORE_SIZE) {
          // Remove oldest entry
          const oldestKey = rateLimitStore.keys().next().value;
          rateLimitStore.delete(oldestKey);
        }
        
        let record = rateLimitStore.get(key);

        if (!record || record.windowEnd < now) {
          record = {
            count: 1,
            windowEnd: now + config.windowMs,
          };
          rateLimitStore.set(key, record);
          return next();
        }

        record.count += 1;

        if (record.count > config.maxAttempts) {
          const retryAfter = Math.max(0, Math.ceil((record.windowEnd - now) / 1000));
          res.set({
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(config.maxAttempts),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(record.windowEnd),
          });

          return res.status(429).json({
            success: false,
            message: config.message,
            retryAfter,
            retryAfterText: `Please wait ${retryAfter} seconds before trying again.`,
          });
        }

        res.set({
          'X-RateLimit-Limit': String(config.maxAttempts),
          'X-RateLimit-Remaining': String(config.maxAttempts - record.count),
          'X-RateLimit-Reset': String(record.windowEnd),
        });
      }
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Don't block request if rate limiter fails
    }

    next();
  };
};

/**
 * Account lockout middleware
 * Locks account after consecutive failed login attempts
 */
const accountLockout = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) return next();

    const User = require('../model/schema/user');
    // FIX: Use exact match with lowercase normalization instead of regex to prevent regex injection
    const user = await User.findOne({ username: username.toLowerCase() }).select('+lockedUntil +failedLoginAttempts');

    if (!user) return next();

    // Check if account is currently locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const lockoutMinutes = Math.ceil((user.lockedUntil - new Date()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account temporarily locked due to too many failed attempts.`,
        lockedUntil: user.lockedUntil,
        lockoutMinutes,
      });
    }

    // Reset lockout if window has passed
    if (user.lockedUntil && user.lockedUntil <= new Date()) {
      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
      await user.save();
    }

    next();
  } catch (error) {
    // Don't block request if lockout check fails
    console.error('Account lockout check error:', error);
    next();
  }
};

/**
 * Increment failed login attempts
 * Uses atomic operations to prevent race conditions
 * @param {string} userId - User ID
 * @returns {Promise<{locked: boolean, lockedUntil: Date|null}>} Lockout status
 */
const incrementFailedAttempts = async (userId) => {
  try {
    const User = require('../model/schema/user');
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_DURATION = 15 * 60 * 1000;  // 15 minutes

    // Atomically increment failed login attempts
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { failedLoginAttempts: 1 } },
      { new: true }
    ).select('+lockedUntil +failedLoginAttempts');

    if (!user) return { locked: false, lockedUntil: null };

    // Lock account if max attempts reached
    if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION);
      await User.findByIdAndUpdate(userId, {
        failedLoginAttempts: 0,  // Reset counter after lockout
        lockedUntil,
      });
      
      return { locked: true, lockedUntil };
    }

    return { locked: false, lockedUntil: null };
  } catch (error) {
    console.error('Failed to increment login attempts:', error);
    return { locked: false, lockedUntil: null };
  }
};

/**
 * Reset failed login attempts on successful login
 */
const resetFailedAttempts = async (userId) => {
  try {
    const User = require('../model/schema/user');
    await User.findByIdAndUpdate(userId, {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
      lastActiveAt: new Date(),  // CRITICAL FIX: Update lastActiveAt to prevent immediate session expiry
    });
  } catch (error) {
    console.error('Failed to reset login attempts:', error);
  }
};

module.exports = {
  rateLimiter,
  accountLockout,
  incrementFailedAttempts,
  resetFailedAttempts,
  RATE_LIMITS,
  getRedisClient: () => redisClient,
};
