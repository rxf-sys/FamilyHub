// src/components/medications/MedicationList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pill, Plus, Search, AlertCircle, Clock } from 'lucide-react';

const MedicationList = ({ medications, onMedicationClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Medikamente filtern
  const filteredMedications = medications.filter(medication =>
    medication.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Prüfen, ob Medikament nachbestellt werden sollte
  const needsRefill = (medication) => {
    return medication.refillReminder && medication.remainingAmount <= medication.refillThreshold;
  };
  
  // Prüfen, ob Medikament bald abläuft (innerhalb von 30 Tagen)
  const isExpiringSoon = (medication) => {
    if (!medication.expiration) return false;
    
    const today = new Date();
    const expiration = new Date(medication.expiration);
    const daysUntilExpiration = Math.floor((expiration - today) / (1000 * 60 * 60 * 24));
    
    return daysUntilExpiration <= 30 && daysUntilExpiration >= 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Medikamente</h2>
        <Link 
          to="/medications/new" 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Neues Medikament
        </Link>
      </div>
      
      {/* Suchleiste */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Medikamente durchsuchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      
      {/* Medikamenten-Liste */}
      {filteredMedications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Pill className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Medikamente gefunden</h3>
          <p className="mt-1 text-sm text-gray-500">
            Fügen Sie neue Medikamente hinzu oder ändern Sie Ihre Suchkriterien.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredMedications.map(medication => (
              <li key={medication.id}>
                <div 
                  className="block hover:bg-gray-50 cursor-pointer"
                  onClick={() => onMedicationClick(medication)}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Pill className="h-5 w-5 text-blue-500" />
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {medication.name}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex space-x-2">
                        {needsRefill(medication) && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Nachbestellen
                          </span>
                        )}
                        {isExpiringSoon(medication) && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Läuft bald ab
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Dosierung: {medication.dosage}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          Bestand: {medication.remainingAmount} {medication.unit}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>
                          {medication.schedules.length} {medication.schedules.length === 1 ? 'Erinnerung' : 'Erinnerungen'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MedicationList;