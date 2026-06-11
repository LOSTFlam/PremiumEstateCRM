const express = require('express');
const document = require('./document');
const { auth } = require('../../middlewares/auth');
const { canView, canCreate, canUpdate, canDelete } = require('../../middlewares/crudRbac');
const { resolveUploadPath } = require('../../utils/uploadPaths');

const router = express.Router();

router.get('/', auth, canView('Documents'), document.index)
router.post('/add', auth, canCreate('Documents'), document.upload.array('files'), document.file)
router.post('/addDocumentContact', auth, canCreate('Documents'), document.upload.array('files'), document.addDocumentContact)
router.post('/addDocumentLead', auth, canCreate('Documents'), document.upload.array('files'), document.addDocumentLead)

router.get('/download/:id', auth, canView('Documents'), document.downloadFile)
router.post('/link-document/:id', auth, canUpdate('Documents'), document.LinkDocument)
router.delete('/delete/:id', auth, canDelete('Documents'), document.deleteFile)
router.use('/images', express.static(resolveUploadPath('document')));

module.exports = router
