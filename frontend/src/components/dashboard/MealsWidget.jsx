// src/components/dashboard/MealsWidget.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Coffee, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const MealsWidget = ({ meals = [] }) => {
  const today = new Date();
  
  // Mahlzeiten nach Typ sortieren (Frühstück, Mittagessen, Abendessen)
  const sortedMeals = [...meals].sort((a, b) => {
    const typeOrder = { breakfast: 1, lunch: 2, dinner: 3, snack: 4 };
    return typeOrder[a.type] - typeOrder[b.type];
  });
  
  // Benutzerfreundlichen Namen für Mahlzeitentyp anzeigen
  const getMealTypeName = (type) => {
    switch (type) {
      case 'breakfast':
        return 'Frühstück';
      case 'lunch':
        return 'Mittagessen';
      case 'dinner':
        return 'Abendessen';
      case 'snack':
        return 'Snack';
      default:
        return type;
    }
  };
  
  // Icon für Mahlzeitentyp auswählen
  const getMealTypeIcon = (type) => {
    switch (type) {
      case 'breakfast':
        return <Coffee className="h-4 w-4 text-orange-500" />;
      case 'lunch':
      case 'dinner':
        return <Utensils className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-green-500" />;
    }
  };
  
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        {format(today, 'EEEE, d. MMMM', { locale: de })}
      </p>
      
      {sortedMeals.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <Utensils className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">Keine Mahlzeiten für heute geplant</p>
        </div>
      ) : (
        <>
          {sortedMeals.map(meal => (
            <div key={meal._id || meal.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
              <div className="flex items-center">
                <span className="mr-2">
                  {getMealTypeIcon(meal.type)}
                </span>
                <div>
                  <p className="font-medium">{getMealTypeName(meal.type)}</p>
                  <p className="text-sm">{meal.name}</p>
                </div>
              </div>
              
              {/* Wenn das Rezept verknüpft ist, zeigen wir einen Link an */}
              {meal.recipe && (
                <Link
                  to={`/meals/recipes/${meal.recipe._id || meal.recipe.id}`}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                >
                  Rezept
                </Link>
              )}
            </div>
          ))}
          <Link to="/meals" className="block mt-2 text-blue-600 text-sm font-medium hover:text-blue-800">
            Zum Wochenplan
          </Link>
        </>
      )}
    </div>
  );
};

export default MealsWidget;