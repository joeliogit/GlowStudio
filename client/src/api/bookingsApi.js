import api from './authApi';

export const getMyBookings = async () => {
  const res = await api.get('/bookings/my');
  return res.data;
};

export const createBooking = async (data) => {
  const res = await api.post('/bookings', data);
  return res.data;
};

export const cancelMyBooking = async (id) => {
  const res = await api.patch(`/bookings/${id}/cancel`);
  return res.data;
};

export const getAllBookings = async (params = {}) => {
  const res = await api.get('/bookings', { params });
  return res.data;
};

export const getTodayBookings = async () => {
  const res = await api.get('/bookings/today');
  return res.data;
};

export const getBookingById = async (id) => {
  const res = await api.get(`/bookings/${id}`);
  return res.data;
};

export const updateBookingStatus = async (id, status) => {
  const res = await api.patch(`/bookings/${id}/status`, { status });
  return res.data;
};

export const updateBookingPayment = async (id, data) => {
  const res = await api.patch(`/bookings/${id}/payment`, data);
  return res.data;
};

export const sendBookingReminder = async (id) => {
  const res = await api.post(`/bookings/${id}/reminder`);
  return res.data;
};
