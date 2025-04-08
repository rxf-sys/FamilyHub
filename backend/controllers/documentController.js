// controllers/documentController.js

// Document Controller

require('../models/Family');
const path = require('path');
const fs = require('fs');
const util = require('util');
const mkdir = util.promisify(fs.mkdir);

/**
 * Alle Dokumente eines Benutzers abrufen
 */
exports.getDocuments = async (req, res) => {
  try {
    const { category, family, tags } = req.query;
    
    // Basisabfrage - eigene Dokumente oder geteilte Familiendokumente
    const query = {
      $or: [
        { user: req.user.id }
      ]
    };
    
    // Wenn der Benutzer in Familien ist, auch Familiendokumente einbeziehen
    if (req.user.families && req.user.families.length > 0) {
      // Nach Dokumenten suchen, die mit einer Familie geteilt sind, in der der Benutzer Mitglied ist
      const families = await Family.find({
        'members.user': req.user.id,
        'settings.shareDocuments': true
      });
      
      if (families.length > 0) {
        const familyIds = families.map(family => family._id);
        query.$or.push({ family: { $in: familyIds }, isShared: true });
      }
    }
    
    // Nach Kategorie filtern
    if (category) {
      query.category = category;
    }
    
    // Nach Familie filtern
    if (family) {
      // Prüfen, ob der Benutzer Mitglied der Familie ist
      const isMember = await Family.findOne({
        _id: family,
        'members.user': req.user.id
      });
      
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'Zugriff verweigert. Sie sind kein Mitglied dieser Familie'
        });
      }
      
      query.family = family;
    }
    
    // Nach Tags filtern
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    const documents = await Document.find(query)
      .populate('user', 'firstName lastName')
      .populate('family', 'name')
      .sort('-uploadDate');
    
    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Dokumente:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Dokumente',
      error: error.message
    });
  }
};

/**
 * Ein einzelnes Dokument anhand der ID abrufen
 */
exports.getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('user', 'firstName lastName')
      .populate('family', 'name');
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Dokument nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer Zugriff auf das Dokument hat
    let hasAccess = document.user._id.toString() === req.user.id;
    
    // Wenn nicht der Eigentümer, prüfen ob es ein geteiltes Familiendokument ist
    if (!hasAccess && document.family && document.isShared) {
      const familyMember = await Family.findOne({
        _id: document.family,
        'members.user': req.user.id,
        'settings.shareDocuments': true
      });
      
      hasAccess = !!familyMember;
    }
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert'
      });
    }
    
    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Dokuments:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen des Dokuments',
      error: error.message
    });
  }
};

/**
 * Neues Dokument hochladen
 */
exports.uploadDocument = async (req, res) => {
  try {
    // Prüfen, ob eine Datei hochgeladen wurde
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Keine Datei hochgeladen'
      });
    }
    
    const {
      name,
      description,
      category,
      expiryDate,
      isShared,
      tags,
      family
    } = req.body;
    
    // Wenn eine Familie angegeben wurde, prüfen ob der Benutzer Mitglied ist
    if (family) {
      const isFamilyMember = await Family.findOne({
        _id: family,
        'members.user': req.user.id
      });
      
      if (!isFamilyMember) {
        return res.status(400).json({
          success: false,
          message: 'Sie sind kein Mitglied dieser Familie'
        });
      }
    }
    
    // Zielverzeichnis für den Benutzer definieren
    const userDir = path.join(__dirname, '../uploads', req.user.id);
    
    // Zieldateipfad für die Datei
    const filePath = path.join(userDir, req.file.filename);
    
    // Datei vom temporären Ort zum endgültigen Speicherort verschieben
    try {
      await moveFile(req.file.path, filePath);
    } catch (err) {
      console.error('Fehler beim Verschieben der Datei:', err);
      return res.status(500).json({
        success: false,
        message: 'Fehler beim Speichern der Datei',
        error: err.message
      });
    }
    
    // Dokument in der Datenbank speichern
    const document = await Document.create({
      name: name || req.file.originalname,
      description,
      category: category || 'Sonstiges',
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: filePath,
      uploadDate: Date.now(),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      isShared: isShared === 'true' || isShared === true,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      user: req.user.id,
      family
    });
    
    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Fehler beim Hochladen des Dokuments:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Hochladen des Dokuments',
      error: error.message
    });
  }
};

/**
 * Dokument aktualisieren
 */
exports.updateDocument = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      expiryDate,
      isShared,
      tags,
      family
    } = req.body;
    
    let document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Dokument nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Eigentümer des Dokuments ist
    if (document.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert. Nur der Eigentümer kann das Dokument aktualisieren'
      });
    }
    
    // Wenn eine Familie angegeben wurde, prüfen ob der Benutzer Mitglied ist
    if (family) {
      const isFamilyMember = await Family.findOne({
        _id: family,
        'members.user': req.user.id
      });
      
      if (!isFamilyMember) {
        return res.status(400).json({
          success: false,
          message: 'Sie sind kein Mitglied dieser Familie'
        });
      }
    }
    
    // Dokument aktualisieren
    document = await Document.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        expiryDate: expiryDate ? new Date(expiryDate) : document.expiryDate,
        isShared: isShared !== undefined ? isShared : document.isShared,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : document.tags,
        family
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Dokuments:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Aktualisieren des Dokuments',
      error: error.message
    });
  }
};

/**
 * Dokument löschen
 */
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Dokument nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Eigentümer des Dokuments ist
    if (document.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert. Nur der Eigentümer kann das Dokument löschen'
      });
    }
    
    // Datei vom Dateisystem löschen
    try {
      await deleteFile(document.filePath);
    } catch (err) {
      console.error('Fehler beim Löschen der Datei:', err);
      // Fortsetzung mit dem Löschen aus der Datenbank, auch wenn die Datei nicht gelöscht werden konnte
    }
    
    // Dokument aus der Datenbank löschen
    await document.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Fehler beim Löschen des Dokuments:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Löschen des Dokuments',
      error: error.message
    });
  }
};

/**
 * Dokument herunterladen
 */
exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Dokument nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer Zugriff auf das Dokument hat
    let hasAccess = document.user.toString() === req.user.id;
    
    // Wenn nicht der Eigentümer, prüfen ob es ein geteiltes Familiendokument ist
    if (!hasAccess && document.family && document.isShared) {
      const familyMember = await Family.findOne({
        _id: document.family,
        'members.user': req.user.id,
        'settings.shareDocuments': true
      });
      
      hasAccess = !!familyMember;
    }
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert'
      });
    }
    
    // Prüfen, ob die Datei existiert
    try {
      const fileExists = fs.existsSync(document.filePath);
      if (!fileExists) {
        return res.status(404).json({
          success: false,
          message: 'Datei nicht gefunden'
        });
      }
    } catch (err) {
      console.error('Fehler beim Prüfen der Datei:', err);
      return res.status(500).json({
        success: false,
        message: 'Fehler beim Prüfen der Datei',
        error: err.message
      });
    }
    
    // Download-Header setzen und Datei senden
    res.download(document.filePath, document.fileName, (err) => {
      if (err) {
        console.error('Fehler beim Herunterladen des Dokuments:', err);
        return res.status(500).json({
          success: false,
          message: 'Fehler beim Herunterladen des Dokuments',
          error: err.message
        });
      }
    });
  } catch (error) {
    console.error('Fehler beim Herunterladen des Dokuments:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Herunterladen des Dokuments',
      error: error.message
    });
  }
};