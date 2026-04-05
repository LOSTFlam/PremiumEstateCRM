/**
 * Security Audit Logging Middleware
 * Tracks important security events for compliance and monitoring
 * - Login attempts (success/failure)
 * - Password changes
 * - Permission changes
 * - Data deletion events
 * - File upload/deletion events
 * 
 * Uses async I/O and a write queue to avoid blocking the event loop
 * 
 * Production Support:
 * - In development: writes to local file (logs/audit.log)
 * - In production: supports centralized logging via stdout/stderr
 *   for integration with ELK, CloudWatch, Datadog, etc.
 *   Set AUDIT_LOG_TARGET=stdout to enable JSON output to console
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

// Log file configuration
const LOG_DIR = path.join(__dirname, '../../logs');
const AUDIT_LOG_FILE = path.join(LOG_DIR, 'audit.log');

// Production logging configuration
const isProduction = process.env.NODE_ENV === 'production';
const auditLogTarget = process.env.AUDIT_LOG_TARGET || (isProduction ? 'stdout' : 'file');

// Write queue for batching audit log writes (only used for file-based logging)
const writeQueue = [];
let isWriting = false;
const BATCH_INTERVAL = 100; // Batch writes every 100ms
const MAX_BATCH_SIZE = 50; // Maximum entries per batch
const MAX_QUEUE_SIZE = 10000; // Maximum pending entries to prevent memory exhaustion

// Ensure logs directory exists
const ensureLogDir = async () => {
  try {
    await fs.access(LOG_DIR);
  } catch {
    await fs.mkdir(LOG_DIR, { recursive: true });
  }
};

// Initialize log directory
ensureLogDir().catch(console.error);

/**
 * Process the write queue in batches
 */
const processWriteQueue = async () => {
  if (isWriting || writeQueue.length === 0) return;
  
  isWriting = true;
  const batch = writeQueue.splice(0, MAX_BATCH_SIZE);
  
  try {
    const content = batch.join('');
    await fs.appendFile(AUDIT_LOG_FILE, content);
  } catch (error) {
    console.error('Failed to write audit log batch:', error);
    // Put failed entries back in queue
    writeQueue.unshift(...batch);
  } finally {
    isWriting = false;
  }
};

// Process queue periodically
setInterval(processWriteQueue, BATCH_INTERVAL);

// Log entry levels
const LOG_LEVELS = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL',
};

// Event types
const EVENT_TYPES = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET: 'PASSWORD_RESET',
  ROLE_CHANGE: 'ROLE_CHANGE',
  USER_CREATE: 'USER_CREATE',
  USER_DELETE: 'USER_DELETE',
  DATA_DELETE: 'DATA_DELETE',
  FILE_UPLOAD: 'FILE_UPLOAD',
  FILE_DELETE: 'FILE_DELETE',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  TOKEN_REFRESH: 'TOKEN_REFRESH',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
};

/**
 * Format log entry for file-based logging
 */
