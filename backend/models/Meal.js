const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  },
  name: {
    type: String,
    required: true
  },
  notes: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family'
  }
}, { timestamps: true });

module.exports = mongoose.model('Meal', MealSchema);