import i18next from "i18next";

export const ROUTE_I18N_KEY_BY_NAME = {
  Dashboard: "navigation.dashboard",
  Properties: "navigation.properties",
  "Property Photos": "navigation.propertyPhotos",
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
};

const COMMON_I18N_KEY_BY_TEXT = {
  Save: "common.save",
  Cancel: "common.cancel",
  Delete: "common.delete",
  Edit: "common.edit",
  Update: "common.update",
  Add: "common.add",
  "Add New": "common.addNew",
  Close: "common.close",
  Loading: "common.loading",
  "Loading...": "common.loading",
  Search: "common.search",
  Filter: "common.filter",
  Reset: "common.reset",
  Submit: "common.submit",
  Back: "common.back",
  Next: "common.next",
  Previous: "common.previous",
  Actions: "common.actions",
  Action: "common.actions",
  Status: "common.status",
  Name: "common.name",
  Email: "common.email",
  Phone: "common.phone",
  Address: "common.address",
  Description: "common.description",
  Yes: "common.yes",
  No: "common.no",
  Import: "common.import",
  Export: "common.export",
  Download: "common.download",
  Upload: "common.upload",
  View: "common.view",
  "View Details": "common.viewDetails",
  Sort: "common.sort",
  Columns: "common.columns",
  "Select Columns": "common.selectColumns",
  Select: "common.select",
  "No Data Found": "common.noData",
  "No data found": "common.noData",
  "No Results": "common.noResults",
  "No results": "common.noResults",
  From: "common.from",
  To: "common.to",
  Language: "navigation.language",
  Theme: "navigation.theme",
  Help: "navigation.help",
  Documentation: "navigation.documentation",
  Notifications: "navigation.notifications",
  "Mark all read": "navigation.markAllRead",
  Logout: "navigation.logout",
  Profile: "navigation.profile",
  "Profile Settings": "navigation.profileSettings",
  "My Profile": "navigation.myProfile",
  Settings: "navigation.settings",
};

const FIELD_I18N_KEY_BY_TEXT = {
  "Email Id": "fields.email",
  "Email Address": "fields.emailAddress",
  "First Name": "fields.firstName",
  "Last Name": "fields.lastName",
  "Full Name": "fields.fullName",
  "Phone Number": "fields.phoneNumber",
  "Role Name": "fields.roleName",
  Role: "fields.role",
  Campaign: "fields.campaign",
  Company: "fields.company",
  Source: "fields.source",
  Price: "fields.price",
  "Assign To": "fields.assignTo",
  "Created Date": "modules.table.headers.createdDate",
  "Updated Date": "modules.table.headers.updatedDate",
};

const DIRECT_TRANSLATIONS = {
  "Manage Columns": {
    en: "Manage Columns",
    ru: "Настроить колонки",
  },
  "Advance Search": {
    en: "Advance Search",
    ru: "Расширенный поиск",
  },
  "Delete Record": {
    en: "Delete Record",
    ru: "Удалить запись",
  },
  "Delete selected record?": {
    en: "Delete selected record?",
    ru: "Удалить выбранную запись?",
  },
  "Delete selected records?": {
    en: "Delete selected records?",
    ru: "Удалить выбранные записи?",
  },
  "No new notifications": {
    en: "No new notifications",
    ru: "Новых уведомлений пока нет",
  },
  "System notifications will appear here when leads, tasks, or clients need attention.": {
    en: "System notifications will appear here when leads, tasks, or clients need attention.",
    ru: "Системные уведомления появятся здесь, когда внимание потребуют лиды, задачи или клиенты.",
  },
  "Welcome back": {
    en: "Welcome back",
    ru: "С возвращением",
  },
  "Logged out successfully": {
    en: "Logged out successfully",
    ru: "Вы вышли из системы",
  },
  "Token has expired": {
    en: "Token has expired",
    ru: "Срок действия сессии истек",
  },
  "CRM Workspace": {
    en: "CRM Workspace",
    ru: "Рабочее пространство CRM",
  },
  "Page": {
    en: "Page",
    ru: "Страница",
  },
  "Go to page": {
    en: "Go to page",
    ru: "Перейти к странице",
  },
  Show: {
    en: "Show",
    ru: "Показывать",
  },
  "First Page": {
    en: "First Page",
    ru: "Первая страница",
  },
  "Previous Page": {
    en: "Previous Page",
    ru: "Предыдущая страница",
  },
  "Next Page": {
    en: "Next Page",
    ru: "Следующая страница",
  },
  "Last Page": {
    en: "Last Page",
    ru: "Последняя страница",
  },
  "Since last month": {
    en: "Since last month",
    ru: "К прошлому месяцу",
  },
  "Price high": {
    en: "Price high",
    ru: "Сначала дорогие",
  },
  "Price low": {
    en: "Price low",
    ru: "Сначала дешевые",
  },
  Latest: {
    en: "Latest",
    ru: "Сначала новые",
  },
  Available: {
    en: "Available",
    ru: "Доступно",
  },
  House: {
    en: "House",
    ru: "Дом",
  },
  Apartment: {
    en: "Apartment",
    ru: "Квартира",
  },
  Land: {
    en: "Land",
    ru: "Участок",
  },
  Commercial: {
    en: "Commercial",
    ru: "Коммерческая",
  },
  Active: {
    en: "Active",
    ru: "Активно",
  },
  Pending: {
    en: "Pending",
    ru: "В ожидании",
  },
  Reserved: {
    en: "Reserved",
    ru: "Зарезервировано",
  },
  Sold: {
    en: "Sold",
    ru: "Продано",
  },
  "On Hold": {
    en: "On Hold",
    ru: "На удержании",
  },
  "Closed Accepted": {
    en: "Closed Accepted",
    ru: "Закрыто, принято",
  },
  "Closed Lost": {
    en: "Closed Lost",
    ru: "Закрыто, потеряно",
  },
  "Closed Dead": {
    en: "Closed Dead",
    ru: "Закрыто, архив",
  },
  "Not Invoiced": {
    en: "Not Invoiced",
    ru: "Не выставлен счет",
  },
  "Add Property": {
    en: "Add Property",
    ru: "Добавить объект",
  },
  "Edit Property": {
    en: "Edit Property",
    ru: "Редактировать объект",
  },
  Property: {
    en: "Property",
    ru: "Объект",
  },
  Properties: {
    en: "Properties",
    ru: "Объекты",
  },
  "Add Unit": {
    en: "Add Unit",
    ru: "Добавить юнит",
  },
  "Edit Unit": {
    en: "Edit Unit",
    ru: "Редактировать юнит",
  },
  Unit: {
    en: "Unit",
    ru: "Юнит",
  },
  Booked: {
    en: "Booked",
    ru: "Забронировано",
  },
  Blocked: {
    en: "Blocked",
    ru: "Заблокировано",
  },
  "Import Properties": {
    en: "Import Properties",
    ru: "Импорт объектов",
  },
  "Export as CSV": {
    en: "Export as CSV",
    ru: "Экспорт в CSV",
  },
  "Export as Excel": {
    en: "Export as Excel",
    ru: "Экспорт в Excel",
  },
  "Export Selected Data as CSV": {
    en: "Export Selected Data as CSV",
    ru: "Экспорт выбранных данных в CSV",
  },
  "Export Selected Data as Excel": {
    en: "Export Selected Data as Excel",
    ru: "Экспорт выбранных данных в Excel",
  },
  "Property file": {
    en: "Property file",
    ru: "Файл объектов",
  },
  "Failed to fetch data": {
    en: "Failed to fetch data",
    ru: "Не удалось загрузить данные",
  },
  Executive: {
    en: "Executive",
    ru: "Ответственный",
  },
  Sqm: {
    en: "Sqm",
    ru: "Площадь, м2",
  },
  "Property Photos": {
    en: "Property Photos",
    ru: "Фотографии объекта",
  },
  "Property Documents": {
    en: "Property Documents",
    ru: "Документы объекта",
  },
};

