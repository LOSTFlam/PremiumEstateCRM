/**
 * Secure File Upload Middleware
 * Provides file upload validation, MIME type checking, and security features
 * - File type whitelist (images, documents, videos)
 * - File size limits
 * - MIME type validation
 * - Filename sanitization
 * - Virus scanning hooks (placeholder for integration)
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// File type configurations
const FILE_CONFIG = {
  // Image files
  images: {
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'],
    maxSize: 10 * 1024 * 1024,  // 10MB
  },
  // Document files
  documents: {
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/rtf',
    ],
    allowedExtensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.rtf'],
    maxSize: 25 * 1024 * 1024,  // 25MB
  },
  // Video files
  videos: {
    allowedMimeTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
    allowedExtensions: ['.mp4', '.webm', '.ogg', '.mov'],
    maxSize: 100 * 1024 * 1024,  // 100MB
  },
  // Floor plans (images + PDFs)
  floorPlans: {
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'],
    maxSize: 15 * 1024 * 1024,  // 15MB
  },
};

/**
 * Sanitize filename to prevent path traversal and XSS
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
const sanitizeFilename = (filename) => {
  // Remove path components
  const baseName = path.basename(filename);
  
  // Remove special characters except hyphens, underscores, and dots
  const sanitized = baseName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .toLowerCase()
    .slice(0, 200);  // Limit length
  
  return sanitized;
};

/**
 * Generate unique filename with timestamp and random suffix
 * @param {string} originalName - Original file name
 * @returns {string} Unique filename
 */
const generateUniqueFilename = (originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  const nameWithoutExt = path.basename(originalName, ext);
  const sanitized = sanitizeFilename(nameWithoutExt);
  const timestamp = Date.now();
  const randomSuffix = crypto.randomBytes(4).toString('hex');
  
  return `${sanitized}-${timestamp}-${randomSuffix}${ext}`;
};

/**
 * Validate file type against whitelist
 * @param {string} mimeType - File MIME type
 * @param {string} extension - File extension
 * @param {object} config - File configuration
 * @returns {{ valid: boolean, error: string|null }}
 */
const validateFileType = (mimeType, extension, config) => {
  // Check MIME type
  if (!config.allowedMimeTypes.includes(mimeType)) {
    return {
      valid: false,
      error: `File type "${mimeType}" is not allowed. Allowed types: ${config.allowedMimeTypes.join(', ')}`,
    };
  }
  
  // Check extension
  if (!config.allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `File extension "${extension}" is not allowed. Allowed extensions: ${config.allowedExtensions.join(', ')}`,
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Create secure multer storage configuration
 * @param {string} uploadDir - Directory to store uploaded files
 * @param {string} fileType - File type category (images, documents, videos)
 * @returns {object} Multer configuration
 */
const createSecureStorage = (uploadDir, fileType = 'images') => {
  const config = FILE_CONFIG[fileType] || FILE_CONFIG.images;
  
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        // Create upload directory if it doesn't exist
        try {
          fs.mkdirSync(uploadDir, { recursive: true });
          cb(null, uploadDir);
        } catch (error) {
          cb(new Error(`Failed to create upload directory: ${error.message}`));
        }
      },
      filename: (req, file, cb) => {
        const uniqueFilename = generateUniqueFilename(file.originalname);
        cb(null, uniqueFilename);
      },
    }),
    limits: {
      fileSize: config.maxSize,
      files: 10,  // Maximum number of files per request
    },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const validation = validateFileType(file.mimetype, ext, config);
      
      if (!validation.valid) {
        return cb(new Error(validation.error));
      }
      
      // Additional check: verify MIME type matches file extension
      const extToMime = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.mp4': 'video/mp4',
      };
      
      const expectedMime = extToMime[ext];
      if (expectedMime && file.mimetype !== expectedMime) {
        // MIME type mismatch - possible file spoofing, reject the file
        return cb(new Error(`MIME type mismatch: expected ${expectedMime}, got ${file.mimetype}. File rejected.`));
      }
      
      cb(null, true);
    },
  });
};

/**
 * Middleware to validate uploaded files
 * @param {string} fileType - File type category
 * @returns {function} Express middleware
 */
const validateUpload = (fileType = 'images') => {
  const config = FILE_CONFIG[fileType] || FILE_CONFIG.images;
  
  return (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }
    
    // Validate each file
    const errors = [];
    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      const validation = validateFileType(file.mimetype, ext, config);
      
      if (!validation.valid) {
        errors.push({ filename: file.originalname, error: validation.error });
      }
      
      if (file.size > config.maxSize) {
        errors.push({
          filename: file.originalname,
          error: `File size ${Math.round(file.size / 1024 / 1024)}MB exceeds maximum ${Math.round(config.maxSize / 1024 / 1024)}MB`,
        });
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'File validation failed',
        errors,
      });
    }
    
    next();
  };
};

/**
 * Delete uploaded file
 * @param {string} filePath - Path to file to delete
 * @returns {Promise<boolean>} Success status
 */
const deleteUploadedFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error);
    return false;
  }
};

/**
 * Clean up old files from upload directory
 * @param {string} directory - Directory to clean
 * @param {number} maxAge - Maximum file age in milliseconds
 * @returns {Promise<number>} Number of files deleted
 */
const cleanupOldFiles = async (directory, maxAge = 30 * 24 * 60 * 60 * 1000) => {
  try {
    if (!fs.existsSync(directory)) return 0;
    
    const files = fs.readdirSync(directory);
    const now = Date.now();
    let deletedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    }
    
    return deletedCount;
  } catch (error) {
    console.error(`Failed to cleanup directory ${directory}:`, error);
    return 0;
  }
};

module.exports = {
  FILE_CONFIG,
  createSecureStorage,
  validateUpload,
  sanitizeFilename,
  generateUniqueFilename,
  deleteUploadedFile,
  cleanupOldFiles,
};
