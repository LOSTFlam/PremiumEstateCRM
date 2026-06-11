const express = require('express');
const { auth } = require('../../middlewares/auth');
const phoneCall = require('./phonCall');
const { canView, canCreate } = require('../../middlewares/crudRbac');

const router = express.Router();

router.get('/', auth, canView('Calls'), phoneCall.index)
router.get('/view/:id', auth, canView('Calls'), phoneCall.view)
router.post('/add', auth, canCreate('Calls'), phoneCall.add)

module.exports = router
