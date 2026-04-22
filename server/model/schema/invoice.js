const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
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

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  method: { type: String, enum: ['cash', 'check', 'bank_transfer', 'credit_card', 'stripe'], default: 'bank_transfer' },
  reference: String,
  paidAt: { type: Date, default: Date.now },
  notes: String,
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { _id: true });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  reference: String,
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  quote: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote' },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  items: [invoiceItemSchema],
  subTotal: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  amountPaid: { type: Number, default: 0 },
  amountDue: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'sent', 'viewed', 'partially_paid', 'paid', 'overdue', 'cancelled'], default: 'draft' },
  issueDate: { type: Date, default: Date.now },
  dueDate: Date,
  sentAt: Date,
  viewedAt: Date,
  fullyPaidAt: Date,
  payments: [paymentSchema],
  notes: String,
  terms: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

invoiceSchema.index({ status: 1 });
invoiceSchema.index({ contact: 1 });
invoiceSchema.index({ dueDate: 1 });
invoiceSchema.index({ createdBy: 1 });

function applySaveNormalization(invoice) {
  if (!invoice.invoiceNumber) {
    const prefix = 'INV';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9000 + 1000);
    invoice.invoiceNumber = `${prefix}-${year}-${random}`;
  }

  let subTotal = 0;
  invoice.items.forEach(item => {
    const lineTotal = item.quantity * item.unitPrice;
    item.discountAmount = lineTotal * (item.discountPercent / 100);
    const afterDiscount = lineTotal - item.discountAmount;
    item.taxAmount = afterDiscount * (item.taxPercent / 100);
    item.total = afterDiscount + item.taxAmount;
    subTotal += item.total;
  });

  invoice.subTotal = subTotal;
  invoice.discountAmount = invoice.subTotal * (invoice.discountPercent / 100);
  invoice.grandTotal = invoice.subTotal - invoice.discountAmount + invoice.taxAmount;
  invoice.amountDue = invoice.grandTotal - invoice.amountPaid;

  if (invoice.amountPaid > 0 && invoice.amountPaid < invoice.grandTotal) {
    invoice.status = 'partially_paid';
  } else if (invoice.amountPaid >= invoice.grandTotal && invoice.grandTotal > 0) {
    invoice.status = 'paid';
    if (!invoice.fullyPaidAt) invoice.fullyPaidAt = new Date();
  }

  if (
    invoice.dueDate &&
    new Date() > invoice.dueDate &&
    invoice.status !== 'paid' &&
    invoice.status !== 'cancelled'
  ) {
    invoice.status = 'overdue';
  }
}

invoiceSchema.statics.applySaveNormalization = function applyInvoiceSaveNormalization(invoice) {
  applySaveNormalization(invoice);
  return invoice;
};

invoiceSchema.pre('save', function () {
  this.constructor.applySaveNormalization(this);
});

module.exports = mongoose.model('Invoice', invoiceSchema);
