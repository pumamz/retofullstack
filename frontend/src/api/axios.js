import axios from 'axios';
import { mostrarError } from './toast';

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      mostrarError(error);
    } else {
      mostrarError(null, "No se pudo conectar con el servidor");
    }

    return Promise.reject(error);
  }
);

export default api;
