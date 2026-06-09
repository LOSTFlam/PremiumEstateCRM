/**
 * Media Management Service
 * Handles file lifecycle management including:
 * - File cleanup when records are deleted
 * - Orphaned file detection and cleanup
 * - Image optimization and compression
 * - File metadata tracking
 */

const fs = require('fs').promises;
const path = require('path');
let sharp;
try {
  sharp = require('sharp');  // Image processing library
} catch {
  sharp = null;
}
const Property = require('../model/schema/property');

// Base upload directories
const UPLOAD_DIRS = {
  property: {
    photos: 'uploads/Property/PropertyPhotos',
    virtualTours: 'uploads/Property/virtual-tours-or-videos',
    floorPlans: 'uploads/Property/floor-plans',
    documents: 'uploads/Property/property-documents',
  },
  images: 'uploads/images',
  general: 'uploads',
};

/**
 * Extract file paths from URLs stored in database
 * @param {string} url - File URL (e.g., http://localhost:3000/api/images/authImg/file.jpg)
 * @returns {string|null} Local file path
 */
const extractFilePathFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  try {
    // Handle relative URLs (without protocol)
    let pathname = url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url);
      pathname = urlObj.pathname;
    } else if (url.startsWith('//')) {
      // Protocol-relative URL
      const urlObj = new URL('http:' + url);
      pathname = urlObj.pathname;
    }
    
    // Match /api/images/authImg/filename or /api/property/property-photos/filename
    const match = pathname.match(/\/api\/(?:images|property)\/[^/]+\/(.+)$/);
    if (match) {
      const filename = match[1];
      // Determine base directory based on URL pattern
      if (pathname.includes('/api/images/')) {
        return path.join(UPLOAD_DIRS.images, filename);
      }
      if (pathname.includes('/property-photos/')) {
        return path.join(UPLOAD_DIRS.property.photos, filename);
      }
      if (pathname.includes('/virtual-tours-or-videos/')) {
        return path.join(UPLOAD_DIRS.property.virtualTours, filename);
      }
      if (pathname.includes('/floor-plans/')) {
        return path.join(UPLOAD_DIRS.property.floorPlans, filename);
      }
      if (pathname.includes('/property-documents/')) {
        return path.join(UPLOAD_DIRS.property.documents, filename);
      }
    }
    
    return null;
  } catch (error) {
    // Console statement removed
    return null;
  }
};

/**
 * Delete a single file from filesystem
 * @param {string} filePath - Absolute file path
 * @returns {Promise<boolean>} Success status
 */
const deleteFile = async (filePath) => {
  try {
    if (!filePath) return false;
    
    await fs.unlink(filePath);
    // Console statement removed
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Console statement removed
      return false;
    }
    // Console statement removed
    return false;
  }
};

/**
 * Delete property photos from filesystem
 * @param {Array} photos - Array of photo objects with img property
 * @returns {Promise<number>} Number of files deleted
 */
const deletePropertyPhotos = async (photos = []) => {
  let deletedCount = 0;
  
  for (const photo of photos) {
    const filePath = extractFilePathFromUrl(photo.img);
    if (filePath && await deleteFile(filePath)) {
      deletedCount++;
    }
  }
  
  return deletedCount;
};

/**
 * Delete virtual tours/videos from filesystem
 * @param {Array} tours - Array of tour objects with img property
 * @returns {Promise<number>} Number of files deleted
 */
const deleteVirtualTours = async (tours = []) => {
  let deletedCount = 0;
  
  for (const tour of tours) {
    const filePath = extractFilePathFromUrl(tour.img);
    if (filePath && await deleteFile(filePath)) {
      deletedCount++;
    }
  }
  
  return deletedCount;
};

/**
 * Delete floor plans from filesystem
 * @param {Array} plans - Array of floor plan objects with img property
 * @returns {Promise<number>} Number of files deleted
 */
const deleteFloorPlans = async (plans = []) => {
  let deletedCount = 0;
  
  for (const plan of plans) {
    const filePath = extractFilePathFromUrl(plan.img);
    if (filePath && await deleteFile(filePath)) {
      deletedCount++;
    }
  }
  
  return deletedCount;
};

/**
 * Delete property documents from filesystem
 * @param {Array} documents - Array of document objects with img property
 * @returns {Promise<number>} Number of files deleted
 */
