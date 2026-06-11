const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const { canView, canCreate, canUpdate, canDelete } = require('../../middlewares/crudRbac');
const { getInvoices, getInvoiceById, createInvoice, updateInvoice, sendInvoice, recordPayment, deleteInvoice, getInvoiceStats } = require('./invoice.controller');

router.get('/', auth, canView('Invoices'), getInvoices);
router.get('/stats', auth, canView('Invoices'), getInvoiceStats);
router.get('/:id', auth, canView('Invoices'), getInvoiceById);
router.post('/', auth, canCreate('Invoices'), createInvoice);
router.put('/:id', auth, canUpdate('Invoices'), updateInvoice);
router.put('/:id/send', auth, canUpdate('Invoices'), sendInvoice);
router.post('/:id/payment', auth, canUpdate('Invoices'), recordPayment);
router.delete('/:id', auth, canDelete('Invoices'), deleteInvoice);

module.exports = router;
