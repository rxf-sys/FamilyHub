const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    default: 'Sonstiges'
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date,
  isShared: {
    type: Boolean,
    default: false
  },
  tags: [String],
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

module.exports = mongoose.model('Document', DocumentSchema);