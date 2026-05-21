const stripe = require('../config/stripe');
const { query } = require('../config/db');

/**
 * Calculate the total amount for a booking based on service price
 * @param {string} serviceId
 * @returns {Promise<number>} Amount in MXN
 */
const getServicePrice = async (serviceId) => {
  const { rows } = await query('SELECT price FROM services WHERE id = $1', [serviceId]);
  if (!rows.length) throw new Error('Servicio no encontrado.');
  return parseFloat(rows[0].price);
};

/**
 * Create a Stripe PaymentIntent for a given amount (in MXN)
 * @param {number} amountMXN - Amount in pesos
 * @param {object} metadata - Metadata to attach
 * @returns {Promise<object>} Stripe PaymentIntent
 */
const createIntent = async (amountMXN, metadata = {}) => {
  if (!stripe) throw new Error('Stripe no está configurado.');

  const amountCents = Math.round(amountMXN * 100);

  return stripe.paymentIntents.create({
    amount: amountCents,
    currency: 'mxn',
    metadata,
    automatic_payment_methods: { enabled: true },
  });
};

/**
 * Retrieve a Stripe PaymentIntent
 * @param {string} paymentIntentId
 * @returns {Promise<object>}
 */
const retrieveIntent = async (paymentIntentId) => {
  if (!stripe) throw new Error('Stripe no está configurado.');
  return stripe.paymentIntents.retrieve(paymentIntentId);
};

/**
 * Mark a booking as paid in the database
 * @param {string} bookingId
 * @param {object} paymentData - { payment_method, amount, payment_intent_id }
 */
const markBookingPaid = async (bookingId, paymentData) => {
  const { rows } = await query(
    `UPDATE bookings
     SET payment_status = 'paid',
         payment_method = $1,
         amount_paid = $2,
         payment_intent_id = COALESCE($3, payment_intent_id),
         updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [
      paymentData.payment_method,
      paymentData.amount,
      paymentData.payment_intent_id || null,
      bookingId,
    ]
  );

  if (!rows.length) throw new Error('Cita no encontrada.');
  return rows[0];
};

/**
 * Create an order from cart items
 * @param {string} userId
 * @param {Array<{product_id, quantity, unit_price}>} items
 * @param {object} [shippingAddress]
 * @returns {Promise<object>} Created order with items
 */
const createOrder = async (userId, items, shippingAddress = null) => {
  if (!items || !items.length) throw new Error('El carrito está vacío.');

  const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  const orderResult = await query(
    `INSERT INTO orders (user_id, total, shipping_address)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, total, shippingAddress ? JSON.stringify(shippingAddress) : null]
  );

  const order = orderResult.rows[0];

  for (const item of items) {
    const subtotal = item.unit_price * item.quantity;
    await query(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
       VALUES ($1, $2, $3, $4, $5)`,
      [order.id, item.product_id, item.quantity, item.unit_price, subtotal]
    );

    // Decrease stock
    await query(
      'UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1',
      [item.quantity, item.product_id]
    );
  }

  return order;
};

module.exports = { getServicePrice, createIntent, retrieveIntent, markBookingPaid, createOrder };
