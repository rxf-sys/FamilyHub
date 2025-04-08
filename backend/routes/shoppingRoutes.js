const express = require('express');
const router = express.Router();
const {
  getLists,
  getList,
  createList,
  updateList,
  deleteList,
  addItem,
  updateItem,
  deleteItem
} = require('../controllers/shoppingListController');
const { protect } = require('../middleware/auth');

// Alle Routen schützen
router.use(protect);

// Listen-Routen
router.route('/')
  .get(getLists)
  .post(createList);

router.route('/:id')
  .get(getList)
  .put(updateList)
  .delete(deleteList);

// Artikel-Routen
router.post('/:id/items', addItem);
router.put('/:listId/items/:itemId', updateItem);
router.delete('/:listId/items/:itemId', deleteItem);

module.exports = router;