export const routeNameToI18nKey = {
  Dashboard: "navigation.dashboard",
  "My Listings": "navigation.myListings",
  Properties: "navigation.properties",
  Leads: "navigation.leads",
  Contacts: "navigation.contacts",
  Invoices: "navigation.invoices",
  Quotes: "navigation.quotes",
  "Offer Letter": "navigation.offerLetters",
  Opportunities: "navigation.opportunities",
  Account: "navigation.account",
  Tasks: "navigation.tasks",
  Meetings: "navigation.meetings",
  Calls: "navigation.phoneCall",
  Emails: "navigation.emails",
  "Email Template": "navigation.emailTemplate",
  Calender: "navigation.calendar",
  Payments: "navigation.payments",
  Documents: "navigation.documents",
  "Reporting and Analytics": "navigation.reports",
  Reports: "navigation.reports",
  "Admin Setting": "navigation.adminSettings",
  "Storefront Filters": "navigation.storefrontFilters",
  Users: "navigation.users",
  Roles: "navigation.roles",
  "Custom Fields": "navigation.customFields",
  "Table Fields": "navigation.tableFields",
  "Active Deactive Module": "navigation.activeModules",
  Module: "navigation.modules",
  Validation: "navigation.validations",
  "Change Images": "navigation.changeImages",
  "Bank Details": "navigation.bankDetails",
  Moderation: "navigation.moderation",
};

export const translateRouteName = (name, t) => {
  const key = routeNameToI18nKey[name];
  return key ? t(key) : name;
};
