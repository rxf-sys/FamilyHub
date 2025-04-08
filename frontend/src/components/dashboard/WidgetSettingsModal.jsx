// src/components/dashboard/WidgetSettingsModal.jsx
import React, { useState } from 'react';
import { X, Save, Calendar, Cloud, ShoppingCart, Utensils, Pill, FileText, Map, Newspaper } from 'lucide-react';

const WidgetSettingsModal = ({ isOpen, onClose, widgetConfig, onSave }) => {
  const [activeWidgets, setActiveWidgets] = useState(widgetConfig?.activeWidgets || []);
  
  // Definition der verfügbaren Widgets mit Metadaten
  const availableWidgets = [
    { id: 'calendar', name: 'Kalender', icon: <Calendar className="h-5 w-5" />, description: 'Zeigt anstehende Termine' },
    { id: 'weather', name: 'Wetter', icon: <Cloud className="h-5 w-5" />, description: 'Zeigt aktuelle Wetterdaten' },
    { id: 'shopping', name: 'Einkaufslisten', icon: <ShoppingCart className="h-5 w-5" />, description: 'Zeigt Einkaufslisten an' },
    { id: 'meals', name: 'Mahlzeiten', icon: <Utensils className="h-5 w-5" />, description: 'Zeigt Mahlzeitenplan' },
    { id: 'medications', name: 'Medikamente', icon: <Pill className="h-5 w-5" />, description: 'Zeigt Medikamentenerinnerungen' },
    { id: 'documents', name: 'Dokumente', icon: <FileText className="h-5 w-5" />, description: 'Zeigt wichtige Dokumente' },
    { id: 'traffic', name: 'Verkehr', icon: <Map className="h-5 w-5" />, description: 'Zeigt Verkehrsinformationen' },
    { id: 'news', name: 'Nachrichten', icon: <Newspaper className="h-5 w-5" />, description: 'Zeigt aktuelle Nachrichten' }
  ];
  
  // Widget aktivieren/deaktivieren
  const toggleWidget = (widgetId) => {
    setActiveWidgets(prev => {
      if (prev.includes(widgetId)) {
        return prev.filter(id => id !== widgetId);
      } else {
        return [...prev, widgetId];
      }
    });
  };
  
  // Speichern der Widget-Konfiguration
  const handleSave = () => {
    const updatedConfig = {
      ...widgetConfig,
      activeWidgets
    };
    onSave(updatedConfig);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Dashboard Einstellungen</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <h3 className="font-medium mb-2">Aktive Widgets</h3>
          <p className="text-sm text-gray-500 mb-4">
            Wählen Sie die Widgets aus, die auf Ihrem Dashboard angezeigt werden sollen
          </p>
          
          <div className="space-y-2">
            {availableWidgets.map(widget => (
              <div key={widget.id} className="flex items-center p-2 border rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  id={`widget-${widget.id}`}
                  checked={activeWidgets.includes(widget.id)}
                  onChange={() => toggleWidget(widget.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label 
                  htmlFor={`widget-${widget.id}`}
                  className="ml-3 flex flex-1 items-center cursor-pointer"
                >
                  <span className="flex items-center text-gray-500 mr-3">
                    {widget.icon}
                  </span>
                  <div>
                    <span className="block font-medium text-gray-900">{widget.name}</span>
                    <span className="block text-sm text-gray-500">{widget.description}</span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-3"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-1" />
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default WidgetSettingsModal;