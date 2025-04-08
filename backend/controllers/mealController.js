// controllers/mealController.js

// Meal Controller

const Meal = require('../models/Meal');
const Recipe = require('../models/Recipe');
const Family = require('../models/Family');
const ShoppingList = require('../models/ShoppingList');

/**
 * Alle Rezepte eines Benutzers und öffentliche Rezepte abrufen
 */
exports.getRecipes = async (req, res) => {
  try {
    const { category, query } = req.query;

    const filter = {
      $or: [
        { user: req.user.id },
        { isPublic: true }
      ]
    };

    // Nach Kategorie filtern
    if (category) {
      filter.category = category;
    }

    // Textsuche
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { ingredients: { $elemMatch: { name: { $regex: query, $options: 'i' } } } }
      ];
    }

    const recipes = await Recipe.find(filter).sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Rezepte:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der Rezepte',
      error: error.message
    });
  }
};

/**
 * Ein einzelnes Rezept abrufen
 */
exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Rezept nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer Zugriff auf das Rezept hat
    if (recipe.user.toString() !== req.user.id && !recipe.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert'
      });
    }
    
    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Rezepts:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen des Rezepts',
      error: error.message
    });
  }
};

/**
 * Neues Rezept erstellen
 */
exports.createRecipe = async (req, res) => {
  try {
    const {
      name,
      category,
      ingredients,
      instructions,
      prepTime,
      serving,
      image,
      isPublic
    } = req.body;
    
    // Rezept erstellen
    const recipe = await Recipe.create({
      name,
      category: category || 'Sonstiges',
      ingredients: ingredients || [],
      instructions,
      prepTime: prepTime || 30,
      serving: serving || 4,
      image,
      user: req.user.id,
      isPublic: isPublic === true || isPublic === 'true'
    });
    
    res.status(201).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Fehler beim Erstellen des Rezepts:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Erstellen des Rezepts',
      error: error.message
    });
  }
};

/**
 * Rezept aktualisieren
 */
exports.updateRecipe = async (req, res) => {
  try {
    const {
      name,
      category,
      ingredients,
      instructions,
      prepTime,
      serving,
      image,
      isPublic
    } = req.body;
    
    let recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Rezept nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Eigentümer des Rezepts ist
    if (recipe.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert. Nur der Eigentümer kann das Rezept aktualisieren'
      });
    }
    
    // Rezept aktualisieren
    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        ingredients,
        instructions,
        prepTime,
        serving,
        image,
        isPublic
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Rezepts:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Aktualisieren des Rezepts',
      error: error.message
    });
  }
};

/**
 * Rezept löschen
 */
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Rezept nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Eigentümer des Rezepts ist
    if (recipe.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert. Nur der Eigentümer kann das Rezept löschen'
      });
    }
    
    // Rezept löschen
    await recipe.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Fehler beim Löschen des Rezepts:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Löschen des Rezepts',
      error: error.message
    });
  }
};

/**
 * Mahlzeitenplan für einen Zeitraum abrufen
 */
exports.getMealPlan = async (req, res) => {
  try {
    const { start, end, family } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: 'Start- und Enddatum sind erforderlich'
      });
    }
    
    const query = {
      user: req.user.id,
      date: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    };
    
    // Nach Familie filtern
    if (family) {
      // Prüfen, ob der Benutzer Mitglied der Familie ist
      const isMember = await Family.findOne({
        _id: family,
        'members.user': req.user.id
      });
      
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'Zugriff verweigert. Sie sind kein Mitglied dieser Familie'
        });
      }
      
      query.family = family;
    }
    
    const meals = await Meal.find(query)
      .populate('recipe')
      .sort('date');
    
    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Mahlzeitenplans:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen des Mahlzeitenplans',
      error: error.message
    });
  }
};

/**
 * Mahlzeit zum Plan hinzufügen
 */
exports.addMeal = async (req, res) => {
  try {
    const { date, type, recipe, name, notes, family } = req.body;
    
    if (!date || !type || !name) {
      return res.status(400).json({
        success: false,
        message: 'Datum, Mahlzeittyp und Name sind erforderlich'
      });
    }
    
    // Wenn eine Familie angegeben wurde, prüfen ob der Benutzer Mitglied ist
    if (family) {
      const isFamilyMember = await Family.findOne({
        _id: family,
        'members.user': req.user.id
      });
      
      if (!isFamilyMember) {
        return res.status(400).json({
          success: false,
          message: 'Sie sind kein Mitglied dieser Familie'
        });
      }
    }
    
    // Mahlzeit erstellen
    const meal = await Meal.create({
      date: new Date(date),
      type,
      recipe,
      name,
      notes,
      user: req.user.id,
      family
    });
    
    // Wenn ein Rezept angegeben wurde, die Daten nachladen
    let populatedMeal = meal;
    if (recipe) {
      populatedMeal = await Meal.findById(meal._id).populate('recipe');
    }
    
    res.status(201).json({
      success: true,
      data: populatedMeal
    });
  } catch (error) {
    console.error('Fehler beim Hinzufügen der Mahlzeit:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Hinzufügen der Mahlzeit',
      error: error.message
    });
  }
};

