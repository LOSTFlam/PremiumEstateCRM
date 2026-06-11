/**
 * Build a MongoDB filter from req.query using an allowlist.
 * Strips operator keys ($gt, $ne, etc.) to reduce NoSQL injection risk.
 */
const OPERATOR_KEY = /^\$/;
const SAFE_FIELD_KEY = /^[a-zA-Z][a-zA-Z0-9_]*$/;

const pickAllowedQuery = (query = {}, allowedFields = []) => {
  const safe = {};
  const allow = new Set(allowedFields);

  for (const [key, value] of Object.entries(query)) {
    if (!allow.has(key) || OPERATOR_KEY.test(key)) continue;
    if (value === undefined || value === null || value === "") continue;
    safe[key] = value;
  }

  return safe;
};

const pickAllowedBody = (body = {}, allowedFields = []) => {
  const safe = {};
  const allow = new Set(allowedFields);

  for (const [key, value] of Object.entries(body)) {
    if (!allow.has(key) || OPERATOR_KEY.test(key)) continue;
    if (value === undefined) continue;
    safe[key] = value;
  }

  return safe;
};

/** Strip Mongo operators and dotted paths from query objects. */
const stripUnsafeQueryKeys = (query = {}) => {
  const safe = {};

  for (const [key, value] of Object.entries(query)) {
    if (OPERATOR_KEY.test(key) || key.includes(".")) continue;
    if (!SAFE_FIELD_KEY.test(key)) continue;
    if (value === undefined || value === null) continue;
    safe[key] = value;
  }

  return safe;
};

const QUERY_ALLOWLISTS = {
  user: ["role", "firstName", "lastName", "username", "email", "phoneNumber", "createBy", "_id"],
  contact: ["createBy", "leadStatus", "leadSource", "email", "phoneNumber", "firstName", "lastName", "_id"],
  lead: ["leadStatus", "leadSource", "createBy", "propertyId", "email", "phoneNumber", "_id"],
  property: ["createBy", "propertyType", "listingStatus", "moderationStatus", "city", "state", "_id", "slug"],
  task: ["createBy", "taskStatus", "assignTo", "lead", "contact", "_id"],
  meeting: ["createBy", "lead", "contact", "assignTo", "_id"],
  account: ["createBy", "accountName", "accountStatus", "_id"],
  opportunities: ["createBy", "opportunityStatus", "_id"],
  quotes: ["createBy", "quoteStatus", "contact", "account", "_id"],
  invoices: ["createBy", "invoiceStatus", "contact", "account", "_id"],
  document: ["createBy", "folderName", "_id"],
  images: ["isActive", "type", "_id"],
  phoneCall: ["createBy", "lead", "contact", "_id"],
  email: ["createBy", "lead", "contact", "_id"],
  emailTemplate: ["createBy", "templateName", "_id"],
  bankDetails: ["createBy", "_id"],
  roleAccess: ["roleName", "_id"],
  validation: ["name", "moduleName", "_id"],
  customField: ["moduleName", "name", "_id"],
  reporting: ["createBy", "role", "_id"],
  calendar: ["createBy", "assignTo", "_id"],
  textMsg: ["createBy", "lead", "contact", "_id"],
  opportunityproject: ["createBy", "_id"],
  moduleActiveDeactive: ["moduleName", "_id"],
  storefrontSettings: ["key", "_id"],
  pipeline: ["createBy", "_id"],
  status: ["createBy", "_id"],
  form: ["moduleName", "_id"],
  route: ["moduleName", "_id"],
  payment: ["_id"],
  metrics: ["range", "module"],
  media: ["type", "_id"],
  notifications: ["userId", "read", "_id"],
  ai: ["type", "_id"],
  quote: ["createBy", "_id"],
};

const getModuleFromPath = (url = "") => {
  const match = String(url).match(/\/api\/([^/?]+)/);
  return match ? match[1].replace(/-/g, "") : null;
};

const normalizeModuleKey = (moduleKey = "") => {
  const aliases = {
    emailhistory: "email",
    emailtemplate: "emailTemplate",
    phonecall: "phoneCall",
    bankdetails: "bankDetails",
    roleaccess: "roleAccess",
    customfield: "customField",
    moduleactivedeactive: "moduleActiveDeactive",
    storefrontsettings: "storefrontSettings",
    opportunityproject: "opportunityproject",
  };
  const key = String(moduleKey || "").toLowerCase();
  return aliases[key] || moduleKey;
};

const sanitizeRequestQuery = (query = {}, url = "") => {
  const stripped = stripUnsafeQueryKeys(query);
  const moduleKey = normalizeModuleKey(getModuleFromPath(url));
  const allowlist = QUERY_ALLOWLISTS[moduleKey];

  if (!allowlist) {
    return stripped;
  }

  return pickAllowedQuery(stripped, allowlist);
};

module.exports = {
  pickAllowedQuery,
  pickAllowedBody,
  stripUnsafeQueryKeys,
  sanitizeRequestQuery,
  QUERY_ALLOWLISTS,
  getModuleFromPath,
};
