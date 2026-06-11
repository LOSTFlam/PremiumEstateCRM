const express = require('express');
const { auth } = require('../../middlewares/auth');
const opportunities = require('./opportunities');
const { canView, canCreate, canUpdate, canDelete } = require('../../middlewares/crudRbac');

const router = express.Router();

router.get('/', auth, canView('Opportunities'), opportunities.index)
router.get('/view/:id', auth, canView('Opportunities'), opportunities.view)
router.post('/add', auth, canCreate('Opportunities'), opportunities.add)
router.post('/addMany', auth, canCreate('Opportunities'), opportunities.addMany)
router.put('/edit/:id', auth, canUpdate('Opportunities'), opportunities.edit)
router.delete('/delete/:id', auth, canDelete('Opportunities'), opportunities.deleteData)
router.post('/deleteMany', auth, canDelete('Opportunities'), opportunities.deleteMany)

module.exports = router
