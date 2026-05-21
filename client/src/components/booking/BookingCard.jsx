import { Calendar, Clock, User, Scissors, CreditCard, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDateShort, formatTime } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import BookingStatusBadge from './BookingStatusBadge.jsx';
import Button from '../common/Button.jsx';

export default function BookingCard({ booking, onCancel, showActions = true }) {
  const canCancel = ['pending', 'confirmed'].includes(booking.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-pink-100 shadow-card p-5 hover:shadow-card-hover transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-gray-800 text-base leading-tight">
            {booking.service_name}
          </h3>
          <p className="text-sm text-pink-500 font-medium mt-0.5">{booking.service_category}</p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <DetailRow icon={<Calendar className="w-4 h-4 text-pink-400" />}>
          {formatDateShort(booking.appointment_date)}
        </DetailRow>
        <DetailRow icon={<Clock className="w-4 h-4 text-pink-400" />}>
          {formatTime(booking.appointment_time)}
          {booking.duration_minutes && (
            <span className="text-gray-400 text-xs ml-1">({booking.duration_minutes} min)</span>
          )}
        </DetailRow>
        <DetailRow icon={<User className="w-4 h-4 text-pink-400" />}>
          {booking.stylist_name}
        </DetailRow>
        {booking.amount_paid && (
          <DetailRow icon={<CreditCard className="w-4 h-4 text-pink-400" />}>
            {formatCurrency(booking.amount_paid)}
            <span className="ml-2 text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-full">
              Pagado
            </span>
          </DetailRow>
        )}
      </div>

      {/* Actions */}
      {showActions && canCancel && onCancel && (
        <div className="pt-3 border-t border-pink-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCancel(booking.id)}
            leftIcon={<XCircle className="w-3.5 h-3.5" />}
          >
            Cancelar cita
          </Button>
        </div>
      )}

      {booking.receipt_url && (
        <div className="pt-3 border-t border-pink-50">
          <a
            href={booking.receipt_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-pink-500 hover:underline font-medium"
          >
            Ver recibo
          </a>
        </div>
      )}
    </motion.div>
  );
}

function DetailRow({ icon, children }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-gray-600">
      {icon}
      <span>{children}</span>
    </div>
  );
}
