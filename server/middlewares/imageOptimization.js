const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const crypto = require('crypto');

/**
 * Enhanced Image Optimization Middleware
 * Automatically compresses, resizes, and generates thumbnails
 */

const FILE_CONFIG = {
  images: {
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    maxSize: 15 * 1024 * 1024, // 15MB
    compression: {
      quality: 85,
      maxWidth: 2560,
      maxHeight: 1920,
    },
    thumbnail: {
      width: 300,
      height: 200,
      quality: 75,
    },
  },
  documents: {
    allowedMimeTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    maxSize: 25 * 1024 * 1024,
  },
  videos: {
    allowedMimeTypes: ['video/mp4', 'video/webm'],
    allowedExtensions: ['.mp4', '.webm'],
    maxSize: 500 * 1024 * 1024, // 500MB
  },
};

const sanitizeFilename = (filename) => {
  const baseName = path.basename(filename);
  return baseName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
};

const createUploadStorage = (uploadPath, type = 'images') => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const fullPath = path.join(uploadPath, type);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const uniquePrefix = crypto.randomBytes(6).toString('hex');
      const sanitized = sanitizeFilename(file.originalname);
      const ext = path.extname(sanitized);
      const name = path.basename(sanitized, ext);
      cb(null, `${name}-${uniquePrefix}${ext}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: FILE_CONFIG[type]?.maxSize || 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const config = FILE_CONFIG[type];

      if (!config?.allowedExtensions.includes(ext)) {
        return cb(new Error(`Invalid file type. Allowed: ${config.allowedExtensions.join(', ')}`));
      }

      if (!config?.allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error(`Invalid MIME type: ${file.mimetype}`));
      }

      cb(null, true);
    },
  });
};

/**
 * Optimize image on upload
 */
const optimizeImage = async (filePath, type = 'images') => {
  try {
    const config = FILE_CONFIG[type];
    if (!config?.compression) return filePath;

    const ext = path.extname(filePath).toLowerCase();
    const dirName = path.dirname(filePath);
    const baseName = path.basename(filePath, ext);

    // Create optimized version
    const optimizedPath = path.join(dirName, `${baseName}-opt${ext}`);
    
    let sharpPipeline = sharp(filePath);

    // Resize if needed
    if (config.compression.maxWidth || config.compression.maxHeight) {
      sharpPipeline = sharpPipeline.resize(
        config.compression.maxWidth,
        config.compression.maxHeight,
        { fit: 'inside', withoutEnlargement: true }
      );
    }

    // Compress based on format
    if (ext === '.png') {
      await sharpPipeline.png({ quality: config.compression.quality }).toFile(optimizedPath);
    } else if (ext === '.webp') {
      await sharpPipeline.webp({ quality: config.compression.quality }).toFile(optimizedPath);
    } else {
      await sharpPipeline.jpeg({ quality: config.compression.quality }).toFile(optimizedPath);
    }

    // Replace original with optimized
    fs.unlinkSync(filePath);
    fs.renameSync(optimizedPath, filePath);

    return filePath;
  } catch (error) {
    console.error('Image optimization error:', error);
    return filePath; // Return original if optimization fails
  }
};

/**
 * Generate thumbnail
 */
const generateThumbnail = async (filePath, type = 'images') => {
  try {
    const config = FILE_CONFIG[type];
    if (!config?.thumbnail) return null;

    const ext = path.extname(filePath).toLowerCase();
    const dirName = path.dirname(filePath);
    const baseName = path.basename(filePath, ext);
    const thumbPath = path.join(dirName, `${baseName}-thumb${ext}`);

    await sharp(filePath)
      .resize(config.thumbnail.width, config.thumbnail.height, {
        fit: 'cover',
        position: 'center',
      })
      .toFormat('jpeg')
      .jpeg({ quality: config.thumbnail.quality })
      .toFile(thumbPath);

    return thumbPath;
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return null;
  }
};

/**
 * Process uploaded image
 */
const processUploadedImage = async (filePath, type = 'images') => {
  try {
    // Optimize original
    await optimizeImage(filePath, type);

    // Generate thumbnail
    const thumbPath = await generateThumbnail(filePath, type);

    return {
      success: true,
      original: filePath,
      thumbnail: thumbPath,
      size: fs.statSync(filePath).size,
    };
  } catch (error) {
    console.error('Image processing error:', error);
    throw error;
  }
};

module.exports = {
  createUploadStorage,
  optimizeImage,
  generateThumbnail,
  processUploadedImage,
  FILE_CONFIG,
};
