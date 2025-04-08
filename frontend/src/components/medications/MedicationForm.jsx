// src/components/medications/MedicationForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Plus, Clock, CalendarDays, Trash2 } from 'lucide-react';
import { medicationApi } from '../../api/medicationApi';

const MedicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    instructions: '',
    remainingAmount: 0,
    unit: 'Tabletten',
    expiration: '',
    refillReminder: false,
    refillThreshold: 5,
    schedules: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [families, setFamilies] = useState([]);
  
  // Zusätzlicher State für die Bearbeitung von Zeitplänen
  const [newSchedule, setNewSchedule] = useState({
    time: '08:00',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // alle Tage standardmäßig ausgewählt
    active: true
  });
  
  useEffect(() => {
    loadFamilies();
    
    if (isEditMode) {
      loadMedication();
    }
  }, [id]);
  
  const loadMedication = async () => {
    try {
      setLoading(true);
      
      const response = await medicationApi.getMedication(id);
      const medication = response.data;
      
      // Formatiere das Ablaufdatum für die Eingabe
      let formattedData = { ...medication };
      if (medication.expiration) {
        formattedData.expiration = new Date(medication.expiration).toISOString().split('T')[0];
      }
      
      setFormData(formattedData);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden des Medikaments:', err);
      setError('Medikament konnte nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };
  
  const loadFamilies = async () => {
    try {
      // Hier würden die Familien vom API geladen
      // Für jetzt simulieren wir dies mit Beispieldaten
      const mockFamilies = [
        { id: '1', name: 'Mustermann Familie' },
        { id: '2', name: 'Arbeitskollegen' }
      ];
      
      setFamilies(mockFamilies);
    } catch (err) {
      console.error('Fehler beim Laden der Familien:', err);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDayToggle = (day) => {
    setNewSchedule(prev => {
      const isSelected = prev.daysOfWeek.includes(day);
      
      if (isSelected) {
        return {
          ...prev,
          daysOfWeek: prev.daysOfWeek.filter(d => d !== day)
        };
      } else {
        return {
          ...prev,
          daysOfWeek: [...prev.daysOfWeek, day].sort()
        };
      }
    });
  };
  
  const addSchedule = () => {
    // Generiere eine temporäre ID für die Benutzeroberfläche
    const tempId = Date.now().toString();
    
    setFormData(prev => ({
      ...prev,
      schedules: [...prev.schedules, { ...newSchedule, id: tempId }]
    }));
    
    // Setze das neue Zeitplanformular zurück
    setNewSchedule({
      time: '08:00',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      active: true
    });
  };
  
  const removeSchedule = (scheduleId) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.filter(schedule => schedule.id !== scheduleId)
    }));
  };
  
  const toggleScheduleActive = (scheduleId) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.map(schedule => {
        if (schedule.id === scheduleId) {
          return { ...schedule, active: !schedule.active };
        }
        return schedule;
      })
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEditMode) {
        await medicationApi.updateMedication(id, formData);
      } else {
        const response = await medicationApi.createMedication(formData);
        id = response.data.id || response.data._id;
      }
      
      navigate(`/medications/${id}`);
    } catch (err) {
      console.error('Fehler beim Speichern des Medikaments:', err);
      setError('Medikament konnte nicht gespeichert werden.');
      setLoading(false);
    }
  };
  
  // Helfer-Funktion zur Formatierung der Wochentage
  const formatDaysOfWeek = (days) => {
    const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    
    if (days.length === 7) {
      return 'Täglich';
    } else if (days.length === 0) {
      return 'Keine Tage ausgewählt';
    } else {
      return days.map(day => dayNames[day]).join(', ');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/medications')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Medikament bearbeiten' : 'Neues Medikament'}
        </h1>
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
      
      {/* Formular */}
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
        <div className="space-y-6">
          {/* Grundlegende Informationen */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Grundlegende Informationen</h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
                  Dosierung
                </label>
                <input
                  type="text"
                  name="dosage"
                  id="dosage"
                  required
                  value={formData.dosage}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="z.B. 400mg, 1 Tablette"
                />
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                  Anweisungen
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  rows="3"
                  value={formData.instructions}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Hinweise zur Einnahme"
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Bestand und Nachbestellung */}
          <div className="pt-6">
            <h2 className="text-lg font-medium text-gray-900">Bestand und Nachbestellung</h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="remainingAmount" className="block text-sm font-medium text-gray-700">
                  Aktueller Bestand
                </label>
                <input
                  type="number"
                  name="remainingAmount"
                  id="remainingAmount"
                  min="0"
                  value={formData.remainingAmount}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                  Einheit
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="Tabletten">Tabletten</option>
                  <option value="Kapseln">Kapseln</option>
                  <option value="ml">ml</option>
                  <option value="Einheiten">Einheiten</option>
                  <option value="Stück">Stück</option>
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="expiration" className="block text-sm font-medium text-gray-700">
                  Verfallsdatum
                </label>
                <input
                  type="date"
                  name="expiration"
                  id="expiration"
                  value={formData.expiration}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="refillReminder"
                      name="refillReminder"
                      type="checkbox"
                      checked={formData.refillReminder}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="refillReminder" className="font-medium text-gray-700">
                      Nachbestellerinnerung
                    </label>
                    <p className="text-gray-500">Erhalten Sie eine Erinnerung, wenn der Bestand niedrig ist.</p>
                  </div>
                </div>
              </div>
              
              {formData.refillReminder && (
                <div className="sm:col-span-2">
                  <label htmlFor="refillThreshold" className="block text-sm font-medium text-gray-700">
                    Nachbestellschwelle
                  </label>
                  <input
                    type="number"
                    name="refillThreshold"
                    id="refillThreshold"
                    min="1"
                    value={formData.refillThreshold}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Erinnerung, wenn der Bestand unter diesen Wert fällt
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Erinnerungen */}
          <div className="pt-6">
            <h2 className="text-lg font-medium text-gray-900">Erinnerungsplan</h2>
            
            {/* Bestehende Zeitpläne */}
            {formData.schedules.length > 0 && (
              <div className="mt-4 mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Aktuelle Erinnerungen</h3>
                <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                  {formData.schedules.map((schedule) => (
                    <li key={schedule.id} className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className={`h-5 w-5 mr-3 ${schedule.active ? 'text-blue-500' : 'text-gray-400'}`} />
                        <div>
                          <p className={`text-sm font-medium ${schedule.active ? 'text-gray-900' : 'text-gray-500'}`}>
                            {schedule.time}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDaysOfWeek(schedule.daysOfWeek)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => toggleScheduleActive(schedule.id)}
                          className={`p-1 rounded-full ${
                            schedule.active 
                              ? 'text-blue-600 hover:bg-blue-100' 
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          {schedule.active ? 'Deaktivieren' : 'Aktivieren'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSchedule(schedule.id)}
                          className="p-1 rounded-full text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Neuen Zeitplan hinzufügen */}
            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 bg-gray-50 p-4 rounded-md">
              <div className="sm:col-span-2">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Uhrzeit
                </label>
                <input
                  type="time"
                  name="time"
                  id="time"
                  value={newSchedule.time}
                  onChange={handleScheduleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wochentage
                </label>
                <div className="flex flex-wrap gap-2">
                  {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map((day, index) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(index)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        newSchedule.daysOfWeek.includes(index)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <button
                  type="button"
                  onClick={addSchedule}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Erinnerung hinzufügen
                </button>
              </div>
            </div>
          </div>
          
          {/* Familienfreigabe */}
          <div className="pt-6">
            <h2 className="text-lg font-medium text-gray-900">Freigabe</h2>
            <div className="mt-4">
              <label htmlFor="family" className="block text-sm font-medium text-gray-700">
                Mit Familie teilen
              </label>
              <select
                id="family"
                name="family"
                value={formData.family || ''}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Nicht teilen</option>
                {families.map(family => (
                  <option key={family.id} value={family.id}>{family.name}</option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Wenn Sie Ihr Medikament mit Ihrer Familie teilen, können alle Mitglieder es sehen und Erinnerungen erhalten.
              </p>
            </div>
          </div>
          
          {/* Speichern- und Abbrechen-Buttons */}
          <div className="pt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/medications')}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Wird gespeichert...' : isEditMode ? 'Aktualisieren' : 'Erstellen'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MedicationForm;