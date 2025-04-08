// src/components/meals/RecipeForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  AlertCircle, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Upload,
  ChevronsUp,
  ChevronsDown
} from 'lucide-react';
import api from '../../api/api';

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const imageInputRef = useRef(null);
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hauptgericht',
    ingredients: [],
    instructions: '',
    prepTime: 30,
    serving: 4,
    image: '',
    isPublic: false
  });
  
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    amount: '',
    unit: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Verfügbare Kategorien
  const categories = [
    'Frühstück',
    'Hauptgericht',
    'Beilage',
    'Suppe',
    'Salat',
    'Dessert',
    'Snack',
    'Getränk',
    'Backen',
    'Sonstiges'
  ];
  
  // Verfügbare Einheiten
  const units = [
    'g',
    'kg',
    'ml',
    'l',
    'TL',
    'EL',
    'Prise',
    'Stück',
    'Packung',
    'Dose',
    'Bund',
    'nach Geschmack'
  ];
  
  useEffect(() => {
    if (isEditMode) {
      loadRecipe();
    }
  }, [id]);
  
  const loadRecipe = async () => {
    try {
      setLoading(true);
      
      const response = await api.get(`/meals/recipes/${id}`);
      const recipe = response.data.data;
      
      setFormData(recipe);
      
      // Wenn ein Bild vorhanden ist, Vorschau setzen
      if (recipe.image) {
        setImagePreview(`/api/meals/recipes/${id}/image`);
      }
      
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden des Rezepts:', err);
      setError('Rezept konnte nicht geladen werden.');
    } finally {
      setLoading(false);
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
  
  const handleIngredientChange = (e) => {
    const { name, value } = e.target;
    setNewIngredient(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Bild-Vorschau erstellen
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerImageInput = () => {
    imageInputRef.current.click();
  };
  
  const addIngredient = () => {
    // Validierung
    if (!newIngredient.name.trim() || !newIngredient.amount) {
      setError('Bitte geben Sie Name und Menge für die Zutat ein.');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { ...newIngredient }]
    }));
    
    // Zurücksetzen des Formulars für neue Zutaten
    setNewIngredient({
      name: '',
      amount: '',
      unit: ''
    });
    
    setError(null);
  };
  
  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };
  
  const moveIngredient = (index, direction) => {
    const newIngredients = [...formData.ingredients];
    
    if (direction === 'up' && index > 0) {
      // Tausche mit dem Element darüber
      [newIngredients[index], newIngredients[index - 1]] = 
      [newIngredients[index - 1], newIngredients[index]];
    } else if (direction === 'down' && index < newIngredients.length - 1) {
      // Tausche mit dem Element darunter
      [newIngredients[index], newIngredients[index + 1]] = 
      [newIngredients[index + 1], newIngredients[index]];
    }
    
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validierung
    if (formData.ingredients.length === 0) {
      setError('Bitte fügen Sie mindestens eine Zutat hinzu.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Formular-Daten für den Upload vorbereiten
      const formDataToSend = new FormData();
      
      // Komplexe Objekte als JSON-String senden
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('ingredients', JSON.stringify(formData.ingredients));
      formDataToSend.append('instructions', formData.instructions);
      formDataToSend.append('prepTime', formData.prepTime);
      formDataToSend.append('serving', formData.serving);
      formDataToSend.append('isPublic', formData.isPublic);
      
      // Bild hinzufügen, wenn vorhanden
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      if (isEditMode) {
        // Bestehendes Rezept aktualisieren
        await api.put(`/meals/recipes/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        navigate(`/meals/recipes/${id}`);
      } else {
        // Neues Rezept erstellen
        const response = await api.post('/meals/recipes', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        navigate(`/meals/recipes/${response.data.data.id}`);
      }
    } catch (err) {
      console.error('Fehler beim Speichern des Rezepts:', err);
      setError('Rezept konnte nicht gespeichert werden.');
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/meals')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Rezept bearbeiten' : 'Neues Rezept'}
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
              <div className="sm:col-span-4">
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
              
              <div className="sm:col-span-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Kategorie
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700">
                  Zubereitungszeit (Minuten)
                </label>
                <input
                  type="number"
                  name="prepTime"
                  id="prepTime"
                  min="1"
                  value={formData.prepTime}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="serving" className="block text-sm font-medium text-gray-700">
                  Portionen
                </label>
                <input
                  type="number"
                  name="serving"
                  id="serving"
                  min="1"
                  value={formData.serving}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="isPublic"
                      name="isPublic"
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isPublic" className="font-medium text-gray-700">
                      Öffentlich teilen
                    </label>
                    <p className="text-gray-500">
                      Wenn aktiviert, können andere Benutzer dieses Rezept sehen und verwenden.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bild-Upload */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Bild (optional)</h2>
            <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              {imagePreview ? (
                <div className="space-y-2 text-center">
                  <img 
                    src={imagePreview} 
                    alt="Rezeptvorschau" 
                    className="mx-auto h-48 w-auto object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={triggerImageInput}
                    className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Bild ändern
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span onClick={triggerImageInput}>Bild auswählen</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        ref={imageInputRef}
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">oder hierher ziehen</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF bis zu 5MB
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Zutaten */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Zutaten</h2>
            
            {/* Bestehende Zutaten */}
            {formData.ingredients.length > 0 && (
              <div className="mt-4 mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Zutatenliste</h3>
                <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                  {formData.ingredients.map((ingredient, index) => (
                    <li key={index} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {ingredient.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {ingredient.amount} {ingredient.unit}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => moveIngredient(index, 'up')}
                          disabled={index === 0}
                          className={`p-1 rounded-full ${
                            index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <ChevronsUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveIngredient(index, 'down')}
                          disabled={index === formData.ingredients.length - 1}
                          className={`p-1 rounded-full ${
                            index === formData.ingredients.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <ChevronsDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
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
            
            {/* Neue Zutat hinzufügen */}
            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 bg-gray-50 p-4 rounded-md">
              <div className="sm:col-span-3">
                <label htmlFor="ingredientName" className="block text-sm font-medium text-gray-700">
                  Zutat
                </label>
                <input
                  type="text"
                  name="name"
                  id="ingredientName"
                  value={newIngredient.name}
                  onChange={handleIngredientChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="z.B. Mehl"
                />
              </div>
              
              <div className="sm:col-span-1">
                <label htmlFor="ingredientAmount" className="block text-sm font-medium text-gray-700">
                  Menge
                </label>
                <input
                  type="text"
                  name="amount"
                  id="ingredientAmount"
                  value={newIngredient.amount}
                  onChange={handleIngredientChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="z.B. 250"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="ingredientUnit" className="block text-sm font-medium text-gray-700">
                  Einheit
                </label>
                <select
                  id="ingredientUnit"
                  name="unit"
                  value={newIngredient.unit}
                  onChange={handleIngredientChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Einheit wählen</option>
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              
              <div className="sm:col-span-6">
                <button
                  type="button"
                  onClick={addIngredient}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Zutat hinzufügen
                </button>
              </div>
            </div>
          </div>
          
          {/* Anleitung */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Zubereitung</h2>
            <div className="mt-4">
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                Anleitung
              </label>
              <textarea
                id="instructions"
                name="instructions"
                rows="8"
                required
                value={formData.instructions}
                onChange={handleChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Beschreiben Sie die Zubereitungsschritte..."
              ></textarea>
              <p className="mt-1 text-sm text-gray-500">
                Geben Sie detaillierte Anweisungen zur Zubereitung des Rezepts.
              </p>
            </div>
          </div>
          
          {/* Speichern- und Abbrechen-Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/meals')}
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

export default RecipeForm;