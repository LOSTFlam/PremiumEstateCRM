const RoleAccess = require("../model/schema/roleAccess");
const User = require("../model/schema/user");

const permissionCache = new Map();
const CACHE_TTL = 60000;

const DEFAULT_USER_MODULE_ACCESS = {
  Properties: { view: true, create: true, update: true, delete: true },
  Tasks: { view: true, create: true, update: true, delete: false },
  Meetings: { view: true, create: true, update: false, delete: false },
  Calls: { view: true, create: true, update: false, delete: false },
  Emails: { view: true, create: true, update: false, delete: false },
  Documents: { view: true, create: true, update: true, delete: true },
};

const mergeAccessEntries = (entries = []) => {
  const merged = {};

  entries.forEach((permission) => {
    if (!permission?.title) return;
    const { title, create, update, delete: canDelete, view } = permission;

    if (!merged[title]) {
      merged[title] = { create, update, delete: canDelete, view };
      return;
    }

    ["create", "update", "delete", "view"].forEach((key) => {
      if (permission[key]) merged[title][key] = true;
    });
  });

  return merged;
};

const getCachedUserPermissions = async (userId, jwtRole) => {
  const cacheKey = `${userId}:${jwtRole}`;
  const cached = permissionCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const user = await User.findById(userId).populate("roles").lean();
  const roleEntries = (user?.roles || []).flatMap((role) => role?.access || []);
  let merged = mergeAccessEntries(roleEntries);

  if (jwtRole === "user" && Object.keys(merged).length === 0) {
    merged = { ...DEFAULT_USER_MODULE_ACCESS };
  }

  permissionCache.set(cacheKey, { data: merged, timestamp: Date.now() });
  return merged;
};

const clearPermissionCache = () => {
  permissionCache.clear();
};

const requirePermission = (module, action) => {
  return async (req, res, next) => {
    if (!req.user?.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (req.user.role === "superAdmin") return next();

    const permissions = await getCachedUserPermissions(req.user.userId, req.user.role);
    const modulePerm = Object.entries(permissions).find(
      ([title]) => title.toLowerCase() === module.toLowerCase()
    )?.[1];

    if (!modulePerm || !modulePerm[action]) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: `${action} access to ${module}`,
      });
    }

    return next();
  };
};

const requireAnyPermission = (module, actions) => {
  return async (req, res, next) => {
    if (!req.user?.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (req.user.role === "superAdmin") return next();

    const permissions = await getCachedUserPermissions(req.user.userId, req.user.role);
    const modulePerm = Object.entries(permissions).find(
      ([title]) => title.toLowerCase() === module.toLowerCase()
    )?.[1];

    if (!modulePerm) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: `any of [${actions.join(", ")}] access to ${module}`,
      });
    }

    const hasAny = actions.some((action) => modulePerm[action]);
    if (!hasAny) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: `any of [${actions.join(", ")}] access to ${module}`,
      });
    }

    return next();
  };
};

module.exports = { requirePermission, requireAnyPermission, clearPermissionCache };
