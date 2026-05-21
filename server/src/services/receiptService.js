
const PDFDocument = require('pdfkit');
const { uploadToCloudinary } = require('../middleware/upload');

/**
 * Generate a PDF receipt for a booking and upload it to Cloudinary.
 * @param {object} booking - Booking data with service, stylist, client info
 * @returns {Promise<string|null>} Cloudinary URL of the PDF
 */
const generateReceiptPDF = async (booking) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('error', reject);
      doc.on('end', async () => {
        try {
          const buffer = Buffer.concat(buffers);
          const result = await uploadToCloudinary(buffer, 'glowstudio/receipts', `receipt_${booking.id}`);
          resolve(result.secure_url);
        } catch (uploadErr) {
          reject(uploadErr);
        }
      });

      // ─── PDF Design ────────────────────────────────────────────────────────
      // Header
      doc
        .fillColor('#E91E8C')
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('GlowStudio', { align: 'center' })
        .moveDown(0.2);

      doc
        .fillColor('#888888')
        .fontSize(11)
        .font('Helvetica')
        .text('Beauty Salon & Spa', { align: 'center' })
        .moveDown(0.1)
        .text('www.glowstudio.mx  |  contacto@glowstudio.mx', { align: 'center' })
        .moveDown(1.5);

      // Divider
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#FFB6C1').lineWidth(1.5).stroke();
      doc.moveDown(1);

      // Receipt title
      doc
        .fillColor('#333333')
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('COMPROBANTE DE PAGO', { align: 'center' })
        .moveDown(0.5);

      doc
        .fontSize(11)
        .font('Helvetica')
        .fillColor('#555555')
        .text(`Folio: ${booking.id}`, { align: 'center' })
        .text(`Fecha de emisión: ${new Date().toLocaleDateString('es-MX', { dateStyle: 'full' })}`, { align: 'center' })
        .moveDown(1.5);

      // Client info
      doc
        .fillColor('#E91E8C')
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('DATOS DEL CLIENTE')
        .moveDown(0.3);

      doc
        .fillColor('#333333')
        .fontSize(11)
        .font('Helvetica')
        .text(`Nombre: ${booking.client_name || 'N/A'}`)
        .text(`Email: ${booking.client_email || 'N/A'}`)
        .moveDown(1);

      // Service info
      doc
        .fillColor('#E91E8C')
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('DETALLE DEL SERVICIO')
        .moveDown(0.3);

      const apptDate = new Date(`${booking.appointment_date}T${booking.appointment_time}`);

      doc
        .fillColor('#333333')
        .fontSize(11)
        .font('Helvetica')
        .text(`Servicio: ${booking.service_name || 'N/A'}`)
        .text(`Estilista: ${booking.stylist_name || 'N/A'}`)
        .text(`Fecha: ${apptDate.toLocaleDateString('es-MX', { dateStyle: 'full' })}`)
        .text(`Hora: ${apptDate.toLocaleTimeString('es-MX', { timeStyle: 'short' })}`)
        .moveDown(1);

      // Payment info
      doc
        .fillColor('#E91E8C')
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('INFORMACIÓN DE PAGO')
        .moveDown(0.3);

      doc
        .fillColor('#333333')
        .fontSize(11)
        .font('Helvetica')
        .text(`Método: ${booking.payment_method ? booking.payment_method.toUpperCase() : 'N/A'}`)
        .text(`Estado: ${booking.payment_status === 'paid' ? 'PAGADO' : booking.payment_status}`)
        .moveDown(0.5);

      // Total
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .strokeColor('#FFB6C1')
        .lineWidth(1)
        .stroke()
        .moveDown(0.5);

      const totalAmount = parseFloat(booking.amount_paid || booking.service_price || 0).toFixed(2);
      doc
        .fillColor('#E91E8C')
        .fontSize(16)
        .font('Helvetica-Bold')
        .text(`TOTAL: $${totalAmount} MXN`, { align: 'right' })
        .moveDown(2);

      // Footer
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .strokeColor('#FFB6C1')
        .stroke()
        .moveDown(0.5);

      doc
        .fillColor('#888888')
        .fontSize(10)
        .font('Helvetica')
        .text('Gracias por su preferencia. Este comprobante es válido como recibo de pago.', { align: 'center' })
        .text('GlowStudio Beauty Salon — Donde tu belleza brilla ✨', { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateReceiptPDF };
