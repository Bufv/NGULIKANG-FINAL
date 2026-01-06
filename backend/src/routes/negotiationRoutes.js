const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const negotiationController = require('../controllers/negotiationController');

// Route untuk memulai negosiasi (User)
// Endpoint: POST /api/negotiation/start
router.post('/start', authenticate, negotiationController.startNegotiation);

// Route untuk mengambil daftar negosiasi (User & Tukang)
// Endpoint: GET /api/negotiation/rooms
router.get('/rooms', authenticate, negotiationController.getMyNegotiations);

// Route untuk mengambil pesan spesifik room
// Endpoint: GET /api/negotiation/messages/:roomId
router.get('/messages/:roomId', authenticate, negotiationController.getNegotiationMessages);

// Route untuk kirim pesan - TEMPORARILY WITHOUT AUTH FOR DEBUGGING
// Endpoint: POST /api/negotiation/messages/:roomId
router.post('/messages/:roomId', negotiationController.sendNegotiationMessage);

// Route untuk ambil daftar tukang (untuk mapping ID di frontend)
// Endpoint: GET /api/negotiation/tukangs
router.get('/tukangs', authenticate, negotiationController.getAvailableTukangs);

module.exports = router;
