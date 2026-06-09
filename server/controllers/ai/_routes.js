const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const { getRecommendations, getDealProbability, updateAllProbabilities } = require('./ai.controller');

// Define separate routes for the optional parameter case
router.get('/recommendations/:leadId', auth, getRecommendations);
router.get('/recommendations/:leadId/:limit', auth, getRecommendations);
router.get('/deal-probability/:workflowId', auth, getDealProbability);
router.post('/update-probabilities', auth, updateAllProbabilities);

module.exports = router;