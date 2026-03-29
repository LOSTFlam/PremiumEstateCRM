const jwt = require("jsonwebtoken");
const AUTH_COOKIE_NAME = "token";

const assertJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT_SECRET is not configured");
    error.statusCode = 500;
    throw error;
  }
};

const signAuthToken = (payload) => {
  assertJwtSecret();
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
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
  return source;
};

module.exports = {
  AUTH_COOKIE_NAME,
  assertJwtSecret,
  signAuthToken,
  getAuthCookieOptions,
  getLogoutCookieOptions,
  sanitizeUser,
};
