const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

/**
 * Konfiguration für Datei-Uploads mit Multer
 * Sicherheitsmaßnahmen:
 * - Dateigröße begrenzen
 * - Nur bestimmte Dateitypen erlauben
 * - Zufällige Dateinamen generieren
 * - Temporäres Upload-Verzeichnis verwenden
 */

// Grundlegende Konfiguration für Dokumentenuploads
const configureDocumentUpload = () => {
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      // Benutzerverzeichnis erstellen falls es nicht existiert
      if (req.user && req.user.id) {
        const userDir = path.join(__dirname, '../uploads', req.user.id);
        if (!fs.existsSync(userDir)) {
          fs.mkdirSync(userDir, { recursive: true });
        }
      }
      // In temporäres Verzeichnis hochladen
      cb(null, 'uploads/temp');
    },
    filename: function(req, file, cb) {
      // Zufälligen Dateinamen generieren um Konflikte zu vermeiden
      const randomName = crypto.randomBytes(16).toString('hex');
      cb(null, `${randomName}${path.extname(file.originalname)}`);
    }
  });

  // Liste erlaubter Dateitypen
  const allowedDocumentTypes = [
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

  // Dateitypfilter-Funktion
  const fileFilter = (req, file, cb) => {
    if (allowedDocumentTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Nicht unterstützter Dateityp. Erlaubte Typen: ${allowedDocumentTypes.join(', ')}`), false);
    }
  };

  // Multer-Konfiguration
  return multer({
    storage,
    limits: { 
      fileSize: 10 * 1024 * 1024, // 10 MB Limit
      files: 1 // Nur eine Datei pro Anfrage
    },
    fileFilter
  });
};

// Konfiguration für Bild-Uploads (z.B. für Rezepte)
const configureImageUpload = () => {
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      // In temporäres Bildverzeichnis hochladen
      const imageDir = path.join(__dirname, '../uploads/images');
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }
      cb(null, 'uploads/images');
    },
    filename: function(req, file, cb) {
      // Zufälligen Dateinamen generieren um Konflikte zu vermeiden
      const randomName = crypto.randomBytes(16).toString('hex');
      cb(null, `${randomName}${path.extname(file.originalname)}`);
    }
  });

  // Liste erlaubter Bilddateitypen
  const allowedImageTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  // Dateitypfilter-Funktion
  const fileFilter = (req, file, cb) => {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Nicht unterstützter Bildtyp. Erlaubte Typen: ${allowedImageTypes.join(', ')}`), false);
    }
  };

  // Multer-Konfiguration
  return multer({
    storage,
    limits: { 
      fileSize: 5 * 1024 * 1024, // 5 MB Limit
      files: 1 // Nur eine Datei pro Anfrage
    },
    fileFilter
  });
};

// Datei in das endgültige Verzeichnis verschieben
const moveFile = (tempPath, targetPath) => {
  return new Promise((resolve, reject) => {
    // Zielverzeichnis erstellen, falls es nicht existiert
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Datei verschieben
    fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(targetPath);
      }
    });
  });
};

// Datei löschen
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        // Wenn die Datei nicht existiert, gilt das nicht als Fehler
        if (err.code === 'ENOENT') {
          resolve();
        } else {
          reject(err);
        }
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  documentUpload: configureDocumentUpload(),
  imageUpload: configureImageUpload(),
  moveFile,
  deleteFile
};