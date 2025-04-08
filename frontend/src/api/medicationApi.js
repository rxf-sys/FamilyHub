// src/api/medicationApi.js
import api from './api';

export const medicationApi = {
  // Alle Medikamente des Benutzers abrufen
  getMedications: async (family = null) => {
    try {
      const params = {};
      if (family) params.family = family;
      
      const response = await api.get('/medications', { params });
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

  // Einnahmeprotokoll für ein Medikament hinzufügen
  addMedicationLog: async (id, logData) => {
    try {
      const response = await api.post(`/medications/${id}/logs`, logData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Hinzufügen des Einnahmeprotokolls' };
    }
  },

  // Medikamentenbestand aktualisieren
  updateMedicationInventory: async (id, amount) => {
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
  },

  // Tägliche Erinnerungen abrufen
  getDailyReminders: async () => {
    try {
      // Hier würde ein spezifischer Endpunkt für Erinnerungen aufgerufen werden
      // Da dieser in der API-Spezifikation nicht definiert ist, bauen wir eine Hilfsfunktion,
      // die aus den Medikamentendaten die heutigen Erinnerungen extrahiert
      
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0-6, 0 = Sonntag
      
      const response = await api.get('/medications');
      const medications = response.data.data || [];
      
      const reminders = [];
      
      medications.forEach(medication => {
        medication.schedules.forEach(schedule => {
          // Prüfen, ob der Plan für heute aktiv ist
          if (schedule.active && schedule.daysOfWeek.includes(dayOfWeek)) {
            const [hours, minutes] = schedule.time.split(':').map(Number);
            
            // Zeitpunkt für heute erstellen
            const reminderTime = new Date(today);
            reminderTime.setHours(hours, minutes, 0, 0);
            
            // Prüfen, ob bereits ein Log für diesen Zeitpunkt existiert
            const takenToday = medication.logs.some(log => {
              const logDate = new Date(log.timestamp);
              return (
                logDate.getDate() === today.getDate() &&
                logDate.getMonth() === today.getMonth() &&
                logDate.getFullYear() === today.getFullYear() &&
                Math.abs(logDate.getHours() - hours) <= 1
              );
            });
            
            reminders.push({
              id: `${medication._id}-${schedule._id}-${today.toISOString().split('T')[0]}`,
              medicationId: medication._id,
              medication: medication.name,
              dosage: medication.dosage,
              time: schedule.time,
              timestamp: reminderTime.toISOString(),
              taken: takenToday,
              scheduleId: schedule._id
            });
          }
        });
      });
      
      // Nach Zeit sortieren
      reminders.sort((a, b) => {
        const timeA = new Date(a.timestamp);
        const timeB = new Date(b.timestamp);
        return timeA - timeB;
      });
      
      return { data: reminders };
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Abrufen der Erinnerungen' };
    }
  }
};

export default medicationApi;