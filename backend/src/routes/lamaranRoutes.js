const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createLamaran, getMyLamaran } = require('../controllers/lamaranController');

const router = express.Router();

router.use(authenticate, authorize('user'));

router.post('/lamaran', upload.array('documents', 10), createLamaran);
router.get('/lamaran/me', getMyLamaran);

module.exports = router;
