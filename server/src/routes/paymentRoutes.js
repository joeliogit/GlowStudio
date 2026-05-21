const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  stripeWebhook,
  getReceipt,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/payments/webhook  (raw body — mounted before express.json in app.js)
router.post('/webhook', stripeWebhook);

// POST /api/payments/create-intent
router.post('/create-intent', protect, createPaymentIntent);

// POST /api/payments/confirm
router.post('/confirm', protect, confirmPayment);

// GET /api/payments/receipt/:id
router.get('/receipt/:id', protect, getReceipt);

module.exports = router;
