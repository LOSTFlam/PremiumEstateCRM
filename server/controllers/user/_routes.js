const express = require('express');
const user = require('./user');
const { auth, authorize } = require('../../middlewares/auth');
const { userValidation } = require("../../middlewares/validation");
const { rateLimiter } = require('../../middlewares/rateLimiter');

const router = express.Router();

router.post('/admin-register', rateLimiter('register'), userValidation.adminRegister, user.adminRegister)
router.get('/', auth, user.index)
router.post('/register', rateLimiter('register'), userValidation.register, user.register)
router.get('/session', auth, user.session)
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
