const twilioClient = require('../config/twilio');
const { TWILIO_WHATSAPP_FROM } = require('../config/env');

/**
 * Format appointment date in Spanish
 */
const formatAppointmentDate = (date, time) => {
  const d = new Date(`${date}T${time}`);
  return d.toLocaleString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Send WhatsApp reminder for an appointment
 * @param {object} booking - Booking data with client info
 * @param {string} [customMessage] - Optional custom message override
 */
const sendWhatsAppReminder = async (booking, customMessage = null) => {
  if (!twilioClient) {
    console.warn('WhatsApp not sent: Twilio client not configured.');
    return { sid: null, skipped: true };
  }

  const phone = booking.client_phone.replace(/\D/g, '');
  const toPhone = `whatsapp:+${phone.startsWith('52') ? phone : `52${phone}`}`;

  const formattedDate = formatAppointmentDate(
    booking.appointment_date,
    booking.appointment_time
  );

  const message =
    customMessage ||
    `✨ *Recordatorio GlowStudio*\n\nHola ${booking.client_name} 💕\n\nTe recordamos que tienes una cita mañana:\n\n📅 ${formattedDate}\n💆 Servicio: ${booking.service_name}\n👩‍🎨 Estilista: ${booking.stylist_name}\n\n📍 GlowStudio Beauty Salon\n\nSi necesitas reagendar, contáctanos con anticipación. ¡Te esperamos!\n\n_GlowStudio — Donde tu belleza brilla_ ✨`;

  const result = await twilioClient.messages.create({
    from: TWILIO_WHATSAPP_FROM,
    to: toPhone,
    body: message,
  });

  console.log(`WhatsApp sent to ${toPhone}, SID: ${result.sid}`);
  return result;
};

/**
 * Send WhatsApp message with receipt link after payment
 * @param {object} booking - Booking data
 * @param {string} receiptUrl - URL to the receipt PDF
 */
const sendReceiptWhatsApp = async (booking, receiptUrl) => {
  if (!twilioClient) {
    console.warn('WhatsApp not sent: Twilio client not configured.');
    return { sid: null, skipped: true };
  }

  const phone = booking.client_phone.replace(/\D/g, '');
  const toPhone = `whatsapp:+${phone.startsWith('52') ? phone : `52${phone}`}`;

  const message =
    `🧾 *Recibo de Pago — GlowStudio*\n\nHola ${booking.client_name} 💕\n\nTu pago por *${booking.service_name}* ha sido registrado correctamente.\n\n💰 Total: $${parseFloat(booking.amount_paid).toFixed(2)} MXN\n📅 Fecha: ${booking.appointment_date}\n\n📄 Descarga tu recibo aquí:\n${receiptUrl}\n\n¡Gracias por tu preferencia! ✨\n_GlowStudio Beauty Salon_`;

  const result = await twilioClient.messages.create({
    from: TWILIO_WHATSAPP_FROM,
    to: toPhone,
    body: message,
  });

  return result;
};

module.exports = { sendWhatsAppReminder, sendReceiptWhatsApp };
