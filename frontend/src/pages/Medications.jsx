// src/pages/Medications.jsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, Bell } from 'lucide-react';
import { medicationService } from '../services/medicationService';
import MedicationList from '../components/medications/MedicationList';
import DailyReminderList from '../components/medications/DailyReminderList';

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMedicationDetail, setShowMedicationDetail] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Parallel laden
      const [medsData, reminderData] = await Promise.all([
        medicationService.getMedications(),
        medicationService.getDailyReminders()
      ]);
      
      setMedications(medsData);
      setReminders(reminderData);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Medikamentendaten:', err);
      setError('Daten konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleMedicationClick = (medication) => {
    setSelectedMedication(medication);
    setShowMedicationDetail(true);
  };
  
  const handleMarkAsTaken = async (reminder) => {
    try {
      setLoading(true);
      
      // Log erstellen
      await medicationService.createMedicationLog({
        medicationId: reminder.medicationId,
        taken: true,
        timestamp: new Date().toISOString(),
        notes: ''
      });
      
      // Daten neu laden
      loadData();
    } catch (err) {
      console.error('Fehler beim Markieren als eingenommen:', err);
      setError('Die Einnahme konnte nicht gespeichert werden.');
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Medikamenten-Manager</h1>
        <p className="text-gray-600">Verwalten Sie Ihre Medikamente und erhalten Sie Erinnerungen zur Einnahme.</p>
      </div>
      
      {/* Fehlermeldung */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Ladeanzeige */}
      {loading && !medications.length && !reminders.length ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tages-Erinnerungen */}
          <div>
            <DailyReminderList 
              reminders={reminders} 
              onMarkAsTaken={handleMarkAsTaken} 
            />
          </div>
          
          {/* Medikamenten-Liste */}
          <div>
            <MedicationList 
              medications={medications} 
              onMedicationClick={handleMedicationClick} 
            />
          </div>
        </div>
      )}
      
      {/* Medikamenten-Detail-Modal */}
      {showMedicationDetail && selectedMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{selectedMedication.name}</h2>
              <button 
                onClick={() => setShowMedicationDetail(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Dosierung</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedMedication.dosage}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bestand</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedMedication.remainingAmount} {selectedMedication.unit}
                  </p>
                </div>
                {selectedMedication.expiration && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Verfallsdatum</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedMedication.expiration).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                )}
              </div>
              
              {selectedMedication.instructions && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Anweisungen</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedMedication.instructions}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Erinnerungen</h3>
                {selectedMedication.schedules.length === 0 ? (
                  <p className="mt-1 text-sm text-gray-500">Keine Erinnerungen eingerichtet</p>
                ) : (
                  <div className="mt-2 space-y-2">
                    {selectedMedication.schedules.map(schedule => (
                      <div key={schedule.id} className="flex items-center space-x-3 text-sm">
                        <Bell className={`h-4 w-4 ${schedule.active ? 'text-blue-500' : 'text-gray-400'}`} />
                        <span className="font-medium">{schedule.time}</span>
                        <span className="text-gray-500">
                          {schedule.daysOfWeek.length === 7 
                            ? 'Täglich' 
                            : schedule.daysOfWeek.map(day => 
                                ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][day]
                              ).join(', ')
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowMedicationDetail(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Schließen
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Bearbeiten
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medications;