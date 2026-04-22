const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const {
  getStages, createStage, updateStage, deleteStage,
  getWorkflows, getWorkflowById, createWorkflow, updateWorkflow,
  changeStage, addActivity, getPipelineStats,
} = require('./pipeline.controller');

router.get('/stages', auth, getStages);
router.post('/stages', auth, createStage);
router.put('/stages/:id', auth, updateStage);
router.delete('/stages/:id', auth, deleteStage);

router.get('/workflows', auth, getWorkflows);
router.get('/workflows/stats', auth, getPipelineStats);
router.get('/workflows/:id', auth, getWorkflowById);
router.post('/workflows', auth, createWorkflow);
router.put('/workflows/:id', auth, updateWorkflow);
router.put('/workflows/:id/stage', auth, changeStage);
router.post('/workflows/:id/activity', auth, addActivity);

module.exports = router;
