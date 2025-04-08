import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Edit, 
  AlertCircle, 
  Check, 
  Share2, 
  ArrowLeft 
} from 'lucide-react';
import { shoppingApi } from '../api/shoppingApi';

const ShoppingListDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, unit: '', category: 'Sonstiges', note: '' });
  const [showForm, setShowForm] = useState(false);
  
  // Bestätigungsdialog-Zustand
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Kategorien für die Sortierung und Gruppierung
  const categories = [
    'Obst & Gemüse', 
    'Backwaren', 
    'Molkereiprodukte', 
    'Fleisch & Fisch', 
    'Getränke', 
    'Tiefkühlprodukte', 
    'Konserven', 
    'Gewürze', 
    'Süßigkeiten', 
    'Haushalt', 
    'Sonstiges'
  ];

  useEffect(() => {
    fetchList();
  }, [id]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const { data } = await shoppingApi.getList(id);
      setList(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Fehler beim Laden der Einkaufsliste');
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await shoppingApi.addItem(id, newItem);
      setNewItem({ name: '', quantity: 1, unit: '', category: 'Sonstiges', note: '' });
      setShowForm(false);
      fetchList();
    } catch (err) {
      setError(err.message || 'Fehler beim Hinzufügen des Artikels');
      setLoading(false);
    }
  };

  const handleToggleItem = async (itemId, completed) => {
    try {
      await shoppingApi.toggleItemStatus(id, itemId, !completed);
      
      // Optimistische UI-Aktualisierung
      setList(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item._id === itemId ? { ...item, completed: !completed } : item
        )
      }));
    } catch (err) {
      setError(err.message || 'Fehler beim Aktualisieren des Artikels');
      fetchList(); // Bei Fehler die Liste neu laden
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await shoppingApi.deleteItem(id, itemId);
      
      // Optimistische UI-Aktualisierung
      setList(prev => ({
        ...prev,
        items: prev.items.filter(item => item._id !== itemId)
      }));
    } catch (err) {
      setError(err.message || 'Fehler beim Löschen des Artikels');
      fetchList(); // Bei Fehler die Liste neu laden
    }
  };

  const handleDeleteList = async () => {
    try {
      await shoppingApi.deleteList(id);
      navigate('/shopping');
    } catch (err) {
      setError(err.message || 'Fehler beim Löschen der Liste');
    }
  };

  // Artikel nach Kategorien gruppieren
  const groupedItems = list?.items.reduce((acc, item) => {
    const category = item.category || 'Sonstiges';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  if (loading && !list) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !list) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button 
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
              onClick={() => navigate('/shopping')}
            >
              Zurück zu allen Listen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header mit Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/shopping')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{list?.name}</h1>
          {list?.isUrgent && (
            <span className="ml-3 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
              Dringend
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate(`/shopping/${id}/edit`)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
<Trash2 className="h-5 w-5" />
          </button>
          <button 
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <Share2 className="h-5 w-5" />
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

      {/* Neuer Artikel Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex justify-center items-center py-3 px-4 border border-dashed border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        >
          <Plus className="h-5 w-5 mr-2 text-gray-400" />
          Artikel hinzufügen
        </button>
      )}

      {/* Formular für neuen Artikel */}
      {showForm && (
        <form onSubmit={handleAddItem} className="bg-white p-4 rounded-md shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Neuer Artikel</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Artikelname
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={newItem.name}
                  onChange={handleItemChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Menge
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  min="1"
                  value={newItem.quantity}
                  onChange={handleItemChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                Einheit
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="unit"
                  id="unit"
                  placeholder="Stück, kg, Liter..."
                  value={newItem.unit}
                  onChange={handleItemChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Kategorie
              </label>
              <div className="mt-1">
                <select
                  id="category"
                  name="category"
                  value={newItem.category}
                  onChange={handleItemChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                Notiz
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="note"
                  id="note"
                  value={newItem.note}
                  onChange={handleItemChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Hinzufügen
            </button>
          </div>
        </form>
      )}

      {/* Artikel nach Kategorien */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {list && list.items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Artikel</h3>
            <p className="mt-1 text-sm text-gray-500">
              Fügen Sie Artikel zu Ihrer Einkaufsliste hinzu.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {groupedItems && Object.keys(groupedItems).map(category => (
              <React.Fragment key={category}>
                <li className="px-4 py-2 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-900">{category}</h3>
                </li>
                {groupedItems[category].map(item => (
                  <li key={item._id} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleItem(item._id, item.completed)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${item.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {item.name}
                        </p>
                        <div className="flex text-sm text-gray-500">
                          <p>{item.quantity} {item.unit}</p>
                          {item.note && <p className="ml-4">{item.note}</p>}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        )}
      </div>

      {/* Löschen-Bestätigungsdialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900">Liste löschen</h3>
            <p className="mt-2 text-sm text-gray-500">
              Sind Sie sicher, dass Sie diese Einkaufsliste löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDeleteList}
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

export default ShoppingListDetail;