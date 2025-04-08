// src/components/calendar/EventModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const EventModal = ({ isOpen, onClose, onSave, event = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    allDay: false,
    backgroundColor: '#3B82F6'
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        start: event.start ? format(new Date(event.start), "yyyy-MM-dd'T'HH:mm") : '',
        end: event.end ? format(new Date(event.end), "yyyy-MM-dd'T'HH:mm") : '',
        allDay: event.allDay || false,
        backgroundColor: event.backgroundColor || '#3B82F6'
      });
    } else {
      setFormData({
        title: '',
        start: '',
        end: '',
        allDay: false,
        backgroundColor: '#3B82F6'
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      start: new Date(formData.start),
      end: formData.end ? new Date(formData.end) : new Date(formData.start)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {event ? 'Termin bearbeiten' : 'Neuer Termin'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Titel
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allDay"
                  name="allDay"
                  checked={formData.allDay}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="allDay" className="ml-2 block text-sm text-gray-900">
                  Ganztägig
                </label>
              </div>
              
              <div>
                <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                  Beginn
                </label>
                <input
                  type="datetime-local"
                  id="start"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {!formData.allDay && (
                <div>
                  <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
                    Ende
                  </label>
                  <input
                    type="datetime-local"
                    id="end"
                    name="end"
                    value={formData.end}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Farbe
                </label>
                <select
                  id="backgroundColor"
                  name="backgroundColor"
                  value={formData.backgroundColor}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="#3B82F6">Blau</option>
                  <option value="#10B981">Grün</option>
                  <option value="#F59E0B">Orange</option>
                  <option value="#EF4444">Rot</option>
                  <option value="#8B5CF6">Lila</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Speichern
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;