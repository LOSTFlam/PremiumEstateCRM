const crypto = require("crypto");

const CSRF_COOKIE = "csrfToken";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const getCsrfCookieOptions = () => ({
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
});

const issueCsrfToken = (res) => {
  const token = crypto.randomBytes(32).toString("hex");
  res.cookie(CSRF_COOKIE, token, getCsrfCookieOptions());
  return token;
};

const verifyCsrf = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.headers["x-csrf-token"];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ message: "Invalid or missing CSRF token" });
  }

  return next();
};

module.exports = { CSRF_COOKIE, issueCsrfToken, verifyCsrf, getCsrfCookieOptions };
