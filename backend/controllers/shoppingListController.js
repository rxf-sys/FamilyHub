// controllers/shoppingListController.js

// Shopping List Controller

const ShoppingList = require('../models/ShoppingList');

// Alle Einkaufslisten eines Benutzers abrufen
exports.getLists = async (req, res) => {
  try {
    // Listen finden, die vom Benutzer erstellt oder mit ihm geteilt wurden
    const lists = await ShoppingList.find({
      $or: [
        { createdBy: req.user.id },
        { sharedWith: req.user.id }
      ]
    }).sort({ updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: lists.length,
      data: lists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Einkaufslisten',
      error: error.message
    });
  }
};

// Eine einzelne Einkaufsliste abrufen
exports.getList = async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('sharedWith', 'firstName lastName');
    
    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'Einkaufsliste nicht gefunden'
      });
    }

    // Prüfen, ob der Benutzer Zugriff auf die Liste hat
    if (list.createdBy._id.toString() !== req.user.id && 
        !list.sharedWith.some(user => user._id.toString() === req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert'
      });
    }
    
    res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Einkaufsliste',
      error: error.message
    });
  }
};

// Neue Einkaufsliste erstellen
exports.createList = async (req, res) => {
  try {
    const { name, description, family, sharedWith, isUrgent, dueDate } = req.body;
    
    const list = await ShoppingList.create({
      name,
      description,
      family,
      sharedWith: sharedWith || [],
      isUrgent: isUrgent || false,
      dueDate,
      createdBy: req.user.id,
      items: []
    });
    
    res.status(201).json({
      success: true,
      data: list
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Erstellen der Einkaufsliste',
      error: error.message
    });
  }
};

// Einkaufsliste aktualisieren
exports.updateList = async (req, res) => {
  try {
    const { name, description, family, sharedWith, isUrgent, dueDate } = req.body;
    
    let list = await ShoppingList.findById(req.params.id);
    
    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'Einkaufsliste nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Ersteller der Liste ist
    if (list.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nur der Ersteller kann die Liste aktualisieren'
      });
    }
    
    list = await ShoppingList.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        family,
        sharedWith,
        isUrgent,
        dueDate
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Aktualisieren der Einkaufsliste',
      error: error.message
    });
  }
};

// Einkaufsliste löschen
exports.deleteList = async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);
    
    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'Einkaufsliste nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Ersteller der Liste ist
    if (list.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nur der Ersteller kann die Liste löschen'
      });
    }
    
    await list.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Löschen der Einkaufsliste',
      error: error.message
    });
  }
};

// Artikel zu einer Einkaufsliste hinzufügen
exports.addItem = async (req, res) => {
  try {
    const { name, quantity, unit, category, note } = req.body;
    
    const list = await ShoppingList.findById(req.params.id);
    
    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'Einkaufsliste nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer Zugriff auf die Liste hat
    if (list.createdBy.toString() !== req.user.id && 
        !list.sharedWith.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert'
      });
    }
    
    // Artikel hinzufügen
    list.items.push({
      name,
      quantity: quantity || 1,
      unit,
      category: category || 'Sonstiges',
      note,
      completed: false,
      addedBy: req.user.id
    });
    
    await list.save();
    
    res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Hinzufügen des Artikels',
      error: error.message
    });
  }
};

// Artikel in einer Einkaufsliste aktualisieren
exports.updateItem = async (req, res) => {
  try {
    const { name, quantity, unit, category, note, completed } = req.body;
    
    const list = await ShoppingList.findById(req.params.listId);
    
    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'Einkaufsliste nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer Zugriff auf die Liste hat
    if (list.createdBy.toString() !== req.user.id && 
        !list.sharedWith.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert'
      });
    }
    
    // Artikel finden und aktualisieren
    const item = list.items.id(req.params.itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Artikel nicht gefunden'
      });
    }
    
    // Artikel aktualisieren
    if (name) item.name = name;
    if (quantity) item.quantity = quantity;
    if (unit !== undefined) item.unit = unit;
    if (category) item.category = category;
    if (note !== undefined) item.note = note;
    if (completed !== undefined) item.completed = completed;
    
    await list.save();
    
    res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Aktualisieren des Artikels',
      error: error.message
    });
  }
};

// Artikel aus einer Einkaufsliste entfernen
exports.deleteItem = async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.listId);
    
    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'Einkaufsliste nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer Zugriff auf die Liste hat
    if (list.createdBy.toString() !== req.user.id && 
        !list.sharedWith.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert'
      });
    }
    
    // Artikel finden und entfernen
    list.items.id(req.params.itemId).remove();
    
    await list.save();
    
    res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Entfernen des Artikels',
      error: error.message
    });
  }
};