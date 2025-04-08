import api from './api';

export const calendarApi = {
  // Alle Termine des Benutzers abrufen
  getEvents: async (start, end, family) => {
    try {
      const params = {};
      if (start) params.start = start;
      if (end) params.end = end;
      if (family) params.family = family;
      
      const response = await api.get('/events', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Abrufen der Termine' };
    }
  },

  // Einen einzelnen Termin abrufen
  getEvent: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Abrufen des Termins' };
    }
  },

  // Neuen Termin erstellen
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Erstellen des Termins' };
    }
  },

  // Termin aktualisieren
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Aktualisieren des Termins' };
    }
  },

  // Termin löschen
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Löschen des Termins' };
    }
  }
};