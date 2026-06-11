const express = require('express');
const lead = require('./lead');
const { auth } = require('../../middlewares/auth');
const { rateLimiter } = require('../../middlewares/rateLimiter');
const { canView, canCreate, canUpdate, canDelete } = require('../../middlewares/crudRbac');

const router = express.Router();

router.post('/public-inquiry', rateLimiter('register'), lead.publicInquiry)
router.post('/create', rateLimiter('register'), lead.publicInquiry)
router.get('/', auth, canView('Leads'), lead.index)
router.post('/add', auth, canCreate('Leads'), lead.add)
router.post('/addMany', auth, canCreate('Leads'), lead.addMany)
router.get('/view/:id', auth, canView('Leads'), lead.view)
router.put('/edit/:id', auth, canUpdate('Leads'), lead.edit)
router.put('/changeStatus/:id', auth, canUpdate('Leads'), lead.changeStatus)
router.delete('/delete/:id', auth, canDelete('Leads'), lead.deleteData)
router.post('/deleteMany', auth, canDelete('Leads'), lead.deleteMany)

module.exports = router
