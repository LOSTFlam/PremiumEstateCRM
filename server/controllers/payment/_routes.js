const express = require('express');
const payment = require('./payment');
const { auth, authorize } = require('../../middlewares/auth');

const router = express.Router();

router.post('/add', auth, authorize('superAdmin', 'user'), payment.add);
router.get('/', auth, authorize('superAdmin', 'user'), payment.index);

module.exports = router;
