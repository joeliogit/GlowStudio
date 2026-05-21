import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { useMyBookings, useCancelBooking } from '../../hooks/useBookings';
import BookingCard from '../../components/booking/BookingCard.jsx';
import { LoaderPage } from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';

export default function MyBookings() {
  const { data: bookings = [], isLoading } = useMyBookings();
  const { mutate: cancel } = useCancelBooking();

  const upcoming = bookings.filter((b) =>
    ['pending', 'confirmed'].includes(b.status)
  );
  const past = bookings.filter((b) =>
    ['completed', 'cancelled', 'no_show'].includes(b.status)
  );

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section className="bg-gradient-hero py-12 md:py-16">
        <div className="container-app">
          <div className="flex items-center justify-between">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="section-subtitle">Tu historial</p>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800">Mis Citas</h1>
            </motion.div>
            <Link to="/booking">
              <Button leftIcon={<Plus className="w-4 h-4" />}>Nueva cita</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-app">
          {isLoading ? (
            <LoaderPage message="Cargando tus citas..." />
          ) : bookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-pink-300" />
              </div>
              <p className="text-gray-500 mb-4">Aún no tienes citas agendadas.</p>
              <Link to="/booking">
                <Button>Agendar mi primera cita</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              {upcoming.length > 0 && (
                <div>
                  <h2 className="font-semibold text-gray-700 text-lg mb-4">Próximas citas ({upcoming.length})</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcoming.map((b) => (
                      <BookingCard
                        key={b.id}
                        booking={b}
                        onCancel={cancel}
                      />
                    ))}
                  </div>
                </div>
              )}

              {past.length > 0 && (
                <div>
                  <h2 className="font-semibold text-gray-500 text-lg mb-4">Historial ({past.length})</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-80">
                    {past.map((b) => (
                      <BookingCard
                        key={b.id}
                        booking={b}
                        showActions={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
