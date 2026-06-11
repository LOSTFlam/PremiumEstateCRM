const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../../model/schema/user");

const AUTH_COOKIE_NAME = "token";
const REFRESH_COOKIE_NAME = "refreshToken";

// Token expiration settings
const ACCESS_TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || "15m";  // Short-lived access token
const REFRESH_TOKEN_EXPIRY = "7d";  // Longer-lived refresh token
const SESSION_TIMEOUT = 30 * 60 * 1000;  // 30 minutes session timeout

const assertJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT_SECRET is not configured");
    error.statusCode = 500;
    throw error;
  }
};

const signAuthToken = (payload) => {
  assertJwtSecret();
  // payload should include { userId, role } for authorize middleware
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

const signRefreshToken = (payload) => {
  assertJwtSecret();
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

const verifyRefreshToken = (token) => {
  assertJwtSecret();
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Generate a unique refresh token ID for rotation
 */
const generateRefreshTokenId = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Store refresh token in user document with rotation support
 */
const storeRefreshToken = async (userId, refreshToken, tokenId) => {
  const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  await User.findByIdAndUpdate(userId, {
    refreshToken: tokenId,  // Store token ID for rotation tracking
    refreshTokenExpiry: expiryDate,
    lastActiveAt: new Date(),
  });
  
  return { tokenId, expiryDate };
};

/**
 * Rotate refresh token (generate new one, invalidate old)
 * This prevents token theft and replay attacks
 */
const rotateRefreshToken = async (userId, oldTokenId) => {
  const user = await User.findById(userId).select("+refreshToken +refreshTokenExpiry");
  
  if (!user) {
    return { error: "User not found" };
  }
  
  // Check if the old token ID matches (prevents token reuse after rotation)
  if (user.refreshToken !== oldTokenId) {
    // Token reuse detected - this could be a token theft attempt
    // Invalidate all refresh tokens for this user
    await User.findByIdAndUpdate(userId, {
      refreshToken: null,
      refreshTokenExpiry: null,
    });
    return { error: "Token reuse detected. All sessions invalidated." };
  }
  
  // Check if refresh token has expired
  if (user.refreshTokenExpiry && user.refreshTokenExpiry < new Date()) {
    await User.findByIdAndUpdate(userId, {
      refreshToken: null,
      refreshTokenExpiry: null,
    });
    return { error: "Refresh token expired" };
  }
  
  // Generate new refresh token
  const newTokenId = generateRefreshTokenId();
  const newRefreshToken = signRefreshToken({ userId, tokenId: newTokenId });
  
  // Store new refresh token
  await storeRefreshToken(userId, newRefreshToken, newTokenId);
  
  return { refreshToken: newRefreshToken, tokenId: newTokenId };
};

/**
 * Check if user session is still valid (not timed out)
 */
const isSessionActive = (lastActiveAt) => {
  if (!lastActiveAt) return false;
  const timeSinceLastActive = Date.now() - new Date(lastActiveAt).getTime();
  return timeSinceLastActive < SESSION_TIMEOUT;
};

/**
 * Update user's last active timestamp
 */
const updateLastActive = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    lastActiveAt: new Date(),
  });
};

const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 15 * 60 * 1000,  // 15 minutes for access token
});

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days for refresh token
});

const getLogoutCookieOptions = () => ({
  ...getAuthCookieOptions(),
  maxAge: 0,
  expires: new Date(0),
});

const sanitizeUser = (user) => {
  if (!user) return null;

  const source = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete source.password;
  delete source.refreshToken;
  delete source.refreshTokenExpiry;
  delete source.failedLoginAttempts;
  delete source.lockedUntil;
  delete source.passwordHistory;
  return source;
};

module.exports = {
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  SESSION_TIMEOUT,
  assertJwtSecret,
  signAuthToken,
  signRefreshToken,
  verifyRefreshToken,
  generateRefreshTokenId,
  storeRefreshToken,
  rotateRefreshToken,
  isSessionActive,
  updateLastActive,
  getAuthCookieOptions,
  getRefreshCookieOptions,
  getLogoutCookieOptions,
  sanitizeUser,
};
