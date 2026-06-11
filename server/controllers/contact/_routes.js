const express = require('express');
const contact = require('./contact');
const { auth } = require('../../middlewares/auth');
const { canView, canCreate, canUpdate, canDelete } = require('../../middlewares/crudRbac');

const router = express.Router();

router.get('/', auth, canView('Contacts'), contact.index)
router.post('/add', auth, canCreate('Contacts'), contact.add)
router.post('/addMany', auth, canCreate('Contacts'), contact.addMany)
router.post('/add-property-interest/:id', auth, canUpdate('Contacts'), contact.addPropertyInterest)
router.get('/view/:id', auth, canView('Contacts'), contact.view)
router.put('/edit/:id', auth, canUpdate('Contacts'), contact.edit)
router.delete('/delete/:id', auth, canDelete('Contacts'), contact.deleteData)
router.post('/deleteMany', auth, canDelete('Contacts'), contact.deleteMany)

module.exports = router
