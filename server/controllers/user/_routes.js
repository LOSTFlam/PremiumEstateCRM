const express = require('express');
const user = require('./user');
const preferences = require('./preferences');
const { avatarUpload } = require('./avatarUpload');
const { resolveUploadPath } = require('../../utils/uploadPaths');
const { auth, authorize, optionalAuth } = require('../../middlewares/auth');
const { userValidation } = require("../../middlewares/validation");
const { rateLimiter } = require('../../middlewares/rateLimiter');

const router = express.Router();

router.use('/avatar', express.static(resolveUploadPath('avatars')));

router.post('/admin-register', rateLimiter('register'), userValidation.adminRegister, user.adminRegister)
router.get('/', auth, user.index)
router.post('/register', rateLimiter('register'), userValidation.register, user.register)
router.get('/session', optionalAuth, user.session)
router.get('/me', auth, preferences.getMe)
router.put('/me', auth, preferences.updateMe)
router.get('/preferences', auth, preferences.getPreferences)
router.put('/preferences', auth, preferences.updatePreferences)
router.post('/avatar', auth, rateLimiter('api'), avatarUpload.single('avatar'), preferences.updateAvatar)
router.delete('/avatar', auth, preferences.deleteAvatar)
router.get('/inquiries', auth, preferences.getInquiries)
router.post('/login', rateLimiter('login'), userValidation.login, user.login)
router.post('/logout', auth, user.logout)
router.post('/refresh-token', rateLimiter('refresh'), user.refreshToken)
router.post('/change-password', rateLimiter('passwordChange'), auth, user.changePassword)
router.post('/deleteMany', auth, user.deleteMany)
router.get('/view/:id', auth, user.view)
router.delete('/delete/:id', auth, user.deleteData)
router.put('/edit/:id', auth, user.edit)
router.put('/change-roles/:id', auth, authorize('superAdmin'), user.changeRoles)
router.put('/block/:id', auth, authorize('superAdmin'), user.blockUser)
router.put('/unblock/:id', auth, authorize('superAdmin'), user.unblockUser)



module.exports = router
