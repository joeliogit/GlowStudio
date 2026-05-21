const express = require('express');
const router = express.Router();
const { sendWhatsApp, getNotificationsLog } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// POST /api/notifications/whatsapp
router.post('/whatsapp', protect, requireRole('receptionist', 'admin'), sendWhatsApp);

// GET /api/notifications/log
router.get('/log', protect, requireRole('admin'), getNotificationsLog);

module.exports = router;
