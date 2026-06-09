const mongoose = require('mongoose');

const quoteItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  description: String,
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  taxPercent: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
}, { _id: true });

const quoteSchema = new mongoose.Schema({
  quoteNumber: { type: String, unique: true },
  subject: { type: String, required: true },
  description: String,
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  workflow: { type: mongoose.Schema.Types.ObjectId, ref: 'LeadWorkflow' },
  items: [quoteItemSchema],
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  subTotal: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  adjustmentAmount: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'converted'], default: 'draft' },
  issueDate: { type: Date, default: Date.now },
  expiryDate: Date,
  acceptedAt: Date,
  rejectedAt: Date,
  notes: String,
  terms: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sentAt: Date,
  viewedAt: Date,
}, { timestamps: true });

quoteSchema.index({ status: 1 });
quoteSchema.index({ lead: 1 });
quoteSchema.index({ contact: 1 });
quoteSchema.index({ createdBy: 1 });
quoteSchema.index({ expiryDate: 1 });

function applySaveNormalization(quote) {
  if (!quote.quoteNumber) {
    const prefix = 'QT';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9000 + 1000);
    quote.quoteNumber = `${prefix}-${year}-${random}`;
  }

  let subTotal = 0;
  quote.items.forEach(item => {
    const lineTotal = item.quantity * item.unitPrice;
    item.discountAmount = lineTotal * (item.discountPercent / 100);
    const afterDiscount = lineTotal - item.discountAmount;
    item.taxAmount = afterDiscount * (item.taxPercent / 100);
    item.total = afterDiscount + item.taxAmount;
    subTotal += item.total;
  });

  quote.subTotal = subTotal;
  quote.discountAmount = quote.subTotal * (quote.discountPercent / 100);
  quote.grandTotal = quote.subTotal - quote.discountAmount + quote.taxAmount + quote.adjustmentAmount;

  if (quote.expiryDate && new Date() > quote.expiryDate && quote.status === 'sent') {
    quote.status = 'expired';
  }
}

quoteSchema.statics.applySaveNormalization = function applyQuoteSaveNormalization(quote) {
  applySaveNormalization(quote);
  return quote;
};

quoteSchema.pre('save', function () {
  this.constructor.applySaveNormalization(this);
});

module.exports = mongoose.model('Quote', quoteSchema);
