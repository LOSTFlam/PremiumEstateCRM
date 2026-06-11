const { requirePermission } = require("./rbac");

const canView = (module) => requirePermission(module, "view");
const canCreate = (module) => requirePermission(module, "create");
const canUpdate = (module) => requirePermission(module, "update");
const canDelete = (module) => requirePermission(module, "delete");

module.exports = { canView, canCreate, canUpdate, canDelete };
