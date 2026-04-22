const PipelineStage = require('../../model/schema/pipelineStage');
const LeadWorkflow = require('../../model/schema/leadWorkflow');
const Notification = require('../../model/schema/notification');
const { broadcast, sendToRole } = require('../../services/websocket');

const getStages = async (req, res) => {
  try {
    const stages = await PipelineStage.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json(stages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createStage = async (req, res) => {
  try {
    const { name, order, color, probability, stageType } = req.body;
    const stage = new PipelineStage({
      name, order, color, probability, stageType,
      createdBy: req.user.userId,
    });
    await stage.save();
    res.status(201).json(stage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStage = async (req, res) => {
  try {
    const stage = await PipelineStage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!stage) return res.status(404).json({ error: 'Stage not found' });
    res.status(200).json(stage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteStage = async (req, res) => {
  try {
    const stage = await PipelineStage.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!stage) return res.status(404).json({ error: 'Stage not found' });
    res.status(200).json({ message: 'Stage deactivated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWorkflows = async (req, res) => {
  try {
    const { status, agentId, stageId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (agentId) filter.assignedAgent = agentId;
    if (stageId) filter.currentStage = stageId;

    const workflows = await LeadWorkflow.find(filter)
      .populate('lead', 'name email phone')
      .populate('property', 'title price location')
      .populate('assignedAgent', 'username firstName lastName')
      .populate('currentStage')
      .sort({ createdAt: -1 });

    res.status(200).json(workflows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWorkflowById = async (req, res) => {
  try {
    const workflow = await LeadWorkflow.findById(req.params.id)
      .populate('lead')
      .populate('property')
      .populate('assignedAgent', 'username firstName lastName')
      .populate('currentStage')
      .populate('stageHistory.stage')
      .populate('activities.createdBy', 'username');

    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });
    res.status(200).json(workflow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createWorkflow = async (req, res) => {
  try {
    const { lead, property, assignedAgent, currentStage, dealValue, expectedCloseDate, nextFollowUp } = req.body;

    const workflow = new LeadWorkflow({
      lead, property, assignedAgent, currentStage,
      dealValue, expectedCloseDate, nextFollowUp,
    });
    await workflow.save();

    const populated = await LeadWorkflow.findById(workflow._id)
      .populate('lead')
      .populate('assignedAgent', 'username firstName lastName')
      .populate('currentStage');

    broadcast({ type: 'activity', data: { type: 'new_lead', description: `New lead entered pipeline: ${populated.lead?.name || 'Unknown'}`, timestamp: new Date().toISOString() } });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateWorkflow = async (req, res) => {
  try {
    const workflow = await LeadWorkflow.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('lead')
    .populate('assignedAgent', 'username firstName lastName')
    .populate('currentStage');

    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });
    res.status(200).json(workflow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const changeStage = async (req, res) => {
  try {
    const { stageId, notes } = req.body;
    const workflow = await LeadWorkflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });

    const oldStage = await PipelineStage.findById(workflow.currentStage);
    const newStage = await PipelineStage.findById(stageId);

    workflow.currentStage = stageId;
    workflow.stageHistory.push({
      stage: stageId,
      changedBy: req.user.userId,
      notes,
    });
    workflow.dealProbability = newStage?.probability || 0;

    const stageType = newStage?.stageType;
    if (stageType === 'won') workflow.status = 'converted';
    else if (stageType === 'lost') workflow.status = 'lost';

    await workflow.save();

    const populated = await LeadWorkflow.findById(workflow._id)
      .populate('lead')
      .populate('assignedAgent', 'username firstName lastName')
      .populate('currentStage');

    if (oldStage && newStage) {
      broadcast({
        type: 'activity',
        data: {
          type: 'deal_stage',
          description: `${populated.lead?.name || 'Deal'} moved from ${oldStage.name} to ${newStage.name}`,
          timestamp: new Date().toISOString(),
        },
      });

      await Notification.create({
        userId: workflow.assignedAgent,
        type: 'deal_stage',
        title: 'Deal Stage Updated',
        message: `${populated.lead?.name || 'A deal'} moved to ${newStage.name}`,
        actionUrl: `/pipeline/${workflow._id}`,
      });
    }

    res.status(200).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addActivity = async (req, res) => {
  try {
    const { type, description } = req.body;
    const workflow = await LeadWorkflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });

    workflow.activities.push({ type, description, createdBy: req.user.userId });
    await workflow.save();

    const populated = await LeadWorkflow.findById(workflow._id)
      .populate('activities.createdBy', 'username');

    res.status(200).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPipelineStats = async (req, res) => {
  try {
    const stats = await LeadWorkflow.aggregate([
      { $match: { status: 'active' } },
      { $group: {
        _id: '$currentStage',
        count: { $sum: 1 },
        totalValue: { $sum: '$dealValue' },
      }},
      { $sort: { totalValue: -1 } },
    ]);

    const stages = await PipelineStage.find({ isActive: true }).sort({ order: 1 });

    const result = stages.map(stage => {
      const stat = stats.find(s => s._id?.toString() === stage._id.toString());
      return {
        stage,
        count: stat?.count || 0,
        totalValue: stat?.totalValue || 0,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getStages, createStage, updateStage, deleteStage,
  getWorkflows, getWorkflowById, createWorkflow, updateWorkflow,
  changeStage, addActivity, getPipelineStats,
};