const deletePropertyDocuments = async (documents = []) => {
  let deletedCount = 0;
  
  for (const doc of documents) {
    const filePath = extractFilePathFromUrl(doc.img);
    if (filePath && await deleteFile(filePath)) {
      deletedCount++;
    }
  }
  
  return deletedCount;
};

/**
 * Clean up all files associated with a property record
 * @param {object} property - Property document
 * @returns {Promise<{ total: number, photos: number, tours: number, plans: number, documents: number }>}
 */
const cleanupPropertyFiles = async (property) => {
  if (!property) return { total: 0, photos: 0, tours: 0, plans: 0, documents: 0 };
  
  const [photosResult, toursResult, plansResult, documentsResult] = await Promise.allSettled([
    deletePropertyPhotos(property.propertyPhotos || []),
    deleteVirtualTours(property.virtualToursOrVideos || []),
    deleteFloorPlans(property.floorPlans || []),
    deletePropertyDocuments(property.propertyDocuments || []),
  ]);
  
  const photos = photosResult.status === 'fulfilled' ? photosResult.value : 0;
  const tours = toursResult.status === 'fulfilled' ? toursResult.value : 0;
  const plans = plansResult.status === 'fulfilled' ? plansResult.value : 0;
  const documents = documentsResult.status === 'fulfilled' ? documentsResult.value : 0;
  
  // Log any errors for debugging
  if (photosResult.status === 'rejected') {
    // Console statement removed
  }
  if (toursResult.status === 'rejected') {
    // Console statement removed
  }
  if (plansResult.status === 'rejected') {
    // Console statement removed
  }
  if (documentsResult.status === 'rejected') {
    // Console statement removed
  }
  
  return {
    total: photos + tours + plans + documents,
    photos,
    tours,
    plans,
    documents,
  };
};

/**
 * Scan directory for orphaned files
 * Files that exist on disk but are not referenced in database
 * @param {string} directory - Directory to scan
 * @param {Array} referencedFiles - Array of filenames referenced in database
 * @returns {Promise<Array>} Array of orphaned file paths
 */
const findOrphanedFiles = async (directory, referencedFiles = []) => {
  try {
    const files = await fs.readdir(directory);
    const orphaned = [];
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isFile() && !referencedFiles.includes(file)) {
        orphaned.push({
          path: filePath,
          name: file,
          size: stats.size,
          modified: stats.mtime,
        });
      }
    }
    
    return orphaned;
  } catch (error) {
    // Console statement removed
    return [];
  }
};

/**
 * Collect all referenced filenames from the database
 * Scans all active properties for file URLs in photo, tour, plan, and document fields
 * @returns {Promise<Set<string>>} Set of filenames referenced in the database
 */
const collectReferencedFiles = async () => {
  const referencedFilenames = new Set();
  
  try {
    // Fetch all active properties with file fields
    const properties = await Property.find({ deleted: false })
      .select('propertyPhotos virtualToursOrVideos floorPlans propertyDocuments')
      .lean();
    
    for (const prop of properties) {
      // Helper to extract filename from URL or path
      const extractFilenames = (items) => {
        if (!Array.isArray(items)) return;
        for (const item of items) {
          const urlOrPath = item?.img || item?.url || item?.path;
          if (urlOrPath) {
            // Extract filename from URL or path
            const match = urlOrPath.match(/\/([^/]+\.(?:jpg|jpeg|png|gif|webp|svg|avif|pdf|doc|docx|xls|xlsx|csv|rtf|mp4|webm|ogg|mov))$/i);
            if (match) {
              referencedFilenames.add(match[1]);
            }
            // Also try to match the full path pattern for direct file references
            const pathMatch = urlOrPath.match(/([^/]+\.[a-zA-Z0-9]+)$/);
            if (pathMatch) {
              referencedFilenames.add(pathMatch[1]);
            }
          }
        }
      };
      
      extractFilenames(prop.propertyPhotos);
      extractFilenames(prop.virtualToursOrVideos);
      extractFilenames(prop.floorPlans);
      extractFilenames(prop.propertyDocuments);
    }
  } catch (error) {
    // Console statement removed
  }
  
  return referencedFilenames;
};

/**
 * Clean up orphaned files from upload directories
 * @param {object} options - Cleanup options
 * @returns {Promise<{ deleted: number, errors: number, totalSize: number }>}
 */
