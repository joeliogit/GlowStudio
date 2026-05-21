import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreditCard, Banknote, CheckCircle2 } from 'lucide-react';
import { useUpdateBookingPayment } from '../../hooks/useBookings';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button.jsx';

export default function PaymentValidator({ booking, onSuccess }) {
  const [method, setMethod] = useState('cash');
  const { mutate: updatePayment, isPending } = useUpdateBookingPayment();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      amount_paid: booking?.service_price || '',
    },
  });

  const onSubmit = (data) => {
    updatePayment(
      {
        id: booking.id,
        data: {
          payment_method: method,
          amount_paid: parseFloat(data.amount_paid),
          payment_status: 'paid',
        },
      },
      { onSuccess }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Booking summary */}
      <div className="bg-purple-50 rounded-xl p-4 text-sm space-y-1.5">
        <div className="flex justify-between">
          <span className="text-gray-500">Clienta</span>
          <span className="font-medium text-gray-800">{booking?.client_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Servicio</span>
          <span className="font-medium text-gray-800">{booking?.service_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Precio</span>
          <span className="font-bold text-purple-700">{formatCurrency(booking?.service_price)}</span>
        </div>
      </div>

      {/* Payment method selection */}
      <div>
        <label className="input-label">Método de pago</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMethod('cash')}
            className={[
              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
              method === 'cash'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 text-gray-500 hover:border-purple-200',
            ].join(' ')}
          >
            <Banknote className="w-5 h-5" />
            <span className="text-sm font-medium">Efectivo</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod('terminal')}
            className={[
              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
              method === 'terminal'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 text-gray-500 hover:border-purple-200',
            ].join(' ')}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-sm font-medium">Terminal</span>
          </button>
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="input-label" htmlFor="amount_paid">Monto recibido (MXN)</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
          <input
            id="amount_paid"
            type="number"
            step="0.01"
            min="0"
            className="w-full pl-7 pr-4 py-3 rounded-xl border border-purple-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all"
            {...register('amount_paid', {
              required: 'El monto es requerido.',
              min: { value: 0.01, message: 'El monto debe ser mayor a 0.' },
            })}
          />
        </div>
        {errors.amount_paid && <p className="text-red-500 text-xs mt-1">{errors.amount_paid.message}</p>}
      </div>

      <Button
        type="submit"
        variant="purple"
        fullWidth
        loading={isPending}
        leftIcon={<CheckCircle2 className="w-4 h-4" />}
      >
        Registrar Pago
      </Button>
    </form>
  );
}
