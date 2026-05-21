const cron = require('node-cron');
const { query } = require('../config/db');
const { triggerN8n } = require('../services/n8nService');
const { sendReminderEmail } = require('../services/emailService');

/**
 * Appointment Reminder Job
 * Runs every day at 10:00 AM (Mexico City time)
 * Sends WhatsApp + email reminders for next-day appointments
 */
const startReminderJob = () => {
  // Cron: '0 10 * * *' = every day at 10:00 AM
  cron.schedule(
    '0 10 * * *',
    async () => {
      console.log(`\n[CRON] Running appointment reminder job at ${new Date().toISOString()}`);

      try {
        // Get all confirmed bookings for tomorrow that haven't been reminded
        const { rows: bookings } = await query(
          `SELECT b.id, b.appointment_date, b.appointment_time, b.reminder_sent,
                  u.name AS client_name, u.email AS client_email, u.phone AS client_phone,
                  s.name AS service_name, st.name AS stylist_name
           FROM bookings b
           JOIN users u ON u.id = b.user_id
           JOIN services s ON s.id = b.service_id
           JOIN stylists st ON st.id = b.stylist_id
           WHERE b.appointment_date = CURRENT_DATE + INTERVAL '1 day'
             AND b.status IN ('pending', 'confirmed')
             AND b.reminder_sent = false`
        );

        console.log(`[CRON] Found ${bookings.length} bookings to remind.`);

        for (const booking of bookings) {
          let whatsappSent = false;
          let emailSent = false;

          // Send WhatsApp via n8n if phone exists
          if (booking.client_phone) {
            try {
              await triggerN8n('reminder_auto', booking);
              whatsappSent = true;
            } catch (waErr) {
              console.error(`[CRON] n8n error for booking ${booking.id}:`, waErr.message);
            }
          }

          // Send email reminder
          if (booking.client_email) {
            try {
              await sendReminderEmail(
                { name: booking.client_name, email: booking.client_email },
                booking
              );
              emailSent = true;

              await query(
                `INSERT INTO notifications_log (booking_id, channel, type, status, message)
                 VALUES ($1, 'email', 'reminder_auto', 'sent', 'Email de recordatorio enviado')`,
                [booking.id]
              );
            } catch (emailErr) {
              console.error(`[CRON] Email error for booking ${booking.id}:`, emailErr.message);
            }
          }

          // Mark reminder as sent
          if (whatsappSent || emailSent) {
            await query(
              'UPDATE bookings SET reminder_sent = true, updated_at = NOW() WHERE id = $1',
              [booking.id]
            );
          }
        }

        console.log('[CRON] Reminder job completed.\n');
      } catch (err) {
        console.error('[CRON] Reminder job failed:', err.message);
      }
    },
    {
      timezone: 'America/Mexico_City',
    }
  );

  console.log('  Appointment reminder cron job scheduled (daily at 10:00 AM Mexico City)');
};

// Start the job immediately when this module is imported
startReminderJob();

module.exports = { startReminderJob };
