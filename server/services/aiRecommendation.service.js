const Property = require('../model/schema/property');
const Lead = require('../model/schema/lead');
const LeadWorkflow = require('../model/schema/leadWorkflow');

class AIRecommendationService {
  calculateMatchScore(property, leadPreferences) {
    let score = 0;
    let maxScore = 0;

    maxScore += 30;
    if (leadPreferences.location && property.location?.includes(leadPreferences.location)) {
      score += 30;
    }

    maxScore += 25;
    if (leadPreferences.budgetMin && leadPreferences.budgetMax) {
      const price = property.price || 0;
      if (price >= leadPreferences.budgetMin && price <= leadPreferences.budgetMax) {
        score += 25;
      } else {
        const deviation = Math.abs(price - (leadPreferences.budgetMin + leadPreferences.budgetMax) / 2);
        const range = leadPreferences.budgetMax - leadPreferences.budgetMin;
        score += Math.max(0, 25 * (1 - deviation / range));
      }
    }

    maxScore += 20;
    if (leadPreferences.propertyType && property.unitType?.includes(leadPreferences.propertyType)) {
      score += 20;
    }

    maxScore += 15;
    if (leadPreferences.bedrooms) {
      const unit = property.units?.[0];
      if (unit?.bedrooms === leadPreferences.bedrooms) score += 15;
      else if (Math.abs(unit?.bedrooms - leadPreferences.bedrooms) <= 1) score += 10;
    }

    maxScore += 10;
    if (leadPreferences.amenities?.length) {
      const matched = leadPreferences.amenities.filter(a => property.amenities?.includes(a)).length;
      score += 10 * (matched / leadPreferences.amenities.length);
    }

    return Math.round((score / maxScore) * 100);
  }

  async getRecommendations(leadId, limit = 10) {
    const lead = await Lead.findById(leadId);
    if (!lead) return [];

    const properties = await Property.find({ verificationStatus: 'verified', deleted: false }).lean();

    const scored = properties.map(p => ({
      ...p,
      matchScore: this.calculateMatchScore(p, lead.preferences || {}),
    }));

    return scored
      .filter(p => p.matchScore > 50)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  calculateDealProbability(leadWorkflow) {
    let probability = 20;

    const stageProbabilities = {
      'lead': 10,
      'qualification': 25,
      'viewing': 45,
      'negotiation': 65,
      'closing': 85,
      'won': 100,
    };
    probability = stageProbabilities[leadWorkflow.currentStage?.stageType] || 20;

    if (leadWorkflow.activities?.length > 5) probability += 10;
    if (leadWorkflow.nextFollowUp && new Date(leadWorkflow.nextFollowUp) < new Date()) probability += 5;

    const daysOld = (Date.now() - new Date(leadWorkflow.createdAt).getTime()) / 86400000;
    if (daysOld > 60) probability -= 15;
    else if (daysOld > 30) probability -= 5;

    return Math.min(100, Math.max(0, probability));
  }

  async updateAllDealProbabilities() {
    const workflows = await LeadWorkflow.find({ status: 'active' }).populate('currentStage');
    const updates = workflows.map(wf => ({
      updateOne: {
        filter: { _id: wf._id },
        update: { dealProbability: this.calculateDealProbability(wf) },
      },
    }));

    if (updates.length > 0) {
      await LeadWorkflow.bulkWrite(updates);
    }

    return { updated: updates.length };
  }
}

module.exports = new AIRecommendationService();
