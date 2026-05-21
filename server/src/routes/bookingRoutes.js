const express = require('express');
const router = express.Router();
const {
  getMyBookings,
  createBooking,
  cancelMyBooking,
  getAllBookings,
  getTodayBookings,
  getBookingById,
  updateBookingStatus,
  updateBookingPayment,
  sendBookingReminder,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// ─── Client routes ─────────────────────────────────────────────────────────────
// GET /api/bookings/my
router.get('/my', protect, requireRole('client'), getMyBookings);

// POST /api/bookings
router.post('/', protect, requireRole('client'), createBooking);

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', protect, requireRole('client'), cancelMyBooking);

// ─── Receptionist/Admin routes ─────────────────────────────────────────────────
// GET /api/bookings  (all bookings with filters)
router.get('/', protect, requireRole('receptionist', 'admin'), getAllBookings);

// GET /api/bookings/today
router.get('/today', protect, requireRole('receptionist', 'admin'), getTodayBookings);

// PATCH /api/bookings/:id/status
router.patch('/:id/status', protect, requireRole('receptionist', 'admin'), updateBookingStatus);

// PATCH /api/bookings/:id/payment
router.patch('/:id/payment', protect, requireRole('receptionist', 'admin'), updateBookingPayment);

// POST /api/bookings/:id/reminder
router.post('/:id/reminder', protect, requireRole('receptionist', 'admin'), sendBookingReminder);

// GET /api/bookings/:id  (client can only access own booking)
router.get('/:id', protect, getBookingById);

module.exports = router;
