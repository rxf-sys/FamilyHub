const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Titel ist erforderlich'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  start: {
    type: Date,
    required: [true, 'Startdatum ist erforderlich']
  },
  end: {
    type: Date,
    required: [true, 'Enddatum ist erforderlich']
  },
  allDay: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#3B82F6' // Blau als Standardfarbe
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family'
  },
  reminderTime: {
    type: Number, // Minuten vor dem Event
    default: 30
  },
  recurrence: {
    // Für wiederkehrende Termine
    type: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', 'none'],
      default: 'none'
    },
    interval: {
      type: Number,
      default: 1
    },
    endDate: Date,
    daysOfWeek: [Number] // 0-6 für Sonntag-Samstag
  },
  isShared: {
    type: Boolean,
    default: true
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index für effiziente Abfragen nach Datum
EventSchema.index({ start: 1 });
EventSchema.index({ end: 1 });
EventSchema.index({ user: 1 });
EventSchema.index({ family: 1 });

module.exports = mongoose.model('Event', EventSchema);