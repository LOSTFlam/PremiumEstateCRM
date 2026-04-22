const mongoose = require('mongoose');

const pipelineStageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number, required: true },
  color: { type: String, default: '#3b82f6' },
  probability: { type: Number, default: 0 },
  stageType: {
    type: String,
    enum: ['lead', 'qualification', 'viewing', 'negotiation', 'closing', 'won', 'lost'],
    required: true,
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

pipelineStageSchema.index({ order: 1 });

module.exports = mongoose.model('PipelineStage', pipelineStageSchema);
