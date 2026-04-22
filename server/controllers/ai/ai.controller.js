const aiRecommendation = require('../../services/aiRecommendation.service');

const getRecommendations = async (req, res) => {
  try {
    const { leadId } = req.params;
    // Check if limit is provided in the route parameters, otherwise default to 10
    const limitValue = req.params.limit ? parseInt(req.params.limit) : 10;
    const recommendations = await aiRecommendation.getRecommendations(leadId, limitValue || 10);
    res.status(200).json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDealProbability = async (req, res) => {
  try {
    const LeadWorkflow = require('../../model/schema/leadWorkflow');
    const workflow = await LeadWorkflow.findById(req.params.workflowId).populate('currentStage');
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });

    const probability = aiRecommendation.calculateDealProbability(workflow);
    workflow.dealProbability = probability;
    await workflow.save();

    res.status(200).json({ dealProbability: probability });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAllProbabilities = async (req, res) => {
  try {
    const result = await aiRecommendation.updateAllDealProbabilities();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getRecommendations, getDealProbability, updateAllProbabilities };