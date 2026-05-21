import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { getStylists } from '../../api/stylistsApi';
import { getProducts } from '../../api/productsApi';
import api from '../../api/authApi';
import { bookingSchema } from '../../utils/validators';
import { useCreateBooking } from '../../hooks/useBookings';
import { formatCurrency } from '../../utils/formatCurrency';
import BookingCalendar from './BookingCalendar.jsx';
import Button from '../common/Button.jsx';

const STEPS = ['Servicio', 'Estilista', 'Fecha & Hora', 'Confirmar'];

export default function BookingForm({ onSuccess }) {
  const [step, setStep] = useState(0);
  const { mutateAsync: createBooking, isPending } = useCreateBooking();

  const { data: stylists = [] } = useQuery({
    queryKey: ['stylists'],
    queryFn: () => getStylists().then((d) => d.stylists),
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then((r) => r.data.services).catch(() =>
      api.get('/products').then(() => [])
    ),
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm({ resolver: zodResolver(bookingSchema) });

  const watched = watch();
  const selectedService = services.find((s) => s.id === watched.service_id);
  const selectedStylist = stylists.find((s) => s.id === watched.stylist_id);

  const onSubmit = async (data) => {
    await createBooking(data);
    onSuccess?.();
  };

  const canNext = () => {
    if (step === 0) return Boolean(watched.service_id);
    if (step === 1) return Boolean(watched.stylist_id);
    if (step === 2) return Boolean(watched.appointment_date && watched.appointment_time);
    return true;
  };

  return (
    <div>
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div
              className={[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                i < step
                  ? 'bg-green-500 text-white'
                  : i === step
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-400',
              ].join(' ')}
            >
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={`hidden sm:block text-xs font-medium ml-1 ${
                i === step ? 'text-pink-600' : 'text-gray-400'
              }`}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`hidden sm:block h-px w-8 mx-2 ${i < step ? 'bg-green-300' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Step 0: Select Service */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-3"
            >
              <h3 className="font-serif text-xl text-gray-800 mb-4">¿Qué servicio deseas?</h3>
              {services.length === 0 && (
                <p className="text-gray-400 text-sm">Cargando servicios...</p>
              )}
              {services.map((service) => (
                <label
                  key={service.id}
                  className={[
                    'flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all',
                    watched.service_id === service.id
                      ? 'border-pink-400 bg-pink-50 shadow-md'
                      : 'border-gray-200 hover:border-pink-200',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      value={service.id}
                      className="accent-pink-500"
                      {...register('service_id')}
                    />
                    <div>
                      <p className="font-medium text-gray-800">{service.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{service.category} · {service.duration_minutes} min</p>
                    </div>
                  </div>
                  <span className="font-bold text-pink-500">{formatCurrency(service.price)}</span>
                </label>
              ))}
              {errors.service_id && <p className="input-error">{errors.service_id.message}</p>}
            </motion.div>
          )}

          {/* Step 1: Select Stylist */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-3"
            >
              <h3 className="font-serif text-xl text-gray-800 mb-4">Elige tu estilista</h3>
              {stylists.map((st) => (
                <label
                  key={st.id}
                  className={[
                    'flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all',
                    watched.stylist_id === st.id
                      ? 'border-pink-400 bg-pink-50 shadow-md'
                      : 'border-gray-200 hover:border-pink-200',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    value={st.id}
                    className="accent-pink-500"
                    {...register('stylist_id')}
                  />
                  <img
                    src={st.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(st.name)}&background=FFB6C1&color=E91E8C`}
                    alt={st.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-100"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{st.name}</p>
                    <p className="text-xs text-gray-400">{st.specialty}</p>
                    <p className="text-xs text-amber-500 font-medium">★ {st.rating}</p>
                  </div>
                </label>
              ))}
              {errors.stylist_id && <p className="input-error">{errors.stylist_id.message}</p>}
            </motion.div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <h3 className="font-serif text-xl text-gray-800 mb-4">Elige fecha y hora</h3>
              <input type="hidden" {...register('appointment_date')} />
              <input type="hidden" {...register('appointment_time')} />
              <BookingCalendar
                selectedDate={watched.appointment_date}
                selectedTime={watched.appointment_time}
                onDateChange={(d) => setValue('appointment_date', d, { shouldValidate: true })}
                onTimeChange={(t) => setValue('appointment_time', t, { shouldValidate: true })}
              />
              {(errors.appointment_date || errors.appointment_time) && (
                <p className="input-error mt-2">
                  {errors.appointment_date?.message || errors.appointment_time?.message}
                </p>
              )}
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <h3 className="font-serif text-xl text-gray-800 mb-4">Confirmar tu cita</h3>
              <div className="bg-pink-50 rounded-2xl p-5 space-y-3 mb-5">
                <SummaryRow label="Servicio" value={selectedService?.name} />
                <SummaryRow label="Precio" value={formatCurrency(selectedService?.price)} />
                <SummaryRow label="Estilista" value={selectedStylist?.name} />
                <SummaryRow label="Fecha" value={watched.appointment_date} />
                <SummaryRow label="Hora" value={watched.appointment_time?.slice(0, 5)} />
              </div>
              <div>
                <label className="input-label" htmlFor="notes">Notas adicionales (opcional)</label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Alergias, preferencias, etc."
                  className="input-field resize-none"
                  {...register('notes')}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-pink-50">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Anterior
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Siguiente
            </Button>
          ) : (
            <Button type="submit" loading={isPending}>
              Confirmar cita
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{value || '—'}</span>
    </div>
  );
}
