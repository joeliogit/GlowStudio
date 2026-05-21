import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAllBookings, useUpdateBookingStatus } from '../../hooks/useBookings';
import { formatDateShort, formatTime } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import BookingStatusBadge from '../booking/BookingStatusBadge.jsx';
import Button from '../common/Button.jsx';
import Loader from '../common/Loader.jsx';

export default function BookingManagerTable() {
  const [filters, setFilters] = useState({ date: '', status: '', page: 1 });
  const { data, isLoading } = useAllBookings({
    date: filters.date || undefined,
    status: filters.status || undefined,
    page: filters.page,
    limit: 15,
  });
  const { mutate: updateStatus } = useUpdateBookingStatus();

  const bookings = data?.bookings || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 15);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value, page: 1 }))}
          className="px-4 py-2.5 rounded-xl border border-purple-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all max-w-xs"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))}
          className="px-4 py-2.5 rounded-xl border border-purple-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all max-w-[180px]"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmada</option>
          <option value="completed">Completada</option>
          <option value="cancelled">Cancelada</option>
          <option value="no_show">No se presentó</option>
        </select>
        {(filters.date || filters.status) && (
          <Button
            variant="purple-outline"
            size="sm"
            onClick={() => setFilters({ date: '', status: '', page: 1 })}
          >
            Limpiar
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-card-purple overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-purple-50 border-b border-purple-100">
                {['Clienta', 'Servicio', 'Estilista', 'Fecha', 'Hora', 'Estado', 'Pago', 'Acciones'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-purple-700 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {isLoading && (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <Loader className="mx-auto" />
                  </td>
                </tr>
              )}
              {!isLoading && bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No se encontraron citas.
                  </td>
                </tr>
              )}
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-purple-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800">{b.client_name}</p>
                      <p className="text-xs text-gray-400">{b.client_phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700">{b.service_name}</p>
                    <p className="text-xs text-gray-400">{b.duration_minutes} min</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{b.stylist_name}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatDateShort(b.appointment_date)}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatTime(b.appointment_time)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus({ id: b.id, status: e.target.value })}
                      className="text-xs border border-purple-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-300 bg-white"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmada</option>
                      <option value="completed">Completada</option>
                      <option value="cancelled">Cancelada</option>
                      <option value="no_show">No se presentó</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {b.payment_status === 'paid' ? (
                      <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                        Pagado {b.amount_paid && `· ${formatCurrency(b.amount_paid)}`}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full border">
                        Sin pago
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/reception/bookings/${b.id}`}
                      className="p-1.5 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors inline-flex"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-purple-50">
            <p className="text-xs text-gray-500">
              Mostrando {Math.min((filters.page - 1) * 15 + 1, total)}–
              {Math.min(filters.page * 15, total)} de {total} citas
            </p>
            <div className="flex gap-2">
              <Button
                variant="purple-outline"
                size="xs"
                disabled={filters.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                leftIcon={<ChevronLeft className="w-3 h-3" />}
              >
                Anterior
              </Button>
              <Button
                variant="purple-outline"
                size="xs"
                disabled={filters.page >= totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                rightIcon={<ChevronRight className="w-3 h-3" />}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
