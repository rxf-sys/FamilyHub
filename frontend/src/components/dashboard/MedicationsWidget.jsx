// src/components/dashboard/MedicationsWidget.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pill, Check, AlertTriangle } from 'lucide-react';
import api from '../../api/api';
import { medicationApi } from '../../api/medicationApi'; // Wir nehmen an, dass es eine medicationApi gibt

const MedicationsWidget = ({ medications = [], lowInventory = [] }) => {
  const [loading, setLoading] = useState({});

  // Medikamenteneinnahme als erledigt markieren
  const handleMarkAsTaken = async (medicationId) => {
    try {
      setLoading(prev => ({ ...prev, [medicationId]: true }));

      // API-Aufruf zum Protokollieren der Einnahme mit der medicationApi
      await medicationApi.addMedicationLog(medicationId, {
        taken: true,
        notes: 'Vom Dashboard als eingenommen markiert'
      });

      // Aktualisierung der UI erfolgt beim nächsten Neuladen des Dashboards
      // Alternativ könnte man hier auch den lokalen State aktualisieren

    } catch (error) {
      console.error('Fehler beim Markieren des Medikaments als eingenommen:', error);
    } finally {
      setLoading(prev => ({ ...prev, [medicationId]: false }));
    }
  };

  // Tab-Komponente für das Widget
  const [activeTab, setActiveTab] = useState('today');

  const renderTodayTab = () => {
    if (medications.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          <Pill className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2">Keine Medikamente für heute</p>
        </div>
      );
    };

    return (
      <div className="space-y-2 mt-2">
        {medications.map(med => (
          <div key={med._id || med.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={med.taken}
                onChange={() => !med.taken && handleMarkAsTaken(med._id || med.id)}
                disabled={med.taken || loading[med._id || med.id]}
                className="h-4 w-4 text-blue-600 rounded mr-3"
              />
              <div>
                <p className="font-medium">{med.medication || med.name}</p>
                <p className="text-sm text-gray-500">{med.dosage} - {med.time || 'Heute'}</p>
              </div>
            </div>
            {med.taken && (
              <span className="flex items-center text-xs text-green-600">
                <Check className="h-3 w-3 mr-1" />
                Eingenommen
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderInventoryTab = () => {
    if (lowInventory.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          <Check className="mx-auto h-10 w-10 text-green-400" />
          <p className="mt-2">Alle Medikamentenbestände sind ausreichend</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 mt-2">
        {lowInventory.map(med => (
          <div key={med._id || med.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-3" />
              <div>
                <p className="font-medium">{med.name}</p>
                <p className="text-sm text-red-500">
                  Nur noch {med.remainingAmount} {med.unit} übrig
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'today'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
          onClick={() => setActiveTab('today')}
        >
          Heute
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'inventory'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
          onClick={() => setActiveTab('inventory')}
        >
          Bestand
        </button>
      </div>

      {/* Tab Inhalt */}
      {activeTab === 'today' ? renderTodayTab() : renderInventoryTab()}

      <Link to="/medications" className="block mt-2 text-blue-600 text-sm font-medium hover:text-blue-800">
        Alle Medikamente anzeigen
      </Link>
    </div>
  );
};

export default MedicationsWidget