/**
 * Mahlzeit aktualisieren
 */
exports.updateMeal = async (req, res) => {
  try {
    const { date, type, recipe, name, notes, family } = req.body;
    
    let meal = await Meal.findById(req.params.id);
    
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Mahlzeit nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Eigentümer der Mahlzeit ist
    if (meal.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert. Nur der Eigentümer kann die Mahlzeit aktualisieren'
      });
    }
    
    // Wenn eine Familie angegeben wurde, prüfen ob der Benutzer Mitglied ist
    if (family) {
      const isFamilyMember = await Family.findOne({
        _id: family,
        'members.user': req.user.id
      });
      
      if (!isFamilyMember) {
        return res.status(400).json({
          success: false,
          message: 'Sie sind kein Mitglied dieser Familie'
        });
      }
    }
    
    // Mahlzeit aktualisieren
    meal = await Meal.findByIdAndUpdate(
      req.params.id,
      {
        date: date ? new Date(date) : meal.date,
        type: type || meal.type,
        recipe,
        name: name || meal.name,
        notes,
        family
      },
      { new: true, runValidators: true }
    ).populate('recipe');
    
    res.status(200).json({
      success: true,
      data: meal
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Mahlzeit:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Aktualisieren der Mahlzeit',
      error: error.message
    });
  }
};

/**
 * Mahlzeit löschen
 */
exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Mahlzeit nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Eigentümer der Mahlzeit ist
    if (meal.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert. Nur der Eigentümer kann die Mahlzeit löschen'
      });
    }
    
    await meal.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Fehler beim Löschen der Mahlzeit:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Löschen der Mahlzeit',
      error: error.message
    });
  }
};

/**
 * Zutaten eines Rezepts zur Einkaufsliste hinzufügen
 */
exports.addToShoppingList = async (req, res) => {
  try {
    const { recipeId, listId, servings } = req.body;
    
    // Rezept abrufen
    const recipe = await Recipe.findById(recipeId);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Rezept nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer Zugriff auf das Rezept hat
    if (recipe.user.toString() !== req.user.id && !recipe.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert. Kein Zugriff auf dieses Rezept'
      });
    }
    
    // Bestehende oder neue Einkaufsliste abrufen/erstellen
    let shoppingList;
    
    if (listId) {
      // Bestehende Liste abrufen
      shoppingList = await ShoppingList.findById(listId);
      
      if (!shoppingList) {
        return res.status(404).json({
          success: false,
          message: 'Einkaufsliste nicht gefunden'
        });
      }
      
      // Prüfen, ob der Benutzer Zugriff auf die Liste hat
      if (shoppingList.createdBy.toString() !== req.user.id && 
          !shoppingList.sharedWith.includes(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: 'Zugriff verweigert. Kein Zugriff auf diese Einkaufsliste'
        });
      }
    } else {
      // Neue Liste erstellen
      shoppingList = await ShoppingList.create({
        name: `Einkaufsliste für ${recipe.name}`,
        createdBy: req.user.id,
        items: []
      });
    }
    
    // Multiplikator für die Zutatenmengen basierend auf der gewünschten Portionsgröße
    const multiplier = servings ? servings / recipe.serving : 1;
    
    // Zutaten zur Einkaufsliste hinzufügen
    for (const ingredient of recipe.ingredients) {
      // Prüfen, ob der Artikel bereits in der Liste ist
      const existingItem = shoppingList.items.find(item => 
        item.name.toLowerCase() === ingredient.name.toLowerCase() && 
        item.unit === ingredient.unit
      );
      
      if (existingItem) {
        // Bestehendem Artikel Menge hinzufügen
        existingItem.quantity += ingredient.amount * multiplier;
      } else {
        // Neuen Artikel hinzufügen
        shoppingList.items.push({
          name: ingredient.name,
          quantity: ingredient.amount * multiplier,
          unit: ingredient.unit,
          category: 'Lebensmittel',
          addedBy: req.user.id
        });
      }
    }
    
    await shoppingList.save();
    
    res.status(200).json({
      success: true,
      data: shoppingList
    });
  } catch (error) {
    console.error('Fehler beim Hinzufügen zur Einkaufsliste:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Hinzufügen zur Einkaufsliste',
      error: error.message
    });
  }
};