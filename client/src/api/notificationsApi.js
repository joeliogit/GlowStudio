import api from './authApi';

export const sendWhatsApp = async (booking_id, message = null) => {
  const res = await api.post('/notifications/whatsapp', { booking_id, message });
  return res.data;
};

export const getNotificationsLog = async (params = {}) => {
  const res = await api.get('/notifications/log', { params });
  return res.data;
};
