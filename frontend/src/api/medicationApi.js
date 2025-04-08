// src/api/medicationApi.js
import api from './api';

export const medicationApi = {
  // Alle Medikamente abrufen
  getMedications: async () => {
    try {
      const response = await api.get('/medications');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Abrufen der Medikamente' };
    }
  },

  // Ein einzelnes Medikament abrufen
  getMedication: async (id) => {
    try {
      const response = await api.get(`/medications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Abrufen des Medikaments' };
    }
  },

  // Neues Medikament erstellen
  createMedication: async (medicationData) => {
    try {
      const response = await api.post('/medications', medicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Erstellen des Medikaments' };
    }
  },

  // Medikament aktualisieren
  updateMedication: async (id, medicationData) => {
    try {
      const response = await api.put(`/medications/${id}`, medicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Aktualisieren des Medikaments' };
    }
  },

  // Medikament löschen
  deleteMedication: async (id) => {
    try {
      const response = await api.delete(`/medications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Löschen des Medikaments' };
    }
  },

  // Medikamenteneinnahme protokollieren
  addMedicationLog: async (id, logData) => {
    try {
      const response = await api.post(`/medications/${id}/logs`, logData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Protokollieren der Einnahme' };
    }
  },

  // Bestand eines Medikaments aktualisieren
  updateInventory: async (id, amount) => {
    try {
      const response = await api.put(`/medications/${id}/inventory`, { amount });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Aktualisieren des Bestands' };
    }
  },

  // Medikamente mit niedrigem Bestand abrufen
  getLowInventoryMedications: async () => {
    try {
      const response = await api.get('/medications/low-inventory');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Abrufen der Medikamente mit niedrigem Bestand' };
    }
  }
};

export default medicationApi;