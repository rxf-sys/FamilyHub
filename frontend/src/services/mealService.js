// src/services/mealService.js

// Demo-Daten für den Mahlzeitenplaner
const meals = [
    {
      id: '1',
      name: 'Spaghetti Bolognese',
      category: 'Hauptgericht',
      ingredients: [
        { name: 'Spaghetti', amount: '500', unit: 'g' },
        { name: 'Hackfleisch', amount: '400', unit: 'g' },
        { name: 'Zwiebeln', amount: '2', unit: 'Stück' },
        { name: 'Tomatenmark', amount: '2', unit: 'EL' },
        { name: 'Dosentomaten', amount: '1', unit: 'Dose' },
        { name: 'Knoblauch', amount: '2', unit: 'Zehen' }
      ],
      instructions: 'Zwiebeln und Knoblauch anbraten. Hackfleisch dazugeben und krümelig braten. Tomatenmark kurz mitrösten, dann mit Dosentomaten ablöschen. Würzen und mindestens 30 Minuten köcheln lassen. In der Zwischenzeit Spaghetti kochen.',
      prepTime: 45,
      serving: 4,
      image: 'spaghetti.jpg'
    },
    {
      id: '2',
      name: 'Gemüseauflauf',
      category: 'Hauptgericht',
      ingredients: [
        { name: 'Zucchini', amount: '2', unit: 'Stück' },
        { name: 'Paprika', amount: '1', unit: 'Stück' },
        { name: 'Kartoffeln', amount: '500', unit: 'g' },
        { name: 'Käse', amount: '200', unit: 'g' },
        { name: 'Sahne', amount: '200', unit: 'ml' },
        { name: 'Eier', amount: '3', unit: 'Stück' }
      ],
      instructions: 'Gemüse waschen und in Scheiben schneiden. Kartoffeln vorkochen. Alles schichtweise in eine Auflaufform geben. Eier mit Sahne verquirlen, würzen und darüber gießen. Mit Käse bestreuen und bei 180°C ca. 30 Minuten backen.',
      prepTime: 60,
      serving: 4,
      image: 'gemueseauflauf.jpg'
    }
  ];
  
  // Demo-Daten für den Mahlzeitenplan
  const mealPlan = [
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      meals: [
        { type: 'breakfast', mealId: null, name: 'Müsli mit Obst' },
        { type: 'lunch', mealId: '1', name: 'Spaghetti Bolognese' },
        { type: 'dinner', mealId: null, name: 'Brot mit Käse' }
      ]
    },
    {
      id: '2',
      date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      meals: [
        { type: 'breakfast', mealId: null, name: 'Toast mit Marmelade' },
        { type: 'lunch', mealId: null, name: 'Salat mit Feta' },
        { type: 'dinner', mealId: '2', name: 'Gemüseauflauf' }
      ]
    }
  ];
  
  export const mealService = {
    // Rezepte
    getMeals: () => {
      return Promise.resolve(meals);
    },
    
    getMealById: (id) => {
      const meal = meals.find(m => m.id === id);
      if (meal) {
        return Promise.resolve(meal);
      }
      return Promise.reject(new Error('Mahlzeit nicht gefunden'));
    },
    
    createMeal: (mealData) => {
      const newMeal = {
        ...mealData,
        id: Date.now().toString()
      };
      meals.push(newMeal);
      return Promise.resolve(newMeal);
    },
    
    updateMeal: (id, mealData) => {
      const index = meals.findIndex(m => m.id === id);
      if (index !== -1) {
        meals[index] = { ...meals[index], ...mealData };
        return Promise.resolve(meals[index]);
      }
      return Promise.reject(new Error('Mahlzeit nicht gefunden'));
    },
    
    deleteMeal: (id) => {
      const index = meals.findIndex(m => m.id === id);
      if (index !== -1) {
        const deletedMeal = meals.splice(index, 1)[0];
        return Promise.resolve(deletedMeal);
      }
      return Promise.reject(new Error('Mahlzeit nicht gefunden'));
    },
    
    // Mahlzeitenplan
    getMealPlan: (startDate, endDate) => {
      return Promise.resolve(mealPlan);
    },
    
    getMealPlanForDate: (date) => {
      const dayPlan = mealPlan.find(p => p.date === date);
      if (dayPlan) {
        return Promise.resolve(dayPlan);
      }
      return Promise.resolve({
        date,
        meals: [
          { type: 'breakfast', mealId: null, name: '' },
          { type: 'lunch', mealId: null, name: '' },
          { type: 'dinner', mealId: null, name: '' }
        ]
      });
    },
    
    updateMealPlan: (date, meals) => {
      const index = mealPlan.findIndex(p => p.date === date);
      if (index !== -1) {
        mealPlan[index].meals = meals;
        return Promise.resolve(mealPlan[index]);
      } else {
        const newPlan = {
          id: Date.now().toString(),
          date,
          meals
        };
        mealPlan.push(newPlan);
        return Promise.resolve(newPlan);
      }
    },
    
    // Einkaufsliste aus Mahlzeitenplan erstellen
    createShoppingList: (dates) => {
      const ingredients = [];
      
      // Alle Mahlzeiten im angegebenen Zeitraum finden
      const relevantPlans = mealPlan.filter(p => dates.includes(p.date));
      
      // Durchlaufe alle Pläne und sammle Zutaten
      relevantPlans.forEach(plan => {
        plan.meals.forEach(meal => {
          if (meal.mealId) {
            const mealData = meals.find(m => m.id === meal.mealId);
            if (mealData) {
              mealData.ingredients.forEach(ingredient => {
                // Prüfe, ob die Zutat bereits in der Liste ist
                const existingIngredient = ingredients.find(i => 
                  i.name.toLowerCase() === ingredient.name.toLowerCase() && i.unit === ingredient.unit
                );
                
                if (existingIngredient) {
                  // Addiere die Menge
                  existingIngredient.amount = (parseFloat(existingIngredient.amount) + parseFloat(ingredient.amount)).toString();
                } else {
                  // Füge neue Zutat hinzu
                  ingredients.push({ ...ingredient });
                }
              });
            }
          }
        });
      });
      
      return Promise.resolve(ingredients);
    }
  };