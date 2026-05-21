const nodemailer = require('nodemailer');
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = require('../config/env');

const createTransporter = () => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn('Email not configured: EMAIL_USER or EMAIL_PASS missing.');
    return null;
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
};

/**
 * Send booking confirmation email
 * @param {object} user - { name, email, phone }
 * @param {object} booking - Booking data
 */
const sendConfirmationEmail = async (user, booking) => {
  const transporter = createTransporter();
  if (!transporter) return;

  const apptDate = new Date(`${booking.appointment_date}T${booking.appointment_time}`);
  const formattedDate = apptDate.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = apptDate.toLocaleTimeString('es-MX', { timeStyle: 'short' });

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmación de Cita — GlowStudio</title>
</head>
<body style="margin:0;padding:0;background:#FFF0F5;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF0F5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(233,30,140,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#E91E8C,#FFB6C1);padding:40px 40px 30px;text-align:center;">
              <h1 style="color:#FFFFFF;font-size:32px;margin:0;letter-spacing:-0.5px;">GlowStudio</h1>
              <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:8px 0 0;">Beauty Salon &amp; Spa</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#333333;font-size:22px;margin:0 0 8px;">¡Cita Confirmada! 🎉</h2>
              <p style="color:#555555;font-size:15px;margin:0 0 24px;">Hola <strong>${user.name}</strong>, tu cita ha sido registrada correctamente.</p>

              <div style="background:#FFF0F5;border-radius:12px;padding:24px;margin:0 0 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:6px 0;">
                      <span style="color:#888888;font-size:13px;display:block;">Fecha</span>
                      <strong style="color:#333333;font-size:15px;">${formattedDate}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;">
                      <span style="color:#888888;font-size:13px;display:block;">Hora</span>
                      <strong style="color:#333333;font-size:15px;">${formattedTime}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;">
                      <span style="color:#888888;font-size:13px;display:block;">Folio</span>
                      <strong style="color:#E91E8C;font-size:13px;font-family:monospace;">${booking.id}</strong>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="color:#555555;font-size:14px;margin:0 0 8px;">Si necesitas cancelar o reagendar, hazlo con al menos 24 horas de anticipación.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#FFF0F5;padding:24px 40px;text-align:center;">
              <p style="color:#888888;font-size:13px;margin:0;">GlowStudio — Donde tu belleza brilla ✨</p>
              <p style="color:#BBBBBB;font-size:12px;margin:8px 0 0;">www.glowstudio.mx | contacto@glowstudio.mx</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"GlowStudio" <${EMAIL_USER}>`,
    to: user.email,
    subject: '¡Tu cita en GlowStudio está confirmada! ✨',
    html,
  });

  console.log(`Confirmation email sent to: ${user.email}`);
};

/**
 * Send reminder email
 */
const sendReminderEmail = async (user, booking) => {
  const transporter = createTransporter();
  if (!transporter) return;

  const apptDate = new Date(`${booking.appointment_date}T${booking.appointment_time}`);
  const formattedDate = apptDate.toLocaleDateString('es-MX', { dateStyle: 'full' });
  const formattedTime = apptDate.toLocaleTimeString('es-MX', { timeStyle: 'short' });

  await transporter.sendMail({
    from: `"GlowStudio" <${EMAIL_USER}>`,
    to: user.email,
    subject: 'Recordatorio: Tu cita en GlowStudio es mañana 💕',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;background:#FFF0F5;padding:32px;border-radius:16px;">
        <h2 style="color:#E91E8C;">¡Tu cita es mañana! 💅</h2>
        <p>Hola <strong>${user.name}</strong>, te recordamos tu próxima cita:</p>
        <p><strong>Fecha:</strong> ${formattedDate}</p>
        <p><strong>Hora:</strong> ${formattedTime}</p>
        <p><strong>Servicio:</strong> ${booking.service_name || ''}</p>
        <p><strong>Estilista:</strong> ${booking.stylist_name || ''}</p>
        <hr style="border-color:#FFB6C1;" />
        <p style="color:#888888;font-size:13px;">GlowStudio — Donde tu belleza brilla ✨</p>
      </div>
    `,
  });
};

module.exports = { sendConfirmationEmail, sendReminderEmail };