const formatLogEntry = (event, level, details) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] [${event}] ${JSON.stringify(details)}\n`;
};

/**
 * Format log entry for stdout/JSON logging (production)
 */
const formatJsonLogEntry = (event, level, details) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    service: 'premium-estate-crm',
    ...details,
  }) + '\n';
};

/**
 * Write to audit log (async, queued for performance)
 * In production with stdout target, writes directly to console as JSON
 */
const writeAuditLog = (event, level, details) => {
  try {
    // Production: write to stdout as JSON for centralized logging
    if (isProduction && auditLogTarget === 'stdout') {
      process.stdout.write(formatJsonLogEntry(event, level, details));
      return;
    }
    
    // Development or file-based: use queue for batching
    // Check queue size limit to prevent memory exhaustion
    if (writeQueue.length >= MAX_QUEUE_SIZE) {
      console.error('Audit log queue full, dropping oldest entries');
      // Remove oldest entries to make room
      writeQueue.splice(0, writeQueue.length - MAX_QUEUE_SIZE + 1);
    }
    
    const entry = formatLogEntry(event, level, details);
    writeQueue.push(entry);
    
    // If queue is getting large, trigger immediate processing
    if (writeQueue.length >= MAX_BATCH_SIZE) {
      processWriteQueue().catch(console.error);
    }
  } catch (error) {
    console.error('Failed to queue audit log entry:', error);
  }
};

/**
 * Flush all pending audit log entries (call before server shutdown)
 */
const flushAuditLog = async () => {
  while (writeQueue.length > 0 || isWriting) {
    await processWriteQueue();
    await new Promise(resolve => setTimeout(resolve, 50));
  }
};

/**
 * Audit logging middleware
 * Logs security-relevant events
 */
const auditLog = (req, res, next) => {
  // Log after response is finished using 'finish' event
  // This is safer than overriding res.end() as it doesn't interfere
  // with streaming responses or chunked transfer encoding
  // Credentials are captured here (after body-parser has processed the request)
  res.on('finish', () => {
    // Capture credentials from request body (body-parser has already run)
    let credentials = null;
    if (req.body && typeof req.body === 'object') {
      credentials = req.body.username || req.body.email;
    }
    
    // Determine if this request should be logged
    const logEntry = getLogEntry(req, res, credentials);
    if (logEntry) {
      writeAuditLog(logEntry.event, logEntry.level, logEntry.details);
    }
  });
  
  next();
};

/**
 * Determine if request should be logged
 */
const getLogEntry = (req, res, credentials) => {
  const { method, originalUrl, user } = req;
  const statusCode = res.statusCode;
  
  // Parse URL path for reliable route matching
  let urlPath = '';
  try {
    const baseUrl = `http://${req.headers.host || 'localhost'}`;
    urlPath = new URL(originalUrl || '', baseUrl).pathname;
  } catch {
    // Reject invalid URLs instead of falling back to untrusted input
    console.warn('Invalid URL in audit log, skipping:', originalUrl);
    return null;
  }
  
  // Login attempts
  if (urlPath === '/api/user/login') {
    if (statusCode === 200) {
      return {
        event: EVENT_TYPES.LOGIN_SUCCESS,
        level: LOG_LEVELS.INFO,
        details: {
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          username: credentials,
        },
      };
    } else if (statusCode === 401 || statusCode === 423) {
      return {
        event: EVENT_TYPES.LOGIN_FAILURE,
        level: LOG_LEVELS.WARNING,
        details: {
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          username: credentials,
          statusCode,
          reason: statusCode === 423 ? 'Account locked' : 'Invalid credentials',
        },
      };
    }
  }
  
  // Logout
  if (urlPath === '/api/user/logout' && method === 'POST') {
    return {
      event: EVENT_TYPES.LOGOUT,
      level: LOG_LEVELS.INFO,
      details: {
        userId: user?.userId,
        ip: req.ip,
      },
    };
  }
  
  // Password change
  if (urlPath === '/api/user/change-password' && method === 'POST') {
    return {
      event: EVENT_TYPES.PASSWORD_CHANGE,
      level: statusCode === 200 ? LOG_LEVELS.INFO : LOG_LEVELS.WARNING,
      details: {
        userId: user?.userId,
        ip: req.ip,
        success: statusCode === 200,
        statusCode,
      },
    };
  }
  
  // Token refresh
  if (urlPath === '/api/user/refresh-token' && method === 'POST') {
    return {
      event: EVENT_TYPES.TOKEN_REFRESH,
      level: statusCode === 200 ? LOG_LEVELS.INFO : LOG_LEVELS.WARNING,
      details: {
        userId: user?.userId,
        ip: req.ip,
        success: statusCode === 200,
      },
    };
  }
  
  // User deletion
  if (urlPath === '/api/user/delete' && method === 'DELETE') {
    return {
      event: EVENT_TYPES.USER_DELETE,
      level: LOG_LEVELS.WARNING,
      details: {
        userId: user?.userId,
        targetUserId: req.params?.id,
        ip: req.ip,
        success: statusCode === 200,
      },
    };
  }
  
  // Role changes
  if (urlPath === '/api/user/change-roles' && method === 'PUT') {
    return {
      event: EVENT_TYPES.ROLE_CHANGE,
      level: LOG_LEVELS.WARNING,
      details: {
        userId: user?.userId,
        targetUserId: req.params?.id,
        newRoles: req.body,
        ip: req.ip,
        success: statusCode === 200,
      },
    };
  }
  
  // Property deletion
  if (urlPath === '/api/property/delete' && method === 'DELETE') {
    return {
      event: EVENT_TYPES.DATA_DELETE,
      level: LOG_LEVELS.INFO,
      details: {
        userId: user?.userId,
        entityType: 'Property',
        entityId: req.params?.id,
        ip: req.ip,
        success: statusCode === 200,
      },
    };
  }
  
  // Permission denied
  if (statusCode === 403) {
    return {
      event: EVENT_TYPES.PERMISSION_DENIED,
      level: LOG_LEVELS.WARNING,
      details: {
        userId: user?.userId,
        method,
        url: originalUrl,
        ip: req.ip,
      },
    };
  }
  
  // Account locked
  if (statusCode === 423) {
    return {
      event: EVENT_TYPES.ACCOUNT_LOCKED,
      level: LOG_LEVELS.CRITICAL,
      details: {
        ip: req.ip,
        url: originalUrl,
      },
    };
  }
  
  // No logging needed for this request
  return null;
};

/**
 * Manual audit log function for use in controllers
 */
const logEvent = (event, level, details) => {
  writeAuditLog(event, level, details);
};

module.exports = {
  auditLog,
  logEvent,
  flushAuditLog,
  EVENT_TYPES,
  LOG_LEVELS,
};
