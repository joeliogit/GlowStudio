const stripe = require('../config/stripe');
const { query } = require('../config/db');
const { STRIPE_WEBHOOK_SECRET } = require('../config/env');
const { generateReceiptPDF } = require('../services/receiptService');

// ─── Create Payment Intent ────────────────────────────────────────────────────
const createPaymentIntent = async (req, res, next) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: 'Pagos con Stripe no configurados.' });
    }

    const { booking_id, amount } = req.body;

    if (!booking_id || !amount) {
      return res.status(400).json({ error: 'booking_id y amount son requeridos.' });
    }

    // Verify booking belongs to user (or user is staff)
    const bookingResult = await query(
      'SELECT id, user_id, status, payment_status FROM bookings WHERE id = $1',
      [booking_id]
    );

    if (!bookingResult.rows.length) {
      return res.status(404).json({ error: 'Cita no encontrada.' });
    }

    const booking = bookingResult.rows[0];

    if (req.user.role === 'client' && booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Acceso denegado.' });
    }

    if (booking.payment_status === 'paid') {
      return res.status(400).json({ error: 'Esta cita ya fue pagada.' });
    }

    // Amount in centavos (MXN)
    const amountInCents = Math.round(parseFloat(amount) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'mxn',
      metadata: {
        booking_id,
        user_id: req.user.id,
      },
    });

    // Save payment intent ID in booking
    await query(
      'UPDATE bookings SET payment_intent_id = $1, updated_at = NOW() WHERE id = $2',
      [paymentIntent.id, booking_id]
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Confirm Payment (manual confirmation after Stripe redirect) ─────────────
const confirmPayment = async (req, res, next) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: 'Stripe no configurado.' });
    }

    const { payment_intent_id } = req.body;

    if (!payment_intent_id) {
      return res.status(400).json({ error: 'payment_intent_id es requerido.' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: `Pago no completado. Estado: ${paymentIntent.status}` });
    }

    const bookingId = paymentIntent.metadata.booking_id;

    const { rows } = await query(
      `UPDATE bookings
       SET payment_status = 'paid', payment_method = 'stripe',
           amount_paid = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [paymentIntent.amount / 100, bookingId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Cita no encontrada.' });
    }

    const booking = rows[0];

    // Generate receipt
    try {
      const receiptUrl = await generateReceiptPDF(booking);
      if (receiptUrl) {
        await query('UPDATE bookings SET receipt_url = $1 WHERE id = $2', [receiptUrl, bookingId]);
        booking.receipt_url = receiptUrl;
      }
    } catch (receiptErr) {
      console.error('Receipt generation failed:', receiptErr.message);
    }

    res.json({ booking, message: 'Pago confirmado correctamente.' });
  } catch (err) {
    next(err);
  }
};

// ─── Stripe Webhook ───────────────────────────────────────────────────────────
const stripeWebhook = async (req, res, next) => {
  try {
    if (!stripe) {
      return res.status(503).send('Stripe no configurado.');
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        const bookingId = pi.metadata.booking_id;
        if (bookingId) {
          await query(
            `UPDATE bookings
             SET payment_status = 'paid', payment_method = 'stripe',
                 amount_paid = $1, updated_at = NOW()
             WHERE id = $2 AND payment_status != 'paid'`,
            [pi.amount / 100, bookingId]
          );
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        console.log(`Payment failed for PI: ${pi.id}`);
        break;
      }

      default:
        break;
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};

// ─── Get Receipt ──────────────────────────────────────────────────────────────
const getReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await query(
      `SELECT b.*, u.name AS client_name, u.email AS client_email,
              s.name AS service_name, s.price AS service_price,
              st.name AS stylist_name
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       JOIN services s ON s.id = b.service_id
       JOIN stylists st ON st.id = b.stylist_id
       WHERE b.id = $1`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Cita no encontrada.' });
    }

    const booking = rows[0];

    if (req.user.role === 'client' && booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Acceso denegado.' });
    }

    res.json({ receipt: booking });
  } catch (err) {
    next(err);
  }
};

module.exports = { createPaymentIntent, confirmPayment, stripeWebhook, getReceipt };