const cleanupOrphanedFiles = async (options = {}) => {
  const { dryRun = true } = options;
  
  // Collect all referenced files from database first
  const referencedFilenames = await collectReferencedFiles();
  // Console statement removed
  
  // Only scan property-related directories by default
  const directories = options.directories || [
    UPLOAD_DIRS.property.photos,
    UPLOAD_DIRS.property.virtualTours,
    UPLOAD_DIRS.property.floorPlans,
    UPLOAD_DIRS.property.documents,
    UPLOAD_DIRS.images,
    UPLOAD_DIRS.general,
  ];
  
  let deleted = 0;
  let errors = 0;
  let totalSize = 0;
  
  for (const directory of directories) {
    try {
      // Pass the collected referenced filenames to findOrphanedFiles
      const orphanedFiles = await findOrphanedFiles(directory, Array.from(referencedFilenames));
      
      for (const file of orphanedFiles) {
        totalSize += file.size;
        
        if (!dryRun) {
          try {
            await fs.unlink(file.path);
            deleted++;
          } catch (error) {
            // Console statement removed
            errors++;
          }
        } else {
          deleted++;  // Count but don't delete in dry run
        }
      }
    } catch (error) {
      // Console statement removed
      errors++;
    }
  }
  
  return {
    deleted,
    errors,
    totalSize,
    totalSizeText: formatFileSize(totalSize),
    dryRun,
    referencedFilesCount: referencedFilenames.size,
  };
};

/**
 * Format file size for human readability
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Optimize and compress image
 * @param {string} inputPath - Input image path
 * @param {string} outputPath - Output image path (optional, defaults to input)
 * @param {object} options - Compression options
 * @returns {Promise<{ path: string, size: number, originalSize: number }>}
 */
const optimizeImage = async (inputPath, outputPath = null, options = {}) => {
  if (!sharp) {
    return { path: inputPath, size: 0, originalSize: 0, compressionRatio: '0%', message: 'sharp not available' };
  }

  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 80,
    format = 'jpeg',
  } = options;

  const output = outputPath || inputPath;

  try {
    const originalStats = await fs.stat(inputPath);
    const originalSize = originalStats.size;
    
    let pipeline = sharp(inputPath);
    
    // Resize if larger than max dimensions
    pipeline = pipeline.resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    });
    
    // Apply format-specific options
    if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
    } else if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality });
    }
    
    await pipeline.toFile(output);
    
    const newStats = await fs.stat(output);
    const newSize = newStats.size;
    
    const compressionRatio = ((1 - newSize / originalSize) * 100).toFixed(1);
    
    // Console statement removed
    
    return {
      path: output,
      size: newSize,
      originalSize,
      compressionRatio: `${compressionRatio}%`,
    };
  } catch (error) {
    // Console statement removed
    throw error;
  }
};

/**
 * Generate image thumbnails
 * @param {string} inputPath - Input image path
 * @param {Array} sizes - Array of { width, height, suffix } objects
 * @returns {Promise<Array>} Array of generated thumbnails
 */
const generateThumbnails = async (inputPath, sizes = [
  { width: 150, height: 150, suffix: 'thumb' },
  { width: 400, height: 300, suffix: 'small' },
  { width: 800, height: 600, suffix: 'medium' },
]) => {
  if (!sharp) {
    return [];
  }
  const thumbnails = [];
  const dir = path.dirname(inputPath);
  const name = path.basename(inputPath, path.extname(inputPath));
  const ext = path.extname(inputPath);
  
  for (const size of sizes) {
    const outputPath = path.join(dir, `${name}-${size.suffix}${ext}`);
    
    try {
      await sharp(inputPath)
        .resize(size.width, size.height, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 75 })
        .toFile(outputPath);
      
      const stats = await fs.stat(outputPath);
      thumbnails.push({
        path: outputPath,
        size: stats.size,
        width: size.width,
        height: size.height,
        suffix: size.suffix,
      });
    } catch (error) {
      // Console statement removed
    }
  }
  
  return thumbnails;
};

module.exports = {
  UPLOAD_DIRS,
  extractFilePathFromUrl,
  deleteFile,
  deletePropertyPhotos,
  deleteVirtualTours,
  deleteFloorPlans,
  deletePropertyDocuments,
  cleanupPropertyFiles,
  collectReferencedFiles,
  findOrphanedFiles,
  cleanupOrphanedFiles,
  formatFileSize,
  optimizeImage,
  generateThumbnails,
};
