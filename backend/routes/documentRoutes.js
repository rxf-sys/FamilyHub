const express = require('express');
const router = express.Router();
const {
  getDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  downloadDocument
} = require('../controllers/documentController');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Multer für Datei-Uploads konfigurieren
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Temporäres Upload-Verzeichnis
    cb(null, 'uploads/temp');
  },
  filename: function(req, file, cb) {
    // Zufälligen Dateinamen generieren um Konflikte zu vermeiden
    const randomName = crypto.randomBytes(16).toString('hex');
    cb(null, `${randomName}${path.extname(file.originalname)}`);
  }
});

// Dateifilter definieren - nur bestimmte Dateitypen erlauben
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Nicht unterstützter Dateityp'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB Limit
  fileFilter
});

// Alle Routen schützen
router.use(protect);

// Dokumenten-Routen
router.route('/')
  .get(getDocuments)
  .post(upload.single('document'), uploadDocument);

router.route('/:id')
  .get(getDocument)
  .put(updateDocument)
  .delete(deleteDocument);

// Dokument herunterladen
router.get('/:id/download', downloadDocument);

module.exports = router;