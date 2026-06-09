const Quote = require('../../model/schema/quote');
const Notification = require('../../model/schema/notification');
const { broadcast } = require('../../services/websocket');

const getQuotes = async (req, res) => {
  try {
    const { status, contactId, leadId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (contactId) filter.contact = contactId;
    if (leadId) filter.lead = leadId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [quotes, total] = await Promise.all([
      Quote.find(filter)
        .populate('lead', 'name email phone')
        .populate('contact', 'name email')
        .populate('property', 'title price location')
        .populate('createdBy', 'username firstName lastName')
        .populate('assignedTo', 'username firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Quote.countDocuments(filter),
    ]);

    res.status(200).json({ data: quotes, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('lead')
      .populate('contact')
      .populate('property')
      .populate('workflow')
      .populate('items.product')
      .populate('createdBy', 'username firstName lastName email')
      .populate('assignedTo', 'username firstName lastName email');

    if (!quote) return res.status(404).json({ error: 'Quote not found' });

    if (quote.status === 'sent' && !quote.viewedAt) {
      quote.viewedAt = new Date();
      await quote.save();
    }

    res.status(200).json(quote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createQuote = async (req, res) => {
  try {
    const quote = new Quote({
      ...req.body,
      createdBy: req.user.userId,
    });
    await quote.save();

    const populated = await Quote.findById(quote._id)
      .populate('lead', 'name email')
      .populate('contact', 'name email')
      .populate('createdBy', 'username firstName lastName');

    broadcast({
      type: 'activity',
      data: { type: 'quote_created', description: `Quote ${quote.quoteNumber} created for ${populated.contact?.name || populated.lead?.name || 'client'}`, timestamp: new Date().toISOString() },
    });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateQuote = async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { returnDocument: 'after', runValidators: true }
    )
    .populate('lead', 'name email')
    .populate('contact', 'name email')
    .populate('items.product');

    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.status(200).json(quote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Quote not found' });

    quote.status = 'sent';
    quote.sentAt = new Date();
    await quote.save();

    await Notification.create({
      userId: quote.assignedTo || quote.createdBy,
      type: 'email',
      title: 'Quote Sent',
      message: `Quote ${quote.quoteNumber} has been sent to ${quote.contact?.name || 'client'}`,
      actionUrl: `/quotes/${quote._id}`,
    });

    broadcast({
      type: 'activity',
      data: { type: 'email_sent', description: `Quote ${quote.quoteNumber} sent to client`, timestamp: new Date().toISOString() },
    });

    res.status(200).json(quote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const respondToQuote = async (req, res) => {
  try {
    const { action } = req.body;
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Quote not found' });

    if (action === 'accept') {
      quote.status = 'accepted';
      quote.acceptedAt = new Date();
    } else if (action === 'reject') {
      quote.status = 'rejected';
      quote.rejectedAt = new Date();
    } else {
      return res.status(400).json({ error: 'Invalid action. Use accept or reject.' });
    }

    await quote.save();

    await Notification.create({
      userId: quote.assignedTo || quote.createdBy,
      type: 'deal_stage',
      title: `Quote ${action === 'accept' ? 'Accepted' : 'Rejected'}`,
      message: `Quote ${quote.quoteNumber} was ${action}ed by the client`,
      actionUrl: `/quotes/${quote._id}`,
    });

    broadcast({
      type: 'activity',
      data: { type: 'deal_stage', description: `Quote ${quote.quoteNumber} ${action}ed`, timestamp: new Date().toISOString() },
    });

    res.status(200).json(quote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const convertToDeal = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).populate('lead');
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    if (quote.status !== 'accepted') return res.status(400).json({ error: 'Quote must be accepted before converting to deal' });

    const LeadWorkflow = require('../../model/schema/leadWorkflow');
    const PipelineStage = require('../../model/schema/pipelineStage');

    const closingStage = await PipelineStage.findOne({ stageType: 'closing' });

    const workflow = new LeadWorkflow({
      lead: quote.lead,
      property: quote.property,
      assignedAgent: quote.assignedTo || quote.createdBy,
      currentStage: closingStage?._id,
      dealValue: quote.grandTotal,
      dealProbability: closingStage?.probability || 85,
      status: 'active',
    });
    await workflow.save();

    quote.status = 'converted';
    await quote.save();

    res.status(200).json({ workflow, quote });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.status(200).json({ message: 'Quote deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getQuoteStats = async (req, res) => {
  try {
    const stats = await Quote.aggregate([
      { $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$grandTotal' },
      }},
    ]);

    const result = {
      draft: { count: 0, totalValue: 0 },
      sent: { count: 0, totalValue: 0 },
      accepted: { count: 0, totalValue: 0 },
      rejected: { count: 0, totalValue: 0 },
      expired: { count: 0, totalValue: 0 },
      converted: { count: 0, totalValue: 0 },
    };

    stats.forEach(s => {
      if (result[s._id]) {
        result[s._id] = { count: s.count, totalValue: s.totalValue };
      }
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getQuotes, getQuoteById, createQuote, updateQuote,
  sendQuote, respondToQuote, convertToDeal, deleteQuote, getQuoteStats,
};
