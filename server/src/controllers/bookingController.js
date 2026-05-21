const { query, withTransaction } = require('../config/db');
const { triggerN8n } = require('../services/n8nService');
const { sendConfirmationEmail } = require('../services/emailService');

// ─── Client: Get My Bookings ──────────────────────────────────────────────────
const getMyBookings = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT b.id, b.appointment_date, b.appointment_time, b.status,
              b.payment_status, b.payment_method, b.amount_paid, b.notes,
              b.receipt_url, b.created_at,
              s.name AS service_name, s.category AS service_category, s.duration_minutes,
              st.name AS stylist_name, st.photo_url AS stylist_photo
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       JOIN stylists st ON st.id = b.stylist_id
       WHERE b.user_id = $1
       ORDER BY b.appointment_date DESC, b.appointment_time DESC`,
      [req.user.id]
    );
    res.json({ bookings: rows });
  } catch (err) {
    next(err);
  }
};

// ─── Client: Create Booking ───────────────────────────────────────────────────
const createBooking = async (req, res, next) => {
  try {
    const { service_id, stylist_id, appointment_date, appointment_time, notes } = req.body;

    if (!service_id || !stylist_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: 'Servicio, estilista, fecha y hora son requeridos.' });
    }

    // Check stylist exists
    const stylistCheck = await query('SELECT id, name FROM stylists WHERE id = $1 AND is_active = true', [stylist_id]);
    if (!stylistCheck.rows.length) {
      return res.status(404).json({ error: 'Estilista no encontrada.' });
    }

    // Check service exists
    const serviceCheck = await query('SELECT id, price, name FROM services WHERE id = $1 AND is_active = true', [service_id]);
    if (!serviceCheck.rows.length) {
      return res.status(404).json({ error: 'Servicio no encontrado.' });
    }

    // Check for conflicts (same stylist, date, time)
    const conflict = await query(
      `SELECT id FROM bookings
       WHERE stylist_id = $1 AND appointment_date = $2 AND appointment_time = $3
         AND status NOT IN ('cancelled', 'no_show')`,
      [stylist_id, appointment_date, appointment_time]
    );
    if (conflict.rows.length) {
      return res.status(409).json({ error: 'La estilista ya tiene una cita en ese horario.' });
    }

    const { rows } = await query(
      `INSERT INTO bookings (user_id, service_id, stylist_id, appointment_date, appointment_time, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, service_id, stylist_id, appointment_date, appointment_time, notes || null]
    );

    const booking = rows[0];

    // Get user info for notifications
    const userResult = await query('SELECT name, email, phone FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length) {
      const user = userResult.rows[0];

      // Send confirmation email (non-blocking)
      sendConfirmationEmail(user, booking).catch(console.error);

      // Trigger n8n webhook for WhatsApp confirmation
      if (user.phone) {
        triggerN8n('booking_created', {
          id:              booking.id,
          client_name:     user.name,
          client_phone:    user.phone,
          client_email:    user.email,
          appointment_date: booking.appointment_date,
          appointment_time: booking.appointment_time,
          service_name:    serviceCheck.rows[0].name,
          stylist_name:    stylistCheck.rows[0].name,
        }).catch(console.error);
      }
    }

    res.status(201).json({ booking });
  } catch (err) {
    next(err);
  }
};

