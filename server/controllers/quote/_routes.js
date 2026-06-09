const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const {
  getQuotes, getQuoteById, createQuote, updateQuote,
  sendQuote, respondToQuote, convertToDeal, deleteQuote, getQuoteStats,
} = require('./quote.controller');

router.get('/', auth, getQuotes);
router.get('/stats', auth, getQuoteStats);
router.get('/:id', auth, getQuoteById);
router.post('/', auth, createQuote);
router.put('/:id', auth, updateQuote);
router.put('/:id/send', auth, sendQuote);
router.put('/:id/respond', auth, respondToQuote);
router.post('/:id/convert', auth, convertToDeal);
router.delete('/:id', auth, deleteQuote);

module.exports = router;
