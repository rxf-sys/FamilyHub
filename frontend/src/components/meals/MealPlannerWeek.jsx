// src/components/meals/MealPlannerWeek.jsx
import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { de } from 'date-fns/locale';
import { Edit2, Plus, ShoppingCart } from 'lucide-react';
import { mealService } from '../../services/mealService';

const MealPlannerWeek = ({ onGenerateShoppingList }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weekPlan, setWeekPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  // Mahlzeitentypen
  const mealTypes = [
    { id: 'breakfast', name: 'Frühstück' },
    { id: 'lunch', name: 'Mittagessen' },
    { id: 'dinner', name: 'Abendessen' }
  ];

  // Lade Wochenplan
  useEffect(() => {
    loadWeekPlan();
  }, [currentWeekStart]);

  const loadWeekPlan = async () => {
    try {
      setLoading(true);
      
      // Erstelle ein Array mit den Daten der aktuellen Woche
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(currentWeekStart, i);
        return format(date, 'yyyy-MM-dd');
      });
      
      // Lade den Plan für jeden Tag
      const plans = await Promise.all(
        weekDates.map(date => mealService.getMealPlanForDate(date))
      );
      
      setWeekPlan(plans);
    } catch (error) {
      console.error('Fehler beim Laden des Wochenplans:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateWeek = (direction) => {
    setCurrentWeekStart(prevStart => {
      const days = direction === 'prev' ? -7 : 7;
      return addDays(prevStart, days);
    });
  };

  const handleCellClick = (dayIndex, mealType) => {
    const plan = weekPlan[dayIndex];
    const meal = plan.meals.find(m => m.type === mealType);
    
    setEditingCell({ dayIndex, mealType });
    setEditValue(meal ? meal.name : '');
  };

  const handleInputChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleInputBlur = async () => {
    if (editingCell) {
      try {
        const { dayIndex, mealType } = editingCell;
        const plan = { ...weekPlan[dayIndex] };
        
        // Aktualisiere die Mahlzeit
        const mealIndex = plan.meals.findIndex(m => m.type === mealType);
        if (mealIndex !== -1) {
          plan.meals[mealIndex].name = editValue;
        } else {
          plan.meals.push({ type: mealType, mealId: null, name: editValue });
        }
        
        // Speichere den aktualisierten Plan
        await mealService.updateMealPlan(plan.date, plan.meals);
        
        // Aktualisiere den Zustand
        const newWeekPlan = [...weekPlan];
        newWeekPlan[dayIndex] = plan;
        setWeekPlan(newWeekPlan);
      } catch (error) {
        console.error('Fehler beim Speichern der Mahlzeit:', error);
      }
      
      setEditingCell(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  const handleGenerateShoppingList = () => {
    // Sammle die Daten der aktuellen Woche
    const weekDates = weekPlan.map(day => day.date);
    onGenerateShoppingList(weekDates);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Wochennavigation */}
      <div className="flex justify-between items-center p-4 border-b">
        <button
          onClick={() => navigateWeek('prev')}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
        >
          &larr; Vorherige Woche
        </button>
        
        <h2 className="text-lg font-medium text-gray-900">
          {format(currentWeekStart, 'dd. MMMM', { locale: de })} - {format(addDays(currentWeekStart, 6), 'dd. MMMM yyyy', { locale: de })}
        </h2>
        
        <button
          onClick={() => navigateWeek('next')}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
        >
          Nächste Woche &rarr;
        </button>
      </div>
      
      {/* Einkaufslisten-Button */}
      <div className="p-4 border-b bg-gray-50">
        <button
          onClick={handleGenerateShoppingList}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Einkaufsliste für diese Woche erstellen
        </button>
      </div>
      
      {/* Mahlzeitenplan-Tabelle */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mahlzeit
              </th>
              {weekPlan.map((day, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {format(new Date(day.date), 'EEEE', { locale: de })}
                  <br />
                  <span className="text-gray-400">
                    {format(new Date(day.date), 'dd.MM.', { locale: de })}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mealTypes.map(mealType => (
              <tr key={mealType.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {mealType.name}
                </td>
                {weekPlan.map((day, dayIndex) => {
                  const meal = day.meals.find(m => m.type === mealType.id);
                  const isEditing = editingCell && 
                                   editingCell.dayIndex === dayIndex && 
                                   editingCell.mealType === mealType.id;
                  
                  return (
                    <td 
                      key={dayIndex} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleCellClick(dayIndex, mealType.id)}
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          onKeyPress={handleKeyPress}
                          autoFocus
                          className="w-full p-1 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex items-center justify-between">
                          <span>{meal?.name || '-'}</span>
                          <Edit2 className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MealPlannerWeek;