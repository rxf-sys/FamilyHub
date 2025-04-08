// src/components/medications/MedicationDetail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  AlertCircle, 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Calendar, 
  Clock, 
  CheckCircle,
  X,
  Plus,
  Package,
  Bell,
  Share2,
  Users
} from 'lucide-react';
import { medicationApi } from '../../api/medicationApi';

const MedicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [medication, setMedication] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [inventoryAmount, setInventoryAmount] = useState('');
  const [showInventoryUpdate, setShowInventoryUpdate] = useState(false);
  
  useEffect(() => {
    loadMedication();
  }, [id]);
  
  const loadMedication = async () => {
    try {
      setLoading(true);
      
      const response = await medicationApi.getMedication(id);
      const medicationData = response.data;
      
      setMedication(medicationData);
      setLogs(medicationData.logs || []);
      setInventoryAmount(medicationData.remainingAmount);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden des Medikaments:', err);
      setError('Medikament konnte nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleMarkAsTaken = async () => {
    try {
      setLoading(true);
      
      // Log erstellen
      await medicationApi.addMedicationLog(id, {
        taken: true,
        notes: '',
        timestamp: new Date().toISOString()
      });
      
      // Daten neu laden
      loadMedication();
    } catch (err) {
      console.error('Fehler beim Markieren als eingenommen:', err);
      setError('Die Einnahme konnte nicht gespeichert werden.');
      setLoading(false);
    }
  };
  
  const handleUpdateInventory = async () => {
    try {
      setLoading(true);
      
      // Bestand aktualisieren
      await medicationApi.updateMedicationInventory(id, Number(inventoryAmount));
      
      // Daten neu laden
      loadMedication();
      setShowInventoryUpdate(false);
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Bestands:', err);
      setError('Der Bestand konnte nicht aktualisiert werden.');
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setLoading(true);
      
      await medicationApi.deleteMedication(id);
      
      navigate('/medications');
    } catch (err) {
      console.error('Fehler beim Löschen des Medikaments:', err);
      setError('Das Medikament konnte nicht gelöscht werden.');
      setShowDeleteConfirm(false);
      setLoading(false);
    }
  };
  
  // Helfer-Funktion zur Formatierung der Wochentage
  const formatDaysOfWeek = (days) => {
    const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    
    if (!days || days.length === 0) return 'Keine Tage ausgewählt';
    if (days.length === 7) return 'Täglich';
    
    return days.map(day => dayNames[day]).join(', ');
  };
  
  // Helfer-Funktion zur Formatierung des Datums
  const formatDate = (dateString) => {
    if (!dateString) return 'Nicht angegeben';
    
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Helfer-Funktion zur Formatierung der Uhrzeit
  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    return new Date(dateString).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading && !medication) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/medications')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {medication?.name}
          </h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/medications/${id}/edit`)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            title="Bearbeiten"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            title="Löschen"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
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
      
      {medication && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hauptinformationen */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Medikamenteninformationen
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Details und Anweisungen.
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Dosierung</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {medication.dosage}
                    </dd>
                  </div>
                  
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Anweisungen</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {medication.instructions || 'Keine Anweisungen vorhanden'}
                    </dd>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Einheit</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {medication.unit}
                    </dd>
                  </div>
                  
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Verfallsdatum</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {formatDate(medication.expiration)}
                    </dd>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Nachbestellerinnerung</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {medication.refillReminder ? (
                        <span>Aktiv (Wenn weniger als {medication.refillThreshold} {medication.unit} übrig sind)</span>
                      ) : (
                        <span>Nicht aktiv</span>
                      )}
                    </dd>
                  </div>
                  
                  {medication.family && (
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Geteilt mit</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-500" />
                        Familie
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
            
            {/* Einnahmeverlauf */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                    Einnahmeverlauf
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Protokollierte Einnahmen.
                  </p>
                </div>
                <button
                  onClick={handleMarkAsTaken}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Jetzt einnehmen
                </button>
              </div>
              
              <div className="border-t border-gray-200">
                {logs.length === 0 ? (
                  <div className="px-4 py-5 text-center">
                    <p className="text-sm text-gray-500">
                      Noch keine Einnahmen protokolliert.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {logs.slice(0, 10).map((log, index) => (
                      <li key={index} className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {log.taken ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(log.timestamp)} um {formatTime(log.timestamp)}
                            </p>
                            {log.notes && (
                              <p className="text-sm text-gray-500">{log.notes}</p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          
          {/* Seitenleiste */}
          <div className="space-y-6">
            {/* Bestand */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Bestand
                </h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {medication.remainingAmount}
                      </p>
                      <p className="text-sm text-gray-500">{medication.unit}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowInventoryUpdate(true)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Aktualisieren
                  </button>
                </div>
                
                {medication.refillReminder && (
                  <div className={`p-3 rounded-md ${
                    medication.remainingAmount <= medication.refillThreshold
                      ? 'bg-red-50 text-red-800'
                      : 'bg-green-50 text-green-800'
                  }`}>
                    {medication.remainingAmount <= medication.refillThreshold ? (
                      <p className="text-sm font-medium">
                        Bestand niedrig - Nachbestellung empfohlen
                      </p>
                    ) : (
                      <p className="text-sm">
                        Bestand ausreichend
                      </p>
                    )}
                  </div>
                )}
                
                {showInventoryUpdate && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-md">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Bestand aktualisieren
                    </h3>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="0"
                        value={inventoryAmount}
                        onChange={(e) => setInventoryAmount(e.target.value)}
                        className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      <button
                        onClick={handleUpdateInventory}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Speichern
                      </button>
                      <button
                        onClick={() => {
                          setShowInventoryUpdate(false);
                          setInventoryAmount(medication.remainingAmount);
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Erinnerungen */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Erinnerungen
                </h2>
              </div>
              <div className="border-t border-gray-200">
                {medication.schedules.length === 0 ? (
                  <div className="px-4 py-5 text-center">
                    <p className="text-sm text-gray-500">
                      Keine Erinnerungen eingerichtet.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {medication.schedules.map((schedule, index) => (
                      <li key={index} className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Bell className={`h-5 w-5 ${
                              schedule.active ? 'text-blue-500' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="ml-3">
                            <p className={`text-sm font-medium ${
                              schedule.active ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {schedule.time}
                              {!schedule.active && ' (Deaktiviert)'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDaysOfWeek(schedule.daysOfWeek)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Löschen-Bestätigungsdialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900">Medikament löschen</h3>
            <p className="mt-2 text-sm text-gray-500">
              Sind Sie sicher, dass Sie dieses Medikament löschen möchten? Alle zugehörigen Daten und Erinnerungen werden ebenfalls gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationDetail