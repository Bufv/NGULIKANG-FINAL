const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');

// Protect all chat routes
router.use(authenticate);

// Start support chat
router.post('/admin/start', chatController.startAdminChat);

// Get my rooms (User sees theirs, Admin sees all support chats)
router.get('/rooms', chatController.getChatRooms);

// Get messages for a specific room
router.get('/:roomId/messages', chatController.getMessages);

module.exports = router;
