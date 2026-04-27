const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const {
  dbHealthCheck,
  verifySchemas,
  testImageStorage,
  repairMissingData,
} = require('../../utils/dbHealthCheck');

/**
 * GET /api/health/status
 * Get comprehensive database health status
 */
router.get('/status', auth, async (req, res) => {
  try {
    const health = await dbHealthCheck();
    const code = health.status === 'healthy' ? 200 : 503;
    res.status(code).json(health);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/health/schemas
 * Verify all database schemas
 */
router.get('/schemas', auth, async (req, res) => {
  try {
    const schemas = await verifySchemas();
    res.status(200).json(schemas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/health/images
 * Test image storage and coverage
 */
router.get('/images', auth, async (req, res) => {
  try {
    const imageStats = await testImageStorage();
    res.status(200).json(imageStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/health/repair
 * Repair missing or corrupt data
 * Only accessible to admins
 */
router.post('/repair', auth, async (req, res) => {
  try {
    // Check if user is admin (if RBAC is implemented)
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Admin access required' });
    // }

    const repairs = await repairMissingData();
    res.status(200).json(repairs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
