const jwt = require("jsonwebtoken");
const { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME, SESSION_TIMEOUT, isSessionActive, updateLastActive } = require("../controllers/user/auth.service");
const User = require("../model/schema/user");

// Short-term user state cache to reduce DB load
// TTL: 10 seconds - balances performance with security responsiveness
// NOTE: Cached users may authenticate for up to 10s after deletion/lockout.
// Call invalidateUserCache(userId) after security-sensitive operations.
const userCache = new Map();
const USER_CACHE_TTL = 10 * 1000; // 10 seconds (reduced from 30s for better security)
const MAX_CACHE_SIZE = 10000; // Prevent unbounded memory growth

const getCachedUser = async (userId) => {
  const cached = userCache.get(userId);
  if (cached && Date.now() - cached.timestamp < USER_CACHE_TTL) {
    return cached.data;
  }
  
  // Cache miss or expired - fetch from DB
  // Errors from User.findById will propagate to the caller
  const user = await User.findById(userId)
    .select("+deleted +lockedUntil +lastActiveAt +isBlocked +blockReason")
    .lean();
  if (user) {
    // Prevent unbounded cache growth
    if (userCache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entry
      const oldestKey = userCache.keys().next().value;
      userCache.delete(oldestKey);
    }
    userCache.set(userId, { data: user, timestamp: Date.now() });
  }
  return user;
};

// Periodically clean expired cache entries
const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [userId, entry] of userCache.entries()) {
    if (now - entry.timestamp >= USER_CACHE_TTL) {
      userCache.delete(userId);
    }
  }
};
const cacheCleanupInterval = setInterval(cleanExpiredCache, USER_CACHE_TTL);
cacheCleanupInterval.unref();

// Graceful shutdown - cleanup on process termination
const cleanupCacheOnShutdown = () => {
  clearInterval(cacheCleanupInterval);
  userCache.clear();
};
process.on('SIGTERM', cleanupCacheOnShutdown);
process.on('SIGINT', cleanupCacheOnShutdown);

/**
 * Invalidate cached user entry
 * Call this when user data changes (password change, lockout, role change, etc.)
 * @param {string} userId - User ID to invalidate
 */
const invalidateUserCache = (userId) => {
  userCache.delete(userId);
};

/**
 * Invalidate all cached user entries
 * Use sparingly - only for major security events
 */
const invalidateAllUserCache = () => {
  userCache.clear();
};

const resolveAuthToken = (req) => {
  const authorization = req.headers.authorization;
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];

  if (typeof authorization === "string" && authorization.startsWith("Bearer ")) {
    return authorization.slice(7).trim();
  }

  if (typeof authorization === "string" && authorization.trim()) {
    return authorization.trim();
  }

  if (typeof cookieToken === "string" && cookieToken.trim()) {
    return cookieToken.trim();
  }

  return null;
};

/**
 * Enhanced authentication middleware with session timeout
 * - Validates JWT token
 * - Checks if session has timed out (30 minutes)
 * - Updates last active timestamp
 * - Checks if user account is locked
 */
const auth = async (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Server authentication is not configured" });
  }

  const token = resolveAuthToken(req);
  if (!token) {
    return res.status(401).json({ message: "Authentication failed, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is not deleted (with short-term caching)
    let user;
    try {
      user = await getCachedUser(decoded.userId);
    } catch (dbError) {
      // Console statement removed
      return res.status(500).json({ message: "Authentication service temporarily unavailable" });
    }
    
    if (!user || user.deleted) {
      return res.status(401).json({ message: "Authentication failed. User not found or deleted." });
    }
    
    if (user.isBlocked) {
      return res.status(403).json({
        message: user.blockReason || "Your account has been blocked by an administrator",
        blocked: true,
      });
    }

    // Check if account is locked due to failed login attempts
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const lockoutMinutes = Math.ceil((user.lockedUntil - new Date()) / 60000);
      return res.status(423).json({
        message: `Account temporarily locked. Try again in ${lockoutMinutes} minutes.`,
        lockedUntil: user.lockedUntil,
      });
    }
    
    // Fresh accounts may not have lastActiveAt yet — allow first authenticated request
    if (user.lastActiveAt && !isSessionActive(user.lastActiveAt)) {
      return res.status(401).json({
        message: "Session expired. Please login again.",
        sessionTimeout: SESSION_TIMEOUT / 60000,
      });
    }
    
    // Update last active timestamp (non-blocking, don't fail auth if this fails)
    updateLastActive(decoded.userId).catch(() => undefined);
    
    req.user = decoded;
    req.authToken = token;
    return next();
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Authentication failed. Token expired." });
    }
    if (error?.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Authentication failed. Invalid token." });
    }
    // Re-throw unexpected errors to be handled by global error handler
    // Console statement removed
    return res.status(500).json({ message: "Authentication service temporarily unavailable" });
  }
};

/**
 * Optional auth middleware - doesn't fail if no token
 * Adds user to request if authenticated, otherwise continues
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = resolveAuthToken(req);
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getCachedUser(decoded.userId);
    
    if (!user || user.deleted) {
      req.user = null;
      return next();
    }
    
    // Include role from decoded token for authorize middleware
    req.user = { ...decoded, role: decoded.role };
    req.authToken = token;
  } catch (error) {
    req.user = null;
  }
  
  return next();
};

/**
 * Role-based authorization middleware
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "You do not have permission to access this resource",
        requiredRoles: roles,
      });
    }

    return next();
  };
};

module.exports = { auth, optionalAuth, authorize, resolveAuthToken, invalidateUserCache, invalidateAllUserCache };
