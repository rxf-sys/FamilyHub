const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Artikelname ist erforderlich'],
    trim: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  unit: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    default: 'Sonstiges'
  },
  completed: {
    type: Boolean,
    default: false
  },
  note: String,
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const ShoppingListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Listenname ist erforderlich'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family'
  },
  items: [ItemSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isUrgent: {
    type: Boolean,
    default: false
  },
  dueDate: Date
}, { timestamps: true });

module.exports = mongoose.model('ShoppingList', ShoppingListSchema);