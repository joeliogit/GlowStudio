import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyBookings,
  createBooking,
  cancelMyBooking,
  getAllBookings,
  getTodayBookings,
  getBookingById,
  updateBookingStatus,
  updateBookingPayment,
  sendBookingReminder,
} from '../api/bookingsApi';
import toast from 'react-hot-toast';

// ─── Client hooks ─────────────────────────────────────────────────────────────
export const useMyBookings = () =>
  useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: () => getMyBookings().then((d) => d.bookings),
  });

export const useCreateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings', 'my'] });
      toast.success('Cita creada correctamente.');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Error al crear la cita.'),
  });
};

export const useCancelBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelMyBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Cita cancelada.');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Error al cancelar la cita.'),
  });
};

// ─── Staff hooks ──────────────────────────────────────────────────────────────
export const useAllBookings = (params = {}) =>
  useQuery({
    queryKey: ['bookings', 'all', params],
    queryFn: () => getAllBookings(params).then((d) => d),
  });

export const useTodayBookings = () =>
  useQuery({
    queryKey: ['bookings', 'today'],
    queryFn: () => getTodayBookings().then((d) => d.bookings),
    refetchInterval: 60_000, // refresh every minute
  });

export const useBookingById = (id) =>
  useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBookingById(id).then((d) => d.booking),
    enabled: Boolean(id),
  });

export const useUpdateBookingStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Estado actualizado.');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Error al actualizar.'),
  });
};

export const useUpdateBookingPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBookingPayment(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Pago registrado correctamente.');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Error al registrar pago.'),
  });
};

export const useSendReminder = () =>
  useMutation({
    mutationFn: sendBookingReminder,
    onSuccess: () => toast.success('Recordatorio enviado.'),
    onError: (err) => toast.error(err.response?.data?.error || 'Error al enviar recordatorio.'),
  });
