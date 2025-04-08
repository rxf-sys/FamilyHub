const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  daysOfWeek: {
    type: [Number],
    default: [0, 1, 2, 3, 4, 5, 6] // 0-6 für So-Sa
  },
  active: {
    type: Boolean,
    default: true
  }
});

const MedicationLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  taken: {
    type: Boolean,
    default: true
  },
  notes: String
});

const MedicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  instructions: String,
  remainingAmount: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'Tabletten'
  },
  expiration: Date,
  refillReminder: {
    type: Boolean,
    default: false
  },
  refillThreshold: {
    type: Number,
    default: 5
  },
  schedules: [ScheduleSchema],
  logs: [MedicationLogSchema],
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

module.exports = mongoose.model('Medication', MedicationSchema);