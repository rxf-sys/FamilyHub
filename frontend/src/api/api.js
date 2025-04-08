// src/api/api.js
import axios from 'axios';

// API-Basis-URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Axios-Instanz mit Basis-URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request-Interceptor für JWT-Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response-Interceptor für Fehlerbehandlung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Globale Fehlerbehandlung
    if (error.response && error.response.status === 401) {
      // Token ist abgelaufen oder ungültig, Benutzer abmelden
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;