import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: API_URL });

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('gs_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Envía el id_token de Google Identity Services al backend para iniciar sesión.
export const googleLogin = async (credential) => {
  const res = await api.post('/auth/google', { credential });
  return res.data;
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

export default api;
