const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const { getInvoices, getInvoiceById, createInvoice, updateInvoice, sendInvoice, recordPayment, deleteInvoice, getInvoiceStats } = require('./invoice.controller');

router.get('/', auth, getInvoices);
router.get('/stats', auth, getInvoiceStats);
router.get('/:id', auth, getInvoiceById);
router.post('/', auth, createInvoice);
router.put('/:id', auth, updateInvoice);
router.put('/:id/send', auth, sendInvoice);
router.post('/:id/payment', auth, recordPayment);
router.delete('/:id', auth, deleteInvoice);

module.exports = router;
