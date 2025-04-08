const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getMealPlan,
  addMeal,
  updateMeal,
  deleteMeal,
  addToShoppingList
} = require('../controllers/mealController');
const { protect } = require('../middleware/auth');

// Alle Routen schützen
router.use(protect);

// Rezept-Routen
router.route('/recipes')
  .get(getRecipes)
  .post(createRecipe);

router.route('/recipes/:id')
  .get(getRecipe)
  .put(updateRecipe)
  .delete(deleteRecipe);

// Mahlzeiten-Routen
router.route('/plan')
  .get(getMealPlan);

router.route('/plan/meals')
  .post(addMeal);

router.route('/plan/meals/:id')
  .put(updateMeal)
  .delete(deleteMeal);

// Zutaten zur Einkaufsliste hinzufügen
router.post('/recipes/add-to-shopping-list', addToShoppingList);

module.exports = router;