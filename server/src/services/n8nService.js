const { query } = require('../config/db');

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const WEBHOOK_TIMEOUT_MS = 10_000;

/**
 * Send a webhook to n8n with booking event data.
 * Non-blocking: logs errors but never throws to the caller.
 *
 * @param {'booking_created'|'reminder_auto'|'reminder_manual'|'payment_registered'} event
 * @param {object} booking  - Row from DB with client_*, service_name, stylist_name, etc.
 * @param {object} [extra]  - Additional fields (e.g. amount_paid, payment_method)
 */
const triggerN8n = async (event, booking, extra = {}) => {
  if (!WEBHOOK_URL) {
    console.warn('[n8n] N8N_WEBHOOK_URL no configurado — omitiendo webhook.');
    return { skipped: true };
  }

  const payload = {
    event,
    salon:     'GlowStudio',
    timestamp: new Date().toISOString(),
    client: {
      name:  booking.client_name,
      phone: booking.client_phone,
      email: booking.client_email || null,
    },
    booking: {
      id:      booking.id,
      service: booking.service_name,
      stylist: booking.stylist_name,
      date:    booking.appointment_date,
      time:    booking.appointment_time
        ? String(booking.appointment_time).substring(0, 5)
        : null,
    },
    ...extra,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const res = await fetch(WEBHOOK_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
      signal:  controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    console.log(`[n8n] Webhook "${event}" enviado OK para booking ${booking.id}`);

    // Log in notifications_log
    await query(
      `INSERT INTO notifications_log (booking_id, channel, type, status, message)
       VALUES ($1, 'whatsapp', $2, 'sent', 'Enviado vía n8n')`,
      [booking.id, event]
    ).catch(() => {});

    return { ok: true };
  } catch (err) {
    clearTimeout(timeout);
    console.error(`[n8n] Error en webhook "${event}":`, err.message);

    await query(
      `INSERT INTO notifications_log (booking_id, channel, type, status, error_message)
       VALUES ($1, 'whatsapp', $2, 'failed', $3)`,
      [booking.id, event, err.message]
    ).catch(() => {});

    throw err;
  }
};

module.exports = { triggerN8n };
