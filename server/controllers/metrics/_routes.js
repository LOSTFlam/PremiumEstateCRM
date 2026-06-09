const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const { getAgentPerformance, getLeaderboard, getTeamSummary } = require('./metrics.controller');

// Define separate routes for the optional parameter case
router.get('/agent', auth, getAgentPerformance);
router.get('/agent/:agentId', auth, getAgentPerformance);
router.get('/leaderboard', auth, getLeaderboard);
router.get('/team', auth, getTeamSummary);

module.exports = router;