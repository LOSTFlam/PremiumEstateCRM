/**
 * Media Management Controller
 * Provides endpoints for:
 * - Orphaned file cleanup
 * - Upload statistics
 * - File optimization
 */

const { cleanupOrphanedFiles, collectReferencedFiles, UPLOAD_DIRS } = require('../../services/mediaService');
const Property = require('../../model/schema/property');
const Img = require('../../model/schema/imagesSchema');

/**
 * Get media storage statistics
 */
const getMediaStats = async (req, res) => {
  try {
    // Count files in database
    const propertiesWithPhotos = await Property.find({ 
      deleted: false, 
      propertyPhotos: { $exists: true, $ne: [] } 
    }).countDocuments();
    
    const propertiesWithDocs = await Property.find({ 
      deleted: false, 
      propertyDocuments: { $exists: true, $ne: [] } 
    }).countDocuments();
    
    const totalPhotos = await Property.aggregate([
      { $match: { deleted: false } },
      { $project: { count: { $size: { $ifNull: ['$propertyPhotos', []] } } } },
      { $group: { _id: null, total: { $sum: '$count' } } }
    ]);
    
    const totalDocs = await Property.aggregate([
      { $match: { deleted: false } },
      { $project: { count: { $size: { $ifNull: ['$propertyDocuments', []] } } } },
      { $group: { _id: null, total: { $sum: '$count' } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        propertiesWithPhotos,
        propertiesWithDocs,
        totalPhotos: totalPhotos[0]?.total || 0,
        totalDocs: totalDocs[0]?.total || 0,
        uploadDirs: Object.keys(UPLOAD_DIRS),
      }
    });
  } catch (error) {
    // Console statement removed
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get media statistics',
      error: error.message 
    });
  }
};

/**
 * Scan for orphaned files (dry run)
 */
const scanOrphanedFiles = async (req, res) => {
  try {
    const result = await cleanupOrphanedFiles({ dryRun: true });
    
    res.status(200).json({
      success: true,
      data: {
        ...result,
        message: `Found ${result.deleted} orphaned files (${result.totalSizeText})`,
      }
    });
  } catch (error) {
    // Console statement removed
    res.status(500).json({ 
      success: false, 
      message: 'Failed to scan for orphaned files',
      error: error.message 
    });
  }
};

/**
 * Clean up orphaned files (actual deletion)
 * Requires superAdmin role - enforced via authorize middleware in routes
 * 
 * SAFETY: This endpoint now requires a confirmation flag in the request body
 * to prevent accidental mass deletion. Pass { confirm: true } in the body.
 */
const cleanupOrphanedFilesEndpoint = async (req, res) => {
  try {
    // Safety check: require explicit confirmation
    const { confirm } = req.body || {};
    if (!confirm) {
      return res.status(400).json({
        success: false,
        message: 'Explicit confirmation required. Pass { confirm: true } in request body to proceed with deletion.',
      });
    }

    // First, collect referenced files to verify the system is working
    const referencedFiles = await collectReferencedFiles();
    
    // Safety check: if no referenced files found, something is wrong
    if (referencedFiles.size === 0) {
      // Console statement removed
      return res.status(400).json({
        success: false,
        message: 'Cleanup aborted: No referenced files found in database. This may indicate a configuration issue. Please verify database connection and Property schema before proceeding.',
        safetyCheck: true,
      });
    }

    const result = await cleanupOrphanedFiles({ dryRun: false });
    
    res.status(200).json({
      success: true,
      data: {
        ...result,
        message: `Deleted ${result.deleted} orphaned files (${result.totalSizeText})`,
        referencedFilesCount: referencedFiles.size,
      }
    });
  } catch (error) {
    // Console statement removed
    res.status(500).json({ 
      success: false, 
      message: 'Failed to cleanup orphaned files',
      error: error.message 
    });
  }
};

module.exports = {
  getMediaStats,
  scanOrphanedFiles,
  cleanupOrphanedFilesEndpoint,
};
