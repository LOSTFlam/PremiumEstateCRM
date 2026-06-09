const mongoose = require('mongoose');
const PipelineStage = require('../model/schema/pipelineStage');

const seedPipelineStages = async () => {
  try {
    const existing = await PipelineStage.countDocuments();
    if (existing > 0) {
      // Console statement removed
      return;
    }

    const stages = [
      { name: 'New Lead', order: 1, color: '#3b82f6', probability: 10, stageType: 'lead' },
      { name: 'Qualification', order: 2, color: '#8b5cf6', probability: 25, stageType: 'qualification' },
      { name: 'Viewing Scheduled', order: 3, color: '#f59e0b', probability: 45, stageType: 'viewing' },
      { name: 'Negotiation', order: 4, color: '#f97316', probability: 65, stageType: 'negotiation' },
      { name: 'Closing', order: 5, color: '#ef4444', probability: 85, stageType: 'closing' },
      { name: 'Won', order: 6, color: '#10b981', probability: 100, stageType: 'won' },
      { name: 'Lost', order: 7, color: '#64748b', probability: 0, stageType: 'lost' },
    ];

    await PipelineStage.insertMany(stages);
    // Console statement removed
  } catch (err) {
    // Console statement removed
  }
};

module.exports = seedPipelineStages;
