import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8080/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err.message;
    err.userMessage = msg;
    return Promise.reject(err);
  }
);

export default API;
