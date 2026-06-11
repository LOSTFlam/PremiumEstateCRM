const express = require('express');
const { auth } = require('../../middlewares/auth');
const account = require('./account');
const { canView, canCreate, canUpdate, canDelete } = require('../../middlewares/crudRbac');

const router = express.Router();

router.get('/', auth, canView('Account'), account.index)
router.get('/view/:id', auth, canView('Account'), account.view)
router.post('/add', auth, canCreate('Account'), account.add)
router.post('/addMany', auth, canCreate('Account'), account.addMany)
router.put('/edit/:id', auth, canUpdate('Account'), account.edit)
router.delete('/delete/:id', auth, canDelete('Account'), account.deleteData)
router.post('/deleteMany', auth, canDelete('Account'), account.deleteMany)

module.exports = router
