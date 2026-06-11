const express = require('express');
const task = require('./task');
const { auth } = require('../../middlewares/auth');
const { canView, canCreate, canUpdate, canDelete } = require('../../middlewares/crudRbac');

const router = express.Router();

router.get('/', auth, canView('Tasks'), task.index)
router.post('/add', auth, canCreate('Tasks'), task.add)
router.get('/view/:id', auth, canView('Tasks'), task.view)
router.put('/edit/:id', auth, canUpdate('Tasks'), task.edit)
router.put('/changeStatus/:id', auth, canUpdate('Tasks'), task.changeStatus)
router.delete('/delete/:id', auth, canDelete('Tasks'), task.deleteData)
router.post('/deleteMany', auth, canDelete('Tasks'), task.deleteMany)

module.exports = router
