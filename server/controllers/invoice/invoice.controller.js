const Invoice = require('../../model/schema/invoice');
const Notification = require('../../model/schema/notification');
const { broadcast } = require('../../services/websocket');

const getInvoices = async (req, res) => {
  try {
    const { status, contactId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (contactId) filter.contact = contactId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [invoices, total] = await Promise.all([
      Invoice.find(filter)
        .populate('contact', 'name email')
        .populate('lead', 'name email')
        .populate('property', 'title price')
        .populate('quote', 'quoteNumber')
        .populate('createdBy', 'username firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Invoice.countDocuments(filter),
    ]);

    res.status(200).json({ data: invoices, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('contact')
      .populate('lead')
      .populate('property')
      .populate('quote')
      .populate('items.product')
      .populate('payments.recordedBy', 'username');

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    if (invoice.status === 'sent' && !invoice.viewedAt) {
      invoice.viewedAt = new Date();
      await invoice.save();
    }
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice({ ...req.body, createdBy: req.user.userId });
    await invoice.save();
    const populated = await Invoice.findById(invoice._id)
      .populate('contact', 'name email')
      .populate('createdBy', 'username firstName lastName');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true })
      .populate('contact', 'name email');
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    invoice.status = 'sent';
    invoice.sentAt = new Date();
    await invoice.save();

    await Notification.create({
      userId: invoice.assignedTo || invoice.createdBy,
      type: 'email',
      title: 'Invoice Sent',
      message: `Invoice ${invoice.invoiceNumber} sent to ${invoice.contact?.name || 'client'}`,
      actionUrl: `/invoices/${invoice._id}`,
    });

    broadcast({ type: 'activity', data: { type: 'email_sent', description: `Invoice ${invoice.invoiceNumber} sent`, timestamp: new Date().toISOString() } });
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const recordPayment = async (req, res) => {
  try {
    const { amount, method, reference, notes } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    invoice.payments.push({ amount, method, reference, notes, recordedBy: req.user.userId });
    invoice.amountPaid += amount;
    await invoice.save();

    const populated = await Invoice.findById(invoice._id).populate('payments.recordedBy', 'username');

    broadcast({ type: 'activity', data: { type: 'deal_stage', description: `Payment of $${amount} recorded for invoice ${invoice.invoiceNumber}`, timestamp: new Date().toISOString() } });
    res.status(200).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.status(200).json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInvoiceStats = async (req, res) => {
  try {
    const stats = await Invoice.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, totalValue: { $sum: '$grandTotal' }, totalPaid: { $sum: '$amountPaid' }, totalDue: { $sum: '$amountDue' } } },
    ]);
    const result = { draft: { count: 0, totalValue: 0 }, sent: { count: 0, totalValue: 0 }, partially_paid: { count: 0, totalValue: 0 }, paid: { count: 0, totalValue: 0 }, overdue: { count: 0, totalValue: 0 } };
    stats.forEach(s => { if (result[s._id]) result[s._id] = { count: s.count, totalValue: s.totalValue, totalPaid: s.totalPaid, totalDue: s.totalDue }; });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getInvoices, getInvoiceById, createInvoice, updateInvoice, sendInvoice, recordPayment, deleteInvoice, getInvoiceStats };
