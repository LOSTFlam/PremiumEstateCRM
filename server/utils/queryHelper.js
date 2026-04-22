/**
 * Database Query Optimization Helper
 * Provides standardized query patterns with pagination, sorting, and filtering
 * - Consistent pagination response format
 * - Query performance monitoring
 * - Index usage hints
 * - Soft-delete handling
 */

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

/**
 * Parse pagination parameters from request query
 * @param {object} query - Express request query object
 * @returns {{ page: number, limit: number, skip: number }}
 */
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(query.limit, 10) || DEFAULT_PAGE_SIZE));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Parse sorting parameters from request query
 * Supports: sort=field:direction,field2:direction2
 * @param {object} query - Express request query object
 * @param {object} defaultSort - Default sort configuration
 * @returns {object} MongoDB sort object
 */
const parseSorting = (query, defaultSort = { createdDate: -1 }) => {
  if (!query.sort) return defaultSort;

  const sortObj = {};
  const sortParts = query.sort.split(',');

  for (const part of sortParts) {
    const [field, direction] = part.split(':');
    if (field) {
      // Validate field name to prevent injection
      const sanitizedField = field.replace(/[^a-zA-Z0-9_.]/g, '');
      sortObj[sanitizedField] = direction?.toLowerCase() === 'asc' ? 1 : -1;
    }
  }

  return Object.keys(sortObj).length > 0 ? sortObj : defaultSort;
};

/**
 * Build filter query with soft-delete handling
 * @param {object} filters - User-provided filters
 * @param {object} options - Filter options
 * @returns {object} MongoDB query object
 */
const buildFilterQuery = (filters = {}, options = {}) => {
  const { includeDeleted = false, dateField = 'createdDate' } = options;
  const query = {};

  // Always filter soft-deleted records unless explicitly included
  if (!includeDeleted) {
    query.deleted = { $ne: true };
  }

  // Date range filtering
  if (filters.dateFrom) {
    query[dateField] = query[dateField] || {};
    query[dateField].$gte = new Date(filters.dateFrom);
  }

  if (filters.dateTo) {
    query[dateField] = query[dateField] || {};
    query[dateField].$lte = new Date(filters.dateTo);
  }

  // Text search
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  // Status filtering
  if (filters.status) {
    query.status = filters.status;
  }

  // Custom field filters
  if (filters.fields) {
    try {
      const customFilters = JSON.parse(filters.fields);
      Object.assign(query, customFilters);
    } catch (error) {
      // Console statement removed
    }
  }

  return query;
};

/**
 * Execute paginated query with metadata
 * @param {mongoose.Model} model - Mongoose model
 * @param {object} query - MongoDB query object
 * @param {object} options - Query options
 * @returns {Promise<{ data: Array, pagination: object, meta: object }>}
 */
const executePaginatedQuery = async (model, query, options = {}) => {
  const {
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
    skip = 0,
    sort = { createdDate: -1 },
    populate = [],
    select = '',
    includeDeleted = false,
  } = options;

  const startTime = Date.now();

  // Build query
  const mongooseQuery = model.find(query);

  // Apply pagination
  if (skip) mongooseQuery.skip(skip);
  if (limit) mongooseQuery.limit(limit);

  // Apply sorting
  mongooseQuery.sort(sort);

  // Apply field selection
  if (select) mongooseQuery.select(select);

  // Apply population
  if (populate.length > 0) {
    for (const pop of populate) {
      mongooseQuery.populate(pop);
    }
  }

  // Execute query and count in parallel
  const [data, total] = await Promise.all([
    mongooseQuery.exec(),
    model.countDocuments(query),
  ]);

  const executionTime = Date.now() - startTime;

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
    },
    meta: {
      executionTime: `${executionTime}ms`,
      query,
      sort,
    },
  };
};

/**
 * Create standardized API response
 * @param {object} result - Query result
 * @param {object} options - Response options
 * @returns {object} Standardized response
 */
const createResponse = (result, options = {}) => {
  const {
    message = 'Success',
    includeMeta = true,
  } = options;

  const response = {
    success: true,
    message,
  };

  if (result?.pagination) {
    response.data = result.data;
    response.pagination = result.pagination;
    if (includeMeta) {
      response.meta = result.meta;
    }
  } else {
    response.data = result;
  }

  return response;
};

/**
 * Query performance monitor
 * Logs slow queries and provides insights
 */
const queryMonitor = {
  slowQueryThreshold: 300,  // ms
  logs: [],

  record: (query, executionTime, resultCount) => {
    const entry = {
      timestamp: new Date(),
      query: JSON.stringify(query).slice(0, 200),  // Truncate for storage
      executionTime,
      resultCount,
      isSlow: executionTime > queryMonitor.slowQueryThreshold,
    };

    queryMonitor.logs.push(entry);

    // Keep only last 1000 logs
    if (queryMonitor.logs.length > 1000) {
      queryMonitor.logs = queryMonitor.logs.slice(-1000);
    }

    if (entry.isSlow) {
      // Console statement removed
    }

    return entry;
  },

  getStats: () => {
    const logs = queryMonitor.logs;
    if (logs.length === 0) return { count: 0 };

    const total = logs.reduce((sum, log) => sum + log.executionTime, 0);
    const slow = logs.filter((log) => log.isSlow).length;

    return {
      count: logs.length,
      avgExecutionTime: Math.round(total / logs.length),
      slowQueries: slow,
      slowQueryPercentage: Math.round((slow / logs.length) * 100),
      totalResults: logs.reduce((sum, log) => sum + log.resultCount, 0),
    };
  },
};

/**
 * Build aggregation pipeline with pagination
 * @param {mongoose.Model} model - Mongoose model
 * @param {Array} pipeline - MongoDB aggregation pipeline
 * @param {object} options - Pagination options
 * @returns {Promise<{ data: Array, pagination: object }>}
 */
const executeAggregation = async (model, pipeline, options = {}) => {
  const { page = 1, limit = DEFAULT_PAGE_SIZE } = options;
  const skip = (page - 1) * limit;

  // Add count stage for total
  const countPipeline = [...pipeline, { $count: 'total' }];

  // Add pagination stages
  const dataPipeline = [
    ...pipeline,
    { $skip: skip },
    { $limit: limit },
  ];

  // Execute in parallel
  const [countResult, data] = await Promise.all([
    model.aggregate(countPipeline),
    model.aggregate(dataPipeline),
  ]);

  const total = countResult[0]?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    },
  };
};

module.exports = {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  parsePagination,
  parseSorting,
  buildFilterQuery,
  executePaginatedQuery,
  createResponse,
  queryMonitor,
  executeAggregation,
};
