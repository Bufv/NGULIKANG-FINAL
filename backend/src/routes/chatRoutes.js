const express = require('express');
const { authenticate } = require('../middleware/auth');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.use(authenticate);

router.get('/rooms', chatController.getChatRooms);
router.get('/rooms/:roomId/messages', chatController.getMessages);
router.post('/support', chatController.startAdminChat);
router.put('/rooms/:roomId/close', chatController.closeChat);

module.exports = router;
