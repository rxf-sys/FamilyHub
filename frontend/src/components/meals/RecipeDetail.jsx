// src/components/meals/RecipeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  AlertCircle, 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Clock, 
  Users,
  Utensils,
  Plus,
  ShoppingCart
} from 'lucide-react';
import api from '../../api/api';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [portionCount, setPortionCount] = useState(null);
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  
  useEffect(() => {
    loadRecipe();
    loadShoppingLists();
  }, [id]);
  
  const loadRecipe = async () => {
    try {
      setLoading(true);
      
      const response = await api.get(`/meals/recipes/${id}`);
      const recipeData = response.data.data;
      
      setRecipe(recipeData);
      setPortionCount(recipeData.serving);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden des Rezepts:', err);
      setError('Rezept konnte nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };
  
  const loadShoppingLists = async () => {
    try {
      const response = await api.get('/shopping');
      setShoppingLists(response.data.data || []);
    } catch (err) {
      console.error('Fehler beim Laden der Einkaufslisten:', err);
    }
  };
  
  const handleDelete = async () => {
    try {
      setLoading(true);
      
      await api.delete(`/meals/recipes/${id}`);
      
      navigate('/meals');
    } catch (err) {
      console.error('Fehler beim Löschen des Rezepts:', err);
      setError('Das Rezept konnte nicht gelöscht werden.');
      setShowDeleteConfirm(false);
      setLoading(false);
    }
  };
  
  const handlePortionChange = (e) => {
    setPortionCount(Number(e.target.value));
  };
  
  const calculateAmount = (originalAmount) => {
    if (!recipe || !portionCount) return originalAmount;
    
    const factor = portionCount / recipe.serving;
    return (originalAmount * factor).toFixed(2).replace(/\.00$/, '');
  };
  
  const handleAddToShoppingList = async () => {
    try {
      setLoading(true);
      
      // Wenn keine Liste ausgewählt wurde, neue erstellen
      if (!selectedList) {
        const newListResponse = await api.post('/shopping', {
          name: `Zutaten für ${recipe.name}`,
          description: `Automatisch erstellt vom Rezept "${recipe.name}"`
        });
        
        const listId = newListResponse.data.data.id;
        
        // Zutaten zur neuen Liste hinzufügen
        for (const ingredient of recipe.ingredients) {
          await api.post(`/shopping/${listId}/items`, {
            name: ingredient.name,
            quantity: calculateAmount(ingredient.amount),
            unit: ingredient.unit,
            category: 'Lebensmittel'
          });
        }
        
        navigate(`/shopping/${listId}`);
      } else {
        // Zutaten zur ausgewählten Liste hinzufügen
        for (const ingredient of recipe.ingredients) {
          await api.post(`/shopping/${selectedList}/items`, {
            name: ingredient.name,
            quantity: calculateAmount(ingredient.amount),
            unit: ingredient.unit,
            category: 'Lebensmittel'
          });
        }
        
        navigate(`/shopping/${selectedList}`);
      }
    } catch (err) {
      console.error('Fehler beim Hinzufügen zur Einkaufsliste:', err);
      setError('Die Zutaten konnten nicht zur Einkaufsliste hinzugefügt werden.');
      setLoading(false);
    }
  };
  
  if (loading && !recipe) {
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
            onClick={() => navigate('/meals')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {recipe?.name}
          </h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowShoppingListModal(true)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            title="Zur Einkaufsliste hinzufügen"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigate(`/meals/recipes/${id}/edit`)}
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
      
      {recipe && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hauptinformationen */}
          <div className="md:col-span-2 space-y-6">
            {/* Bild (falls vorhanden) */}
            {recipe.image && (
              <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={`/api/meals/recipes/${id}/image`} 
                  alt={recipe.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Grundlegende Informationen */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Rezeptinformationen
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Details und Zutaten
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Kategorie</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {recipe.category}
                    </dd>
                  </div>
                  
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Zubereitungszeit</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {recipe.prepTime} Minuten
                    </dd>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Portionen</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                      <Utensils className="h-4 w-4 mr-2 text-gray-400" />
                      {recipe.serving} {recipe.serving === 1 ? 'Portion' : 'Portionen'}
                    </dd>
                  </div>
                  
                  {recipe.isPublic && (
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Öffentlich</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-500" />
                        Ja, dieses Rezept ist öffentlich sichtbar
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
            
            {/* Anleitung */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Zubereitung
                </h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5">
                <p className="text-sm text-gray-900 whitespace-pre-line">
                  {recipe.instructions}
                </p>
              </div>
            </div>
          </div>
          
          {/* Seitenleiste */}
          <div className="space-y-6">
            {/* Portionenrechner */}
            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Portionenrechner
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5">
                <div className="flex items-center mb-4">
                  <label htmlFor="portions" className="mr-2 text-sm text-gray-700">
                    Anzahl Portionen:
                  </label>
                  <input
                    type="number"
                    id="portions"
                    min="1"
                    value={portionCount}
                    onChange={handlePortionChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-16 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <button
                  onClick={() => setShowShoppingListModal(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Zur Einkaufsliste hinzufügen
                </button>
              </div>
            </div>
            
            {/* Zutaten */}
            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Zutaten
                </h3>
                {recipe.serving !== portionCount && (
                  <p className="mt-1 text-sm text-gray-500">
                    Berechnet für {portionCount} {portionCount === 1 ? 'Portion' : 'Portionen'}
                  </p>
                )}
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{ingredient.name}</span>
                        <span className="text-sm font-medium text-gray-500">
                          {calculateAmount(ingredient.amount)} {ingredient.unit}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Nährwerte (Platzhalter) */}
            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Nährwerte
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Geschätzte Nährwerte pro Portion
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5">
                <p className="text-center text-sm text-gray-500">
                  Nährwertinformationen sind für dieses Rezept nicht verfügbar.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Einkaufslisten-Modal */}
      {showShoppingListModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto w-full">
            <h3 className="text-lg font-medium text-gray-900">Zur Einkaufsliste hinzufügen</h3>
            <p className="mt-2 text-sm text-gray-500">
              Wählen Sie eine bestehende Liste aus oder erstellen Sie eine neue.
            </p>
            
            <div className="mt-4">
              <label htmlFor="shoppingList" className="block text-sm font-medium text-gray-700">
                Einkaufsliste
              </label>
              <select
                id="shoppingList"
                name="shoppingList"
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Neue Liste erstellen</option>
                {shoppingLists.map(list => (
                  <option key={list.id} value={list.id}>{list.name}</option>
                ))}
              </select>
            </div>
            
            <div className="mt-4 font-medium text-sm text-gray-700">
              <p>Folgende Zutaten werden hinzugefügt:</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-500">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.name} ({calculateAmount(ingredient.amount)} {ingredient.unit})
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowShoppingListModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleAddToShoppingList}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                {loading ? 'Wird hinzugefügt...' : 'Hinzufügen'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Löschen-Bestätigungsdialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900">Rezept löschen</h3>
            <p className="mt-2 text-sm text-gray-500">
              Sind Sie sicher, dass Sie dieses Rezept löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
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

export default RecipeDetail;