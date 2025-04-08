const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  }
});

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Sonstiges'
  },
  ingredients: [IngredientSchema],
  instructions: {
    type: String,
    required: true
  },
  prepTime: {
    type: Number,
    default: 30
  },
  serving: {
    type: Number,
    default: 4
  },
  image: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);