const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Vorname ist erforderlich'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Nachname ist erforderlich'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'E-Mail ist erforderlich'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Bitte geben Sie eine gültige E-Mail-Adresse ein']
  },
  password: {
    type: String,
    required: [true, 'Passwort ist erforderlich'],
    minlength: [8, 'Passwort muss mindestens 8 Zeichen lang sein']
  },
  role: {
    type: String,
    enum: ['admin', 'parent', 'child', 'other'],
    default: 'parent'
  },
  families: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Passwort vor dem Speichern hashen
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Methode zum Passwort-Vergleich
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtuelle Eigenschaft für den vollständigen Namen
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', UserSchema);