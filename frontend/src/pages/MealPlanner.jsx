// src/pages/MealPlanner.jsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, ShoppingCart } from 'lucide-react';
import { mealService } from '../services/mealService';
import MealPlannerWeek from '../components/meals/MealPlannerWeek';
import RecipeList from '../components/meals/RecipeList';

const MealPlanner = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRecipeDetail, setShowRecipeDetail] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [shoppingListItems, setShoppingListItems] = useState([]);
  const [showShoppingList, setShowShoppingList] = useState(false);
  
  useEffect(() => {
    loadRecipes();
  }, []);
  
  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await mealService.getMeals();
      setRecipes(data);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Rezepte:', err);
      setError('Rezepte konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeDetail(true);
  };
  
  const handleGenerateShoppingList = async (dates) => {
    try {
      setLoading(true);
      const ingredients = await mealService.createShoppingList(dates);
      setShoppingListItems(ingredients);
      setShowShoppingList(true);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Erstellen der Einkaufsliste:', err);
      setError('Einkaufsliste konnte nicht erstellt werden.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mahlzeitenplaner</h1>
        <p className="text-gray-600">Planen Sie Ihre Mahlzeiten für die Woche und erstellen Sie automatisch Einkaufslisten.</p>
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
      
      {/* Wochenplaner */}
      <section>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Wochenplan</h2>
        <MealPlannerWeek onGenerateShoppingList={handleGenerateShoppingList} />
      </section>
      
      {/* Einkaufsliste-Modal */}
      {showShoppingList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Einkaufsliste</h2>
              <button 
                onClick={() => setShowShoppingList(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            {shoppingListItems.length === 0 ? (
              <p className="text-gray-500">Keine Zutaten gefunden.</p>
            ) : (
              <div className="space-y-4">
                <ul className="divide-y divide-gray-200">
                  {shoppingListItems.map((item, index) => (
                    <li key={index} className="py-3 flex justify-between">
                      <span>{item.name}</span>
                      <span className="text-gray-500">{item.amount} {item.unit}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowShoppingList(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Schließen
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    <ShoppingCart className="inline-block h-4 w-4 mr-2" />
                    Zur Einkaufsliste hinzufügen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Rezeptdetail-Modal */}
      {showRecipeDetail && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{selectedRecipe.name}</h2>
              <button 
                onClick={() => setShowRecipeDetail(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span>{selectedRecipe.category}</span>
                <span>•</span>
                <span>{selectedRecipe.prepTime} Minuten</span>
                <span>•</span>
                <span>{selectedRecipe.serving} Portionen</span>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900">Zutaten</h3>
              <ul className="divide-y divide-gray-200">
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="py-2 flex justify-between">
                    <span>{ingredient.name}</span>
                    <span className="text-gray-500">{ingredient.amount} {ingredient.unit}</span>
                  </li>
                ))}
              </ul>
              
              <h3 className="text-lg font-medium text-gray-900">Zubereitung</h3>
              <p className="text-gray-700 whitespace-pre-line">{selectedRecipe.instructions}</p>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowRecipeDetail(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Schließen
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Zum Wochenplan hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Rezepte */}
      <section>
        <RecipeList 
          recipes={recipes} 
          onRecipeClick={handleRecipeClick} 
        />
      </section>
    </div>
  );
};

export default MealPlanner;