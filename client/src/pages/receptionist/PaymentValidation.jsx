import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { useAllBookings } from '../../hooks/useBookings';
import { formatDateShort, formatTime } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import PaymentValidator from '../../components/receptionist/PaymentValidator.jsx';
import Modal from '../../components/common/Modal.jsx';
import { LoaderPage } from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';

export default function PaymentValidation() {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data, isLoading, refetch } = useAllBookings({
    status: 'confirmed',
    limit: 50,
  });

  const unpaidBookings = (data?.bookings || []).filter(
    (b) => b.payment_status !== 'paid'
  );

  if (isLoading) return <LoaderPage message="Cargando citas sin pago..." />;

  return (
    <div className="page-wrapper">
      <section className="bg-gradient-hero-purple py-10 md:py-14">
        <div className="container-app">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm font-medium">Recepción</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-gray-800">Validación de Pagos</h1>
            <p className="text-gray-500 mt-1">Registra pagos en efectivo y terminal para citas confirmadas.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container-app">
          {unpaidBookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-green-300" />
              </div>
              <p className="text-gray-400">Todas las citas tienen pago registrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unpaidBookings.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-purple-100 shadow-card-purple p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-gray-800">{b.client_name}</p>
                      <p className="text-sm text-purple-600">{b.service_name}</p>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full border">Sin pago</span>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                    <p>{formatDateShort(b.appointment_date)} · {formatTime(b.appointment_time)}</p>
                    <p>Estilista: {b.stylist_name}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-700 text-lg">{formatCurrency(b.service_price)}</span>
                    <Button size="sm" variant="purple" onClick={() => setSelectedBooking(b)}>
                      Registrar pago
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        title="Registrar Pago"
        size="sm"
      >
        <PaymentValidator
          booking={selectedBooking}
          onSuccess={() => { setSelectedBooking(null); refetch(); }}
        />
      </Modal>
    </div>
  );
}
