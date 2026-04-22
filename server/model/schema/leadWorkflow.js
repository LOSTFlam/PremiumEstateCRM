const mongoose = require('mongoose');

const leadActivitySchema = new mongoose.Schema({
  type: { type: String, enum: ['call', 'email', 'meeting', 'viewing', 'note', 'status_change'] },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const leadWorkflowSchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currentStage: { type: mongoose.Schema.Types.ObjectId, ref: 'PipelineStage' },
  stageHistory: [{
    stage: { type: mongoose.Schema.Types.ObjectId, ref: 'PipelineStage' },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: String,
  }],
  dealValue: { type: Number },
  expectedCloseDate: Date,
  dealProbability: { type: Number, default: 0 },
  activities: [leadActivitySchema],
  nextFollowUp: Date,
  status: { type: String, enum: ['active', 'converted', 'lost', 'archived'], default: 'active' },
}, { timestamps: true });

leadWorkflowSchema.index({ assignedAgent: 1, currentStage: 1 });
leadWorkflowSchema.index({ expectedCloseDate: 1 });
leadWorkflowSchema.index({ status: 1 });

module.exports = mongoose.model('LeadWorkflow', leadWorkflowSchema);
