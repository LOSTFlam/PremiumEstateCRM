const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const { getNotifications, markAsRead, markAllAsRead, getUnreadCount, deleteNotification } = require('./notification.controller');

router.get('/', auth, getNotifications);
router.get('/unread-count', auth, getUnreadCount);
router.put('/:id/read', auth, markAsRead);
router.put('/read-all', auth, markAllAsRead);
router.delete('/:id', auth, deleteNotification);

module.exports = router;
