const LeadWorkflow = require('../model/schema/leadWorkflow');
const moment = require('moment');

class AgentMetricsService {
  async getAgentPerformance(agentId, period = '30d') {
    const days = parseInt(period) || 30;
    const startDate = moment().subtract(days, 'days').toDate();

    const [totalDeals, convertedDeals, revenueData, avgDaysData] = await Promise.all([
      LeadWorkflow.countDocuments({ assignedAgent: agentId, createdAt: { $gte: startDate } }),
      LeadWorkflow.countDocuments({ assignedAgent: agentId, status: 'converted', createdAt: { $gte: startDate } }),
      LeadWorkflow.aggregate([
        { $match: { assignedAgent: agentId, status: 'converted', createdAt: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: '$dealValue' } } },
      ]),
      LeadWorkflow.aggregate([
        { $match: { assignedAgent: agentId, status: 'converted' } },
        { $project: { daysToClose: { $divide: [{ $subtract: ['$updatedAt', '$createdAt'] }, 86400000] } } },
        { $group: { _id: null, avg: { $avg: '$daysToClose' } } },
      ]),
    ]);

    return {
      totalDeals,
      conversionRate: totalDeals ? ((convertedDeals / totalDeals) * 100).toFixed(1) : 0,
      totalRevenue: revenueData[0]?.total || 0,
      avgDaysToClose: avgDaysData[0]?.avg?.toFixed(1) || 0,
    };
  }

  async getLeaderboard(period = '30d') {
    const days = parseInt(period) || 30;
    const startDate = moment().subtract(days, 'days').toDate();

    return LeadWorkflow.aggregate([
      { $match: { status: 'converted', createdAt: { $gte: startDate } } },
      { $group: {
        _id: '$assignedAgent',
        deals: { $sum: 1 },
        revenue: { $sum: '$dealValue' },
      }},
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agent' } },
      { $unwind: '$agent' },
      { $project: {
        agent: { name: '$agent.username', email: '$agent.email', firstName: '$agent.firstName', lastName: '$agent.lastName' },
        deals: 1,
        revenue: 1,
      }},
    ]);
  }

  async getTeamSummary(period = '30d') {
    const days = parseInt(period) || 30;
    const startDate = moment().subtract(days, 'days').toDate();

    return LeadWorkflow.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: {
        _id: '$assignedAgent',
        totalDeals: { $sum: 1 },
        convertedDeals: { $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] } },
        activeDeals: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        totalRevenue: { $sum: { $cond: [{ $eq: ['$status', 'converted'] }, '$dealValue', 0] } },
      }},
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agent' } },
      { $unwind: '$agent' },
      { $project: {
        agent: { name: '$agent.username', firstName: '$agent.firstName', lastName: '$agent.lastName' },
        totalDeals: 1,
        convertedDeals: 1,
        activeDeals: 1,
        totalRevenue: 1,
        conversionRate: { $cond: [{ $eq: ['$totalDeals', 0] }, 0, { $multiply: [{ $divide: ['$convertedDeals', '$totalDeals'] }, 100] }] },
      }},
      { $sort: { totalRevenue: -1 } },
    ]);
  }
}

module.exports = new AgentMetricsService();
