const express = require('express');
const router = express.Router();
const { googleAuth, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/google  (único método de acceso — verifica el id_token de Google)
router.post('/google', googleAuth);

// GET /api/auth/me  (requires auth)
router.get('/me', protect, getMe);

// POST /api/auth/logout
router.post('/logout', protect, logout);

module.exports = router;
