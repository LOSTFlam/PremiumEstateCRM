const express = require('express');
const media = require('./mediaController');
const { auth } = require('../../middelwares/auth');
const { authorize } = require('../../middelwares/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get media storage statistics
router.get('/stats', media.getMediaStats);

// Scan for orphaned files (safe, dry run)
router.get('/orphaned/scan', media.scanOrphanedFiles);

// Clean up orphaned files (actual deletion, superAdmin only)
router.post('/orphaned/cleanup', authorize('superAdmin'), media.cleanupOrphanedFilesEndpoint);

module.exports = router;