// ─── Client: Cancel My Booking ────────────────────────────────────────────────
const cancelMyBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bookingCheck = await query(
      'SELECT id, status, user_id FROM bookings WHERE id = $1',
      [id]
    );

    if (!bookingCheck.rows.length) {
      return res.status(404).json({ error: 'Cita no encontrada.' });
    }

    const booking = bookingCheck.rows[0];

    if (booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'No puedes cancelar esta cita.' });
    }

    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ error: `La cita ya está ${booking.status}.` });
    }

    const { rows } = await query(
      `UPDATE bookings SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );

    res.json({ booking: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── Receptionist/Admin: Get All Bookings ─────────────────────────────────────
const getAllBookings = async (req, res, next) => {
  try {
    const { date, status, stylist_id, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (date) {
      params.push(date);
      whereClause += ` AND b.appointment_date = $${params.length}`;
    }
    if (status) {
      params.push(status);
      whereClause += ` AND b.status = $${params.length}`;
    }
    if (stylist_id) {
      params.push(stylist_id);
      whereClause += ` AND b.stylist_id = $${params.length}`;
    }

    params.push(parseInt(limit), offset);

    const { rows } = await query(
      `SELECT b.id, b.appointment_date, b.appointment_time, b.status,
              b.payment_status, b.payment_method, b.amount_paid, b.notes,
              b.receipt_url, b.created_at, b.reminder_sent,
              u.name AS client_name, u.email AS client_email, u.phone AS client_phone,
              s.name AS service_name, s.price AS service_price, s.duration_minutes,
              st.name AS stylist_name, st.photo_url AS stylist_photo
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       JOIN services s ON s.id = b.service_id
       JOIN stylists st ON st.id = b.stylist_id
       ${whereClause}
       ORDER BY b.appointment_date DESC, b.appointment_time DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    // Total count
    const countParams = params.slice(0, params.length - 2);
    const countResult = await query(
      `SELECT COUNT(*) FROM bookings b ${whereClause}`,
      countParams
    );

    res.json({
      bookings: rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    next(err);
  }
};

// ─── Receptionist: Get Today's Bookings ───────────────────────────────────────
const getTodayBookings = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT b.id, b.appointment_date, b.appointment_time, b.status,
              b.payment_status, b.payment_method, b.amount_paid,
              u.name AS client_name, u.phone AS client_phone,
              s.name AS service_name, s.price AS service_price, s.duration_minutes,
              st.name AS stylist_name
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       JOIN services s ON s.id = b.service_id
       JOIN stylists st ON st.id = b.stylist_id
       WHERE b.appointment_date = CURRENT_DATE
         AND b.status NOT IN ('cancelled', 'no_show')
       ORDER BY b.appointment_time ASC`
    );

    res.json({ bookings: rows });
  } catch (err) {
    next(err);
  }
};

// ─── Get Booking By ID ────────────────────────────────────────────────────────
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await query(
      `SELECT b.*,
              u.name AS client_name, u.email AS client_email, u.phone AS client_phone,
              s.name AS service_name, s.price AS service_price, s.duration_minutes,
              s.category AS service_category,
              st.name AS stylist_name, st.photo_url AS stylist_photo, st.specialty
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

    // Clients can only see their own bookings
    if (req.user.role === 'client' && rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Acceso denegado.' });
    }

    res.json({ booking: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── Receptionist/Admin: Update Booking Status ───────────────────────────────
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido.' });
    }

    const { rows } = await query(
      `UPDATE bookings SET status = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Cita no encontrada.' });
    }

    res.json({ booking: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── Receptionist: Update Booking Payment ────────────────────────────────────
const updateBookingPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { payment_method, amount_paid, payment_status } = req.body;

    const allowed_methods = ['cash', 'terminal', 'stripe'];
    if (payment_method && !allowed_methods.includes(payment_method)) {
      return res.status(400).json({ error: 'Método de pago inválido.' });
    }

    const { rows } = await query(
      `UPDATE bookings
       SET payment_method = COALESCE($1, payment_method),
           amount_paid = COALESCE($2, amount_paid),
           payment_status = COALESCE($3, payment_status),
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [payment_method || null, amount_paid || null, payment_status || null, id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Cita no encontrada.' });
    }

    const updatedBooking = rows[0];

    // Trigger n8n when payment is confirmed
    if (updatedBooking.payment_status === 'paid') {
      const fullBooking = await query(
        `SELECT b.id, b.appointment_date, b.appointment_time,
                b.payment_method, b.amount_paid,
                u.name AS client_name, u.phone AS client_phone, u.email AS client_email,
                s.name AS service_name, st.name AS stylist_name
         FROM bookings b
         JOIN users u ON u.id = b.user_id
         JOIN services s ON s.id = b.service_id
         JOIN stylists st ON st.id = b.stylist_id
         WHERE b.id = $1`, [id]
      );
      if (fullBooking.rows.length && fullBooking.rows[0].client_phone) {
        triggerN8n('payment_registered', fullBooking.rows[0], {
          amount_paid:    updatedBooking.amount_paid,
          payment_method: updatedBooking.payment_method,
        }).catch(console.error);
      }
    }

    res.json({ booking: updatedBooking });
  } catch (err) {
    next(err);
  }
};

// ─── Send Booking Reminder ────────────────────────────────────────────────────
const sendBookingReminder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await query(
      `SELECT b.id, b.appointment_date, b.appointment_time,
              u.name AS client_name, u.phone AS client_phone,
              s.name AS service_name, st.name AS stylist_name
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

    if (!booking.client_phone) {
      return res.status(400).json({ error: 'El cliente no tiene número de teléfono registrado.' });
    }

    await triggerN8n('reminder_manual', booking);

    await query('UPDATE bookings SET reminder_sent = true WHERE id = $1', [id]);

    res.json({ message: 'Recordatorio enviado correctamente vía n8n.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyBookings,
  createBooking,
  cancelMyBooking,
  getAllBookings,
  getTodayBookings,
  getBookingById,
  updateBookingStatus,
  updateBookingPayment,
  sendBookingReminder,
};
