// src/api/dashboardApi.js
import api from './api';

export const dashboardApi = {
  // Dashboard-Hauptdaten abrufen
  getDashboardData: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Abrufen der Dashboard-Daten' };
    }
  },

  // Widget-Konfiguration abrufen
  getWidgetConfig: async () => {
    try {
      const response = await api.get('/dashboard/widgets/config');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Abrufen der Widget-Konfiguration' };
    }
  },

  // Widget-Konfiguration aktualisieren
  updateWidgetConfig: async (configData) => {
    try {
      const response = await api.put('/dashboard/widgets/config', configData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Aktualisieren der Widget-Konfiguration' };
    }
  },

  // Wetterdaten abrufen
  getWeatherData: async (location) => {
    try {
      const response = await api.get('/dashboard/weather', {
        params: { location }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Abrufen der Wetterdaten' };
    }
  },

  // Verkehrsdaten abrufen
  getTrafficData: async (origin, destination) => {
    try {
      const response = await api.get('/dashboard/traffic', {
        params: { origin, destination }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Abrufen der Verkehrsdaten' };
    }
  },

  // Nachrichtenfeed abrufen
  getNewsFeed: async (category) => {
    try {
      const response = await api.get('/dashboard/news', {
        params: { category }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Abrufen des Nachrichtenfeed' };
    }
  }
};

export default dashboardApi;