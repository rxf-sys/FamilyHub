// src/components/shopping/ShoppingListForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Plus, Users } from 'lucide-react';
import { shoppingApi } from '../../api/shoppingApi';

const ShoppingListForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    family: '',
    sharedWith: [],
    isUrgent: false,
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [families, setFamilies] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  
  useEffect(() => {
    if (isEditMode) {
      loadShoppingList();
    }
    loadFamilies();
  }, [id]);
  
  const loadShoppingList = async () => {
    try {
      setLoading(true);
      
      // In einer realen App würde hier die API aufgerufen werden
      const mockList = {
        id: '1',
        name: 'Wocheneinkauf',
        description: 'Einkäufe für die kommende Woche',
        family: '1',
        sharedWith: ['2', '3'],
        isUrgent: false,
        dueDate: '2025-04-15'
      };
      
      setFormData(mockList);
      setError(null);
      
      // Wenn eine Familie ausgewählt ist, lade die Mitglieder
      if (mockList.family) {
        loadFamilyMembers(mockList.family);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Einkaufsliste:', err);
      setError('Einkaufsliste konnte nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };
  
  const loadFamilies = async () => {
    try {
      // In einer realen App würde hier die API aufgerufen werden
      const mockFamilies = [
        { id: '1', name: 'Mustermann Familie' },
        { id: '2', name: 'Arbeitskollegen' }
      ];
      
      setFamilies(mockFamilies);
    } catch (err) {
      console.error('Fehler beim Laden der Familien:', err);
      setError('Familien konnten nicht geladen werden.');
    }
  };
  
  const loadFamilyMembers = async (familyId) => {
    try {
      // In einer realen App würde hier die API aufgerufen werden
      const mockMembers = [
        { id: '2', firstName: 'Anna', lastName: 'Mustermann', email: 'anna@example.com' },
        { id: '3', firstName: 'Max', lastName: 'Mustermann', email: 'max@example.com' }
      ];
      
      setFamilyMembers(mockMembers);
    } catch (err) {
      console.error('Fehler beim Laden der Familienmitglieder:', err);
      setError('Familienmitglieder konnten nicht geladen werden.');
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'family') {
      setFormData(prev => ({ ...prev, [name]: value, sharedWith: [] }));
      if (value) {
        loadFamilyMembers(value);
      } else {
        setFamilyMembers([]);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleMemberToggle = (memberId) => {
    setFormData(prev => {
      const isSelected = prev.sharedWith.includes(memberId);
      
      if (isSelected) {
        return {
          ...prev,
          sharedWith: prev.sharedWith.filter(id => id !== memberId)
        };
      } else {
        return {
          ...prev,
          sharedWith: [...prev.sharedWith, memberId]
        };
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEditMode) {
        // Update bestehende Liste
        await shoppingApi.updateList(id, formData);
        navigate(`/shopping/${id}`);
      } else {
        // Neue Liste erstellen
        const newList = await shoppingApi.createList(formData);
        navigate(`/shopping/${newList.id}`);
      }
    } catch (err) {
      console.error('Fehler beim Speichern der Einkaufsliste:', err);
      setError('Einkaufsliste konnte nicht gespeichert werden.');
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/shopping')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Einkaufsliste bearbeiten' : 'Neue Einkaufsliste'}
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
          <div>
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
              placeholder="z.B. Wocheneinkauf"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Beschreibung
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="Optionale Beschreibung für diese Liste"
            ></textarea>
          </div>
          
          <div className="flex items-center">
            <input
              id="isUrgent"
              name="isUrgent"
              type="checkbox"
              checked={formData.isUrgent}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isUrgent" className="ml-2 block text-sm text-gray-900">
              Dringend (wird im Dashboard hervorgehoben)
            </label>
          </div>
          
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Fälligkeitsdatum (optional)
            </label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="family" className="block text-sm font-medium text-gray-700">
              Familie
            </label>
            <select
              id="family"
              name="family"
              value={formData.family}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Nicht zugewiesen</option>
              {families.map(family => (
                <option key={family.id} value={family.id}>{family.name}</option>
              ))}
            </select>
          </div>
          
          {formData.family && familyMembers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mit Familienmitgliedern teilen
              </label>
              <div className="space-y-2">
                {familyMembers.map(member => (
                  <div key={member.id} className="flex items-center">
                    <input
                      id={`member-${member.id}`}
                      type="checkbox"
                      checked={formData.sharedWith.includes(member.id)}
                      onChange={() => handleMemberToggle(member.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`member-${member.id}`} className="ml-2 block text-sm text-gray-900">
                      {member.firstName} {member.lastName} ({member.email})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/shopping')}
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

export default ShoppingListForm;