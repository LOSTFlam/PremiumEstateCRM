const agentMetrics = require('../../services/agentMetrics.service');

const getAgentPerformance = async (req, res) => {
  try {
    const { period } = req.query;
    const agentId = req.params.agentId || req.user.userId;
    const metrics = await agentMetrics.getAgentPerformance(agentId, period);
    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { period } = req.query;
    const leaderboard = await agentMetrics.getLeaderboard(period);
    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTeamSummary = async (req, res) => {
  try {
    const { period } = req.query;
    const summary = await agentMetrics.getTeamSummary(period);
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAgentPerformance, getLeaderboard, getTeamSummary };
