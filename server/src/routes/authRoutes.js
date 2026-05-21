const express = require('express');
const router = express.Router();
const { register, login, googleAuth, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/google  (Sign in with Google — verifica el id_token)
router.post('/google', googleAuth);

// GET /api/auth/me  (requires auth)
router.get('/me', protect, getMe);

// POST /api/auth/logout
router.post('/logout', protect, logout);

module.exports = router;