const normalizeText = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

export const isRussianLocale = (language = i18next.language) =>
  normalizeText(language).toLowerCase().startsWith("ru");

const translateByKey = (key, t, fallback) => {
  if (!key || typeof t !== "function") return fallback;
  const translated = t(key);
  return translated && translated !== key ? translated : fallback;
};

export const translateCrmText = (
  value,
  { t = i18next.t.bind(i18next), language = i18next.language } = {},
) => {
  if (typeof value !== "string") return value;

  const normalized = normalizeText(value);

  if (!normalized) {
    return value;
  }

  const key =
    ROUTE_I18N_KEY_BY_NAME[normalized] ||
    COMMON_I18N_KEY_BY_TEXT[normalized] ||
    FIELD_I18N_KEY_BY_TEXT[normalized];
  const translatedByKey = translateByKey(key, t, normalized);

  if (translatedByKey !== normalized) {
    return translatedByKey;
  }

  const directTranslation = DIRECT_TRANSLATIONS[normalized];

  if (directTranslation) {
    return directTranslation[isRussianLocale(language) ? "ru" : "en"];
  }

  return value;
};

export const translateRouteLabel = (
  routeOrName,
  { t = i18next.t.bind(i18next), language = i18next.language } = {},
) => {
  if (!routeOrName) {
    return getBrandLabel(language);
  }

  if (typeof routeOrName === "object" && routeOrName?.i18nKey) {
    return translateByKey(routeOrName.i18nKey, t, routeOrName?.name || "");
  }

  const rawValue =
    typeof routeOrName === "object" ? routeOrName?.name : routeOrName;

  return translateCrmText(rawValue, { t, language });
};

export const getBrandLabel = (language = i18next.language) =>
  isRussianLocale(language) ? "Премиум Эстейт" : "Premium Estate";

export const getBrandMark = (language = i18next.language) =>
  isRussianLocale(language) ? "ПЭ" : "PE";

export const buildSelectLabel = (label, options) => {
  const translatedLabel = translateCrmText(label, options);
  return isRussianLocale(options?.language)
    ? `Выбрать ${translatedLabel}`
    : `Select ${translatedLabel}`;
};

export const buildEnterLabel = (label, options) => {
  const translatedLabel = translateCrmText(label, options);
  return isRussianLocale(options?.language)
    ? `Введите ${translatedLabel}`
    : `Enter ${translatedLabel}`;
};

export const buildImportLabel = (label, options) => {
  const translatedLabel = translateCrmText(label, options);
  return isRussianLocale(options?.language)
    ? `Импорт ${translatedLabel}`
    : `Import ${translatedLabel}`;
};

export const buildDeleteTitle = (label, options) => {
  const translatedLabel = translateCrmText(label, options);
  return isRussianLocale(options?.language)
    ? `Удалить ${translatedLabel}`
    : `Delete ${translatedLabel}`;
};

export const buildDeleteQuestion = (label, options) => {
  const translatedLabel = translateCrmText(label, options);
  return isRussianLocale(options?.language)
    ? `Вы уверены, что хотите удалить ${translatedLabel.toLowerCase()}?`
    : `Are you sure you want to delete ${translatedLabel.toLowerCase()}?`;
};

export const buildDateRangeSummary = ({
  from,
  to,
  language = i18next.language,
}) => {
  if (isRussianLocale(language)) {
    return `От: ${from || "—"} До: ${to || "—"}`;
  }

  return `From: ${from || "—"} To: ${to || "—"}`;
};
