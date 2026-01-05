const express = require('express');
const { register, login, refresh, logout, me } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', authLimiter, refresh);
router.post('/logout', authLimiter, logout);
router.get('/me', authenticate, me);
const upload = require('../middleware/upload');
const { updateProfile } = require('../controllers/authController');
router.put('/profile', authenticate, upload.single('avatar'), updateProfile);

module.exports = router;
