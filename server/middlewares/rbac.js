const RoleAccess = require('../model/schema/roleAccess');

const permissionCache = new Map();
const CACHE_TTL = 60000;

const getCachedPermissions = async (roleName) => {
  const cached = permissionCache.get(roleName);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const role = await RoleAccess.findOne({ roleName }).lean();
  const permissions = role?.access || [];
  permissionCache.set(roleName, { data: permissions, timestamp: Date.now() });
  return permissions;
};

const clearPermissionCache = () => {
  permissionCache.clear();
};

const requirePermission = (module, action) => {
  return async (req, res, next) => {
    if (req.user.role === 'superAdmin') return next();

    const permissions = await getCachedPermissions(req.user.role);
    const modulePerm = permissions.find(
      p => p.title.toLowerCase() === module.toLowerCase()
    );

    if (!modulePerm || !modulePerm[action]) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: `${action} access to ${module}`,
      });
    }

    next();
  };
};

const requireAnyPermission = (module, actions) => {
  return async (req, res, next) => {
    if (req.user.role === 'superAdmin') return next();

    const permissions = await getCachedPermissions(req.user.role);
    const modulePerm = permissions.find(
      p => p.title.toLowerCase() === module.toLowerCase()
    );

    if (!modulePerm) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: `any of [${actions.join(', ')}] access to ${module}`,
      });
    }

    const hasAny = actions.some(action => modulePerm[action]);
    if (!hasAny) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: `any of [${actions.join(', ')}] access to ${module}`,
      });
    }

    next();
  };
};

module.exports = { requirePermission, requireAnyPermission, clearPermissionCache };
