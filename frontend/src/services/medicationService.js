// src/services/medicationService.js

// Demo-Daten für Medikamente
const medications = [
    {
      id: '1',
      name: 'Ibuprofen',
      dosage: '400mg',
      instructions: 'Bei Schmerzen oder Fieber einnehmen. Nicht auf leeren Magen einnehmen.',
      remainingAmount: 20,
      unit: 'Tabletten',
      expiration: '2026-12-31',
      refillReminder: true,
      refillThreshold: 5,
      schedules: [
        {
          id: '1',
          time: '08:00',
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Mo-So
          active: true
        },
        {
          id: '2',
          time: '20:00',
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Mo-So
          active: true
        }
      ]
    },
    {
      id: '2',
      name: 'Vitamin D',
      dosage: '1000 IE',
      instructions: 'Täglich zum Frühstück einnehmen.',
      remainingAmount: 45,
      unit: 'Tabletten',
      expiration: '2025-10-15',
      refillReminder: true,
      refillThreshold: 10,
      schedules: [
        {
          id: '3',
          time: '08:00',
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Mo-So
          active: true
        }
      ]
    }
  ];
  
  // Demo-Daten für Medikamenten-Einnahme
  const medicationLogs = [
    {
      id: '1',
      medicationId: '1',
      timestamp: new Date(new Date().setHours(8, 5)).toISOString(),
      taken: true,
      notes: 'Kopfschmerzen'
    },
    {
      id: '2',
      medicationId: '1',
      timestamp: new Date(new Date().setHours(20, 10)).toISOString(),
      taken: false,
      notes: 'Vergessen'
    },
    {
      id: '3',
      medicationId: '2',
      timestamp: new Date(new Date().setHours(8, 15)).toISOString(),
      taken: true,
      notes: ''
    }
  ];
  
  export const medicationService = {
    // Medikamente
    getMedications: () => {
      return Promise.resolve(medications);
    },
    
    getMedicationById: (id) => {
      const medication = medications.find(m => m.id === id);
      if (medication) {
        return Promise.resolve(medication);
      }
      return Promise.reject(new Error('Medikament nicht gefunden'));
    },
    
    createMedication: (medicationData) => {
      const newMedication = {
        ...medicationData,
        id: Date.now().toString(),
        schedules: medicationData.schedules || []
      };
      medications.push(newMedication);
      return Promise.resolve(newMedication);
    },
    
    updateMedication: (id, medicationData) => {
      const index = medications.findIndex(m => m.id === id);
      if (index !== -1) {
        medications[index] = { ...medications[index], ...medicationData };
        return Promise.resolve(medications[index]);
      }
      return Promise.reject(new Error('Medikament nicht gefunden'));
    },
    
    deleteMedication: (id) => {
      const index = medications.findIndex(m => m.id === id);
      if (index !== -1) {
        const deletedMedication = medications.splice(index, 1)[0];
        return Promise.resolve(deletedMedication);
      }
      return Promise.reject(new Error('Medikament nicht gefunden'));
    },
    
    // Medikamenten-Einnahme
    getMedicationLogs: (medicationId = null, startDate = null, endDate = null) => {
      let filteredLogs = [...medicationLogs];
      
      // Nach Medikament filtern
      if (medicationId) {
        filteredLogs = filteredLogs.filter(log => log.medicationId === medicationId);
      }
      
      // Nach Zeitraum filtern
      if (startDate) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(startDate));
      }
      
      if (endDate) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(endDate));
      }
      
      return Promise.resolve(filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    },
    
    createMedicationLog: (logData) => {
      const newLog = {
        ...logData,
        id: Date.now().toString(),
        timestamp: logData.timestamp || new Date().toISOString()
      };
      medicationLogs.push(newLog);
      
      // Bei Einnahme Bestand reduzieren
      if (newLog.taken) {
        const medication = medications.find(m => m.id === newLog.medicationId);
        if (medication && medication.remainingAmount > 0) {
          medication.remainingAmount -= 1;
        }
      }
      
      return Promise.resolve(newLog);
    },
    
    // Tägliche Erinnerungen
    getDailyReminders: () => {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0-6, 0 = Sonntag
      
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
            const existingLog = medicationLogs.find(log => {
              const logTime = new Date(log.timestamp);
              return (
                medication.id === log.medicationId &&
                logTime.getDate() === today.getDate() &&
                logTime.getMonth() === today.getMonth() &&
                logTime.getFullYear() === today.getFullYear() &&
                logTime.getHours() === hours &&
                Math.abs(logTime.getMinutes() - minutes) < 30 // Innerhalb von 30 Minuten
              );
            });
            
            reminders.push({
              id: `${medication.id}-${schedule.id}-${today.toISOString().split('T')[0]}`,
              medicationId: medication.id,
              medication: medication.name,
              dosage: medication.dosage,
              time: schedule.time,
              timestamp: reminderTime.toISOString(),
              taken: existingLog ? existingLog.taken : false,
              scheduleId: schedule.id
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
      
      return Promise.resolve(reminders);
    }
  };