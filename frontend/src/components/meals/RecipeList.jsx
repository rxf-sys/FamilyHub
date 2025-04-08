// src/components/meals/RecipeList.jsx
import React, { useState } from 'react';
import { Utensils, Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecipeList = ({ recipes, onRecipeClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Alle Kategorien aus den Rezepten extrahieren
  const categories = ['all', ...new Set(recipes.map(recipe => recipe.category))];
  
  // Rezepte filtern
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Rezepte</h2>
        <Link 
          to="/meals/recipes/new" 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Neues Rezept
        </Link>
      </div>
      
      {/* Suchleiste */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rezepte durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-48 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Alle Kategorien' : category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Rezepte-Liste */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Utensils className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Rezepte gefunden</h3>
          <p className="mt-1 text-sm text-gray-500">
            Fügen Sie neue Rezepte hinzu oder ändern Sie Ihre Suchkriterien.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map(recipe => (
            <div 
              key={recipe.id}
              className="bg-white rounded-lg shadow overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => onRecipeClick(recipe)}
            >
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                {recipe.image ? (
                  <img 
                    src={`/images/${recipe.image}`} 
                    alt={recipe.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Utensils className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{recipe.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{recipe.category}</p>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <span>Zubereitung: {recipe.prepTime} min</span>
                  <span>Portionen: {recipe.serving}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;