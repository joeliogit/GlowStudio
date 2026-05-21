import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Scissors, CreditCard, MessageCircle } from 'lucide-react';
import { useBookingById, useUpdateBookingStatus } from '../../hooks/useBookings';
import { formatDateFull, formatTime } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import BookingStatusBadge from '../../components/booking/BookingStatusBadge.jsx';
import PaymentValidator from '../../components/receptionist/PaymentValidator.jsx';
import WhatsAppReminder from '../../components/receptionist/WhatsAppReminder.jsx';
import { LoaderPage } from '../../components/common/Loader.jsx';
import Card from '../../components/common/Card.jsx';

export default function BookingDetail() {
  const { id } = useParams();
  const { data: booking, isLoading } = useBookingById(id);
  const { mutate: updateStatus } = useUpdateBookingStatus();

  if (isLoading) return <LoaderPage message="Cargando cita..." />;
  if (!booking) return (
    <div className="page-wrapper flex items-center justify-center">
      <p className="text-gray-400">Cita no encontrada.</p>
    </div>
  );

  const canPay = booking.payment_status !== 'paid' && booking.status !== 'cancelled';

  return (
    <div className="page-wrapper">
      <section className="bg-gradient-hero-purple py-10">
        <div className="container-app">
          <Link
            to="/reception/bookings"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a citas
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-800">Detalle de Cita</h1>
              <p className="text-xs text-gray-400 font-mono mt-1">{booking.id}</p>
            </div>
            <BookingStatusBadge status={booking.status} size="md" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-app max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-2xl border border-purple-100 shadow-card-purple p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Información de la cita</h2>
              <div className="space-y-3">
                <InfoRow icon={<User />} label="Clienta" value={booking.client_name} />
                <InfoRow icon={<Calendar />} label="Fecha" value={formatDateFull(booking.appointment_date)} />
                <InfoRow icon={<Clock />} label="Hora" value={formatTime(booking.appointment_time)} />
                <InfoRow icon={<Scissors />} label="Servicio" value={`${booking.service_name} (${booking.duration_minutes} min)`} />
                <InfoRow icon={<User />} label="Estilista" value={booking.stylist_name} />
                <InfoRow icon={<CreditCard />} label="Precio" value={formatCurrency(booking.service_price)} />
                {booking.notes && (
                  <div className="pt-2 border-t border-purple-50">
                    <p className="text-xs text-gray-400 mb-1">Notas</p>
                    <p className="text-sm text-gray-600">{booking.notes}</p>
                  </div>
                )}
              </div>

              {/* Status update */}
              <div className="mt-5 pt-4 border-t border-purple-50">
                <label className="input-label">Actualizar estado</label>
                <select
                  defaultValue={booking.status}
                  onChange={(e) => updateStatus({ id: booking.id, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all text-sm"
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="completed">Completada</option>
                  <option value="cancelled">Cancelada</option>
                  <option value="no_show">No se presentó</option>
                </select>
              </div>

              {/* WhatsApp */}
              <div className="mt-4">
                <WhatsAppReminder
                  bookingId={booking.id}
                  clientName={booking.client_name}
                  disabled={!booking.client_phone}
                />
              </div>
            </div>
          </motion.div>

          {/* Payment */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white rounded-2xl border border-purple-100 shadow-card-purple p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Pago</h2>

              {booking.payment_status === 'paid' ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="font-semibold text-green-700">Pago registrado</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {formatCurrency(booking.amount_paid)}
                  </p>
                  <p className="text-sm text-gray-400 mt-1 capitalize">{booking.payment_method}</p>
                  {booking.receipt_url && (
                    <a href={booking.receipt_url} target="_blank" rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm text-purple-600 hover:underline">
                      Ver recibo
                    </a>
                  )}
                </div>
              ) : canPay ? (
                <PaymentValidator booking={booking} />
              ) : (
                <p className="text-gray-400 text-sm text-center py-6">Pago no aplicable.</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-4 h-4 text-purple-400 flex-shrink-0">{icon}</span>
      <span className="text-gray-400 w-20 flex-shrink-0">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
