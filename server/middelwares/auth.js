const jwt = require("jsonwebtoken");
const { AUTH_COOKIE_NAME } = require("../controllers/user/auth.service");

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

const auth = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Server authentication is not configured" });
  }

  const token = resolveAuthToken(req);
  if (!token) {
    return res.status(401).json({ message: "Authentication failed, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.authToken = token;
    return next();
  } catch (error) {
    const message =
      error?.name === "TokenExpiredError"
        ? "Authentication failed. Token expired."
        : "Authentication failed. Invalid token.";

    return res.status(401).json({ message });
  }
};

module.exports = auth;
