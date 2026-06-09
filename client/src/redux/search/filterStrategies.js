import moment from "moment";

const isEmpty = (value) => [null, undefined, ""].includes(value);

const includesText = (source, target) => {
  if (isEmpty(target)) return true;
  if (isEmpty(source)) return false;

  return String(source).toLowerCase().includes(String(target).toLowerCase());
};

const includesNumberText = (source, target) => {
  if (isEmpty(target)) return true;
  if (isEmpty(source) && source !== 0) return false;

  return String(source).toLowerCase().includes(String(target).toLowerCase());
};

const inRange = (value, from, to) => {
  if (isEmpty(from) || isEmpty(to)) return true;
  if (isEmpty(value) && value !== 0) return false;

  const normalized = parseInt(value, 10);
  return normalized >= parseInt(from, 10) && normalized <= parseInt(to, 10);
};

const formatDate = (value) => moment(new Date(value)).format("YYYY-MM-DD");

export const filterStrategies = {
  Tasks: (item, values = {}) =>
    includesText(item?.title, values?.title) &&
    includesText(item?.status, values?.status) &&
    includesText(item?.category, values?.category) &&
    includesText(item?.start, values?.start) &&
    includesNumberText(item?.end, values?.end) &&
    includesText(item?.assignToName, values?.assignToName) &&
    inRange(item?.leadScore, values?.fromLeadScore, values?.toLeadScore),

  Meeting: (item, values = {}) => {
    const meetingDate = formatDate(item?.dateTime);
    const timestampDate = formatDate(item?.timestamp);

    return (
      includesText(item?.agenda, values?.agenda) &&
      includesText(item?.createBy, values?.createBy) &&
      (isEmpty(values?.startDate) || meetingDate >= values?.startDate) &&
      (isEmpty(values?.endDate) || meetingDate <= values?.endDate) &&
      (isEmpty(values?.timeStartDate) || timestampDate >= values?.timeStartDate) &&
      (isEmpty(values?.timeEndDate) || timestampDate <= values?.timeEndDate)
    );
  },

  Calls: (item, values = {}) =>
    includesText(item?.senderName, values?.senderName) &&
    (isEmpty(values?.realetedTo) ||
      (values?.realetedTo === "contact" ? item?.createBy : item?.createByLead)) &&
    includesText(item?.createByName, values?.createByName),

  Leads: (item, values = {}) => includesText(item?.leadStatus, values?.leadStatus),

  Email: (item, values = {}) =>
    includesText(item?.senderName, values?.senderName) &&
    (isEmpty(values?.realetedTo) ||
      (values?.realetedTo === "contact" ? item?.createBy : item?.createByLead)) &&
    includesText(item?.createByName, values?.createByName),

  Users: (item, values = {}) =>
    includesText(item?.firstName, values?.firstName) &&
    includesText(item?.username, values?.username) &&
    includesText(item?.lastName, values?.lastName),

  Opprtunity: (item, values = {}) =>
    includesText(item?.opportunityName, values?.opportunityName) &&
    includesText(item?.accountName2, values?.accountName2) &&
    includesText(item?.opportunityAmount, values?.opportunityAmount) &&
    includesText(item?.expectedCloseDate, values?.expectedCloseDate) &&
    includesText(item?.salesStage, values?.salesStage),

  Account: (item, values = {}) =>
    includesText(item?.name, values?.name) &&
    includesNumberText(item?.officePhone, values?.officePhone) &&
    includesNumberText(item?.fax, values?.fax) &&
    includesText(item?.emailAddress, values?.emailAddress),

  quotes: (item, values = {}) =>
    includesNumberText(item?.quoteNumber, values?.quoteNumber) &&
    includesNumberText(item?.title, values?.title) &&
    includesNumberText(item?.quoteStage, values?.quoteStage) &&
    includesText(item?.contactName, values?.contactName) &&
    includesText(item?.accountName, values?.accountName) &&
    includesNumberText(item?.grandTotal, values?.grandTotal) &&
    includesText(item?.validUntil, values?.validUntil),

  invoice: (item, values = {}) =>
    includesNumberText(item?.invoiceNumber, values?.invoiceNumber) &&
    includesNumberText(item?.title, values?.title) &&
    includesNumberText(item?.status, values?.status) &&
    includesText(item?.contactName, values?.contactName) &&
    includesText(item?.accountName, values?.accountName) &&
    includesNumberText(item?.grandTotal, values?.grandTotal),
};

export const directSearchStrategies = {
  TasksSearch: (payload) => payload.searchData,
  MeetingSearch: (payload) => payload.searchData,
  CallsSearch: (payload) => payload.searchData,
  EmailSearch: (payload) => payload.searchData,
  UsersSearch: (payload) => payload.searchData,
  OpprtunitySearch: (payload) => payload.searchData,
  AccountSearch: (payload) => payload.searchData,
  QuotesSearch: (payload) => payload.searchData,
  InvoiceSearch: (payload) => payload.searchData,
  template: (payload) => payload.searchData,
};

export const buildSearchResult = (payload = {}) => {
  const strategy = filterStrategies[payload.type];
  if (strategy) {
    return (payload.allData || []).filter((item) => strategy(item, payload.values || {}));
  }

  const directStrategy = directSearchStrategies[payload.type];
  if (directStrategy) {
    return directStrategy(payload);
  }

  return [];
};
