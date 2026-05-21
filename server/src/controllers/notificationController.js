const { query } = require('../config/db');
const { triggerN8n } = require('../services/n8nService');

// ─── Send WhatsApp to a booking (manual — receptionist) ───────────────────────
const sendWhatsApp = async (req, res, next) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ error: 'booking_id es requerido.' });
    }

    const { rows } = await query(
      `SELECT b.id, b.appointment_date, b.appointment_time,
              u.name AS client_name, u.phone AS client_phone, u.email AS client_email,
              s.name AS service_name, st.name AS stylist_name
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       JOIN services s ON s.id = b.service_id
       JOIN stylists st ON st.id = b.stylist_id
       WHERE b.id = $1`,
      [booking_id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Cita no encontrada.' });
    }

    const booking = rows[0];

    if (!booking.client_phone) {
      return res.status(400).json({ error: 'El cliente no tiene teléfono registrado.' });
    }

    await triggerN8n('reminder_manual', booking);

    res.json({ message: 'Recordatorio enviado correctamente vía n8n.' });
  } catch (err) {
    next(err);
  }
};

// ─── Get Notifications Log ────────────────────────────────────────────────────
const getNotificationsLog = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, channel, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (channel) {
      params.push(channel);
      whereClause += ` AND nl.channel = $${params.length}`;
    }
    if (status) {
      params.push(status);
      whereClause += ` AND nl.status = $${params.length}`;
    }

    params.push(parseInt(limit), offset);

    const { rows } = await query(
      `SELECT nl.id, nl.channel, nl.type, nl.status, nl.message, nl.error_message, nl.created_at,
              u.name AS user_name, u.email AS user_email,
              b.appointment_date, b.appointment_time
       FROM notifications_log nl
       LEFT JOIN users u ON u.id = nl.user_id
       LEFT JOIN bookings b ON b.id = nl.booking_id
       ${whereClause}
       ORDER BY nl.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ notifications: rows });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendWhatsApp, getNotificationsLog };
