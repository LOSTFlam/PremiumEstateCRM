const express = require('express');
const { auth } = require('../../middlewares/auth');
const meeting = require('./meeting');
const { canView, canCreate, canDelete } = require('../../middlewares/crudRbac');

const router = express.Router();

router.get('/', auth, canView('Meetings'), meeting.index)
router.get('/view/:id', auth, canView('Meetings'), meeting.view)
router.post('/add', auth, canCreate('Meetings'), meeting.add)
router.delete('/delete/:id', auth, canDelete('Meetings'), meeting.deleteData)
router.post('/deleteMany', auth, canDelete('Meetings'), meeting.deleteMany)

module.exports = router
