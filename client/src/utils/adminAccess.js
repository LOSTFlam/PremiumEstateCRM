import { getStoredUser } from "utils/authStorage";
import { resolveAuthUser } from "utils/authPaths";

export const STAFF_ROLES = new Set([
  "superAdmin",
  "admin",
  "manager",
  "teamleader",
  "executive",
  "telecaller",
]);

export const resolveCurrentUser = (reduxUser) => resolveAuthUser(reduxUser) || getStoredUser();

export const canManageListings = (user) => STAFF_ROLES.has(resolveCurrentUser(user)?.role);

export const canManageSiteContent = (user) => resolveCurrentUser(user)?.role === "superAdmin";

export const getPropertyAdminPath = (propertyId) =>
  propertyId ? `/propertyView/${propertyId}` : "/properties";
