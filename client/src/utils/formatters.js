export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (typeof amount !== 'number') return amount;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (value, locale = 'en-US', options = {}) => {
  if (typeof value !== 'number') return value;
  return new Intl.NumberFormat(locale, options).format(value);
};

export const formatDate = (date, format = 'relative', locale = 'en-US') => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return date;

  if (format === 'relative') {
    const now = new Date();
    const diff = now - d;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  const formatMap = {
    'DD/MM/YYYY': { day: '2-digit', month: '2-digit', year: 'numeric' },
    'MM/DD/YYYY': { month: '2-digit', day: '2-digit', year: 'numeric' },
    'YYYY-MM-DD': { year: 'numeric', month: '2-digit', day: '2-digit' },
    'DD.MM.YYYY': { day: '2-digit', month: '2-digit', year: 'numeric' },
  };

  return d.toLocaleDateString(locale, formatMap[format] || formatMap['DD/MM/YYYY']);
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11) {
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
};

export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + suffix;
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export const generateId = (prefix = '') => {
  const id = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${id}` : id;
};

export const debounce = (fn, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = (fn, limit = 300) => {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key] || 'unknown';
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === bVal) return 0;

    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });
};

export const uniqueBy = (array, key) => {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

export const getStatusColor = (status) => {
  const statusMap = {
    available: 'green',
    sold: 'red',
    rented: 'blue',
    reserved: 'yellow',
    new: 'cyan',
    contacted: 'yellow',
    qualified: 'blue',
    proposal: 'purple',
    negotiation: 'orange',
    won: 'green',
    lost: 'gray',
    pending: 'yellow',
    in_progress: 'blue',
    completed: 'green',
    cancelled: 'red',
    low: 'gray',
    medium: 'yellow',
    high: 'orange',
    urgent: 'red',
  };
  return statusMap[status?.toLowerCase()] || 'gray';
};

export const getStatusLabel = (status) => {
  const labelMap = {
    available: 'Available',
    sold: 'Sold',
    rented: 'Rented',
    reserved: 'Reserved',
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    won: 'Won',
    lost: 'Lost',
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  };
  return labelMap[status] || status;
};

export default {
  formatCurrency,
  formatNumber,
  formatDate,
  formatPhone,
  truncateText,
  capitalizeFirst,
  slugify,
  generateId,
  debounce,
  throttle,
  groupBy,
  sortBy,
  uniqueBy,
  getStatusColor,
  getStatusLabel,
};
