import api from './authApi';

export const getStylists = async (params = {}) => {
  const res = await api.get('/stylists', { params });
  return res.data;
};

export const getStylistById = async (id) => {
  const res = await api.get(`/stylists/${id}`);
  return res.data;
};

export const createStylist = async (data) => {
  const res = await api.post('/stylists', data);
  return res.data;
};

export const updateStylist = async (id, data) => {
  const res = await api.put(`/stylists/${id}`, data);
  return res.data;
};
