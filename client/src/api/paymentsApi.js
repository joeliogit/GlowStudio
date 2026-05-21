import api from './authApi';

export const createPaymentIntent = async (booking_id, amount) => {
  const res = await api.post('/payments/create-intent', { booking_id, amount });
  return res.data;
};

export const confirmPayment = async (payment_intent_id) => {
  const res = await api.post('/payments/confirm', { payment_intent_id });
  return res.data;
};

export const getReceipt = async (id) => {
  const res = await api.get(`/payments/receipt/${id}`);
  return res.data;
};
