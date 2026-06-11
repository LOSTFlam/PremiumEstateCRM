const express = require('express');
const { auth } = require('../../middlewares/auth');
const email = require('./email');
const { canView, canCreate } = require('../../middlewares/crudRbac');

const router = express.Router();

router.get('/', auth, canView('Emails'), email.index)
router.get('/view/:id', auth, canView('Emails'), email.view)
router.post('/add', auth, canCreate('Emails'), email.add)

module.exports = router
