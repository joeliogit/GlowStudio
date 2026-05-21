import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, Package, Clock, CheckCircle2 } from 'lucide-react';
import { useTodayBookings } from '../../hooks/useBookings';
import { formatTime } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import BookingStatusBadge from '../../components/booking/BookingStatusBadge.jsx';
import { useAuth } from '../../hooks/useAuth';

export default function ReceptionDashboard() {
  const { user } = useAuth();
  const { data: todayBookings = [], isLoading } = useTodayBookings();

  const stats = {
    total: todayBookings.length,
    confirmed: todayBookings.filter((b) => b.status === 'confirmed').length,
    pending: todayBookings.filter((b) => b.status === 'pending').length,
    paid: todayBookings.filter((b) => b.payment_status === 'paid').length,
  };

  const quickLinks = [
    { to: '/reception/bookings', label: 'Gestionar Citas', icon: <Calendar className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' },
    { to: '/reception/payments', label: 'Validar Pagos', icon: <CreditCard className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
    { to: '/reception/stock', label: 'Control de Stock', icon: <Package className="w-5 h-5" />, color: 'bg-violet-50 text-violet-600' },
  ];

  return (
    <div className="page-wrapper">
      <section className="bg-gradient-hero-purple py-10 md:py-14">
        <div className="container-app">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm text-purple-600 font-medium mb-1">Recepción</p>
            <h1 className="font-serif text-3xl font-bold text-gray-800">
              Bienvenida, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-gray-500 mt-1">
              {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container-app space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Citas hoy', value: stats.total, icon: <Calendar className="w-5 h-5" />, color: 'text-purple-600 bg-purple-100' },
              { label: 'Confirmadas', value: stats.confirmed, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-green-600 bg-green-50' },
              { label: 'Pendientes', value: stats.pending, icon: <Clock className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50' },
              { label: 'Pagadas', value: stats.paid, icon: <CreditCard className="w-5 h-5" />, color: 'text-violet-600 bg-violet-50' },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-purple-100 shadow-card-purple p-5"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                  {s.icon}
                </div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-sm text-gray-400 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-purple-100 shadow-card-purple hover:shadow-card-purple-hover hover:-translate-y-1 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${link.color}`}>
                  {link.icon}
                </div>
                <span className="font-medium text-gray-700">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Today's schedule */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 text-lg">Agenda de Hoy</h2>
              <Link to="/reception/bookings" className="text-sm text-purple-600 hover:underline">
                Ver todas
              </Link>
            </div>

            {isLoading ? (
              <p className="text-gray-400 text-sm">Cargando agenda...</p>
            ) : todayBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-purple-100 shadow-card-purple p-8 text-center">
                <p className="text-gray-400">No hay citas agendadas para hoy.</p>
                <Link to="/reception/bookings" className="mt-3 inline-block text-sm text-purple-600 hover:underline font-medium">
                  Ver todas las citas →
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-purple-100 shadow-card-purple overflow-hidden">
                <div className="divide-y divide-purple-50">
                  {todayBookings.map((b) => (
                    <Link
                      key={b.id}
                      to={`/reception/bookings/${b.id}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-purple-50/50 transition-colors"
                    >
                      <div className="text-center w-14 flex-shrink-0">
                        <p className="font-bold text-purple-600 text-base">{formatTime(b.appointment_time)}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{b.client_name}</p>
                        <p className="text-sm text-gray-400 truncate">{b.service_name} · {b.stylist_name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookingStatusBadge status={b.status} size="xs" />
                        {b.payment_status === 'paid' && (
                          <span className="text-xs text-green-600 font-medium">✓ Pagado</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
