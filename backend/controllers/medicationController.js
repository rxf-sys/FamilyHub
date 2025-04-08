// controllers/medicationController.js

// Medication Controller

const Medication = require('../models/Medication');
const User = require('../models/User');
const Family = require('../models/Family');

/**
 * Alle Medikamente eines Benutzers abrufen
 */
exports.getMedications = async (req, res) => {
  try {
    const { family } = req.query;
    
    const query = { user: req.user.id };
    
    // Nach Familie filtern, falls angegeben
    if (family) {
      query.family = family;
    }
    
    const medications = await Medication.find(query).sort('-updatedAt');
    
    res.status(200).json({
      success: true,
      count: medications.length,
      data: medications
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Medikamente:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Medikamente',
      error: error.message
    });
  }
};

/**
 * Ein einzelnes Medikament anhand der ID abrufen
 */
exports.getMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medikament nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Eigentümer des Medikaments ist
    if (medication.user.toString() !== req.user.id) {
      // Prüfen, ob das Medikament mit einer Familie geteilt wird, in der der Benutzer Mitglied ist
      if (medication.family) {
        const familyMember = await Family.findOne({
          _id: medication.family,
          'members.user': req.user.id
        });
        
        if (!familyMember) {
          return res.status(403).json({
            success: false,
            message: 'Zugriff verweigert'
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          message: 'Zugriff verweigert'
        });
      }
    }
    
    res.status(200).json({
      success: true,
      data: medication
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Medikaments:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen des Medikaments',
      error: error.message
    });
  }
};

/**
 * Neues Medikament erstellen
 */
exports.createMedication = async (req, res) => {
  try {
    const {
      name,
      dosage,
      instructions,
      remainingAmount,
      unit,
      expiration,
      refillReminder,
      refillThreshold,
      schedules,
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
    
    // Medikament erstellen
    const medication = await Medication.create({
      name,
      dosage,
      instructions,
      remainingAmount: remainingAmount || 0,
      unit: unit || 'Tabletten',
      expiration: expiration ? new Date(expiration) : undefined,
      refillReminder: refillReminder || false,
      refillThreshold: refillThreshold || 5,
      schedules: schedules || [],
      logs: [],
      user: req.user.id,
      family
    });
    
    res.status(201).json({
      success: true,
      data: medication
    });
  } catch (error) {
    console.error('Fehler beim Erstellen des Medikaments:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Erstellen des Medikaments',
      error: error.message
    });
  }
};

/**
 * Medikament aktualisieren
 */
exports.updateMedication = async (req, res) => {
  try {
    const {
      name,
      dosage,
      instructions,
      remainingAmount,
      unit,
      expiration,
      refillReminder,
      refillThreshold,
      schedules,
      family
    } = req.body;
    
    let medication = await Medication.findById(req.params.id);
    
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medikament nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Eigentümer des Medikaments ist
    if (medication.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert. Nur der Eigentümer kann das Medikament aktualisieren'
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
    
    // Medikament aktualisieren
    medication = await Medication.findByIdAndUpdate(
      req.params.id,
      {
        name,
        dosage,
        instructions,
        remainingAmount,
        unit,
        expiration: expiration ? new Date(expiration) : medication.expiration,
        refillReminder,
        refillThreshold,
        schedules,
        family
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: medication
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Medikaments:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Aktualisieren des Medikaments',
      error: error.message
    });
  }
};

/**
 * Medikament löschen
 */
exports.deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medikament nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Eigentümer des Medikaments ist
    if (medication.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert. Nur der Eigentümer kann das Medikament löschen'
      });
    }
    
    await medication.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Fehler beim Löschen des Medikaments:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Löschen des Medikaments',
      error: error.message
    });
  }
};

/**
 * Einnahmeprotokoll für ein Medikament hinzufügen
 */
exports.addMedicationLog = async (req, res) => {
  try {
    const { taken, notes } = req.body;
    
    const medication = await Medication.findById(req.params.id);
    
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medikament nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Eigentümer des Medikaments ist oder es in einer geteilten Familie ist
    let hasAccess = medication.user.toString() === req.user.id;
    
    if (!hasAccess && medication.family) {
      const familyMember = await Family.findOne({
        _id: medication.family,
        'members.user': req.user.id
      });
      
      hasAccess = !!familyMember;
    }
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert'
      });
    }
    
    // Einnahme protokollieren
    medication.logs.push({
      timestamp: new Date(),
      taken: taken !== undefined ? taken : true,
      notes
    });
    
    // Bestand reduzieren, wenn das Medikament eingenommen wurde
    if (taken !== false && medication.remainingAmount > 0) {
      medication.remainingAmount -= 1;
    }
    
    await medication.save();
    
    res.status(200).json({
      success: true,
      data: medication
    });
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Einnahmeprotokolls:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Hinzufügen des Einnahmeprotokolls',
      error: error.message
    });
  }
};

/**
 * Bestand eines Medikaments aktualisieren
 */
exports.updateMedicationInventory = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (amount === undefined || amount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Gültiger Bestand erforderlich'
      });
    }
    
    const medication = await Medication.findById(req.params.id);
    
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medikament nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Eigentümer des Medikaments ist
    if (medication.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert. Nur der Eigentümer kann den Bestand aktualisieren'
      });
    }
    
    medication.remainingAmount = amount;
    await medication.save();
    
    res.status(200).json({
      success: true,
      data: medication
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Bestands:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Aktualisieren des Bestands',
      error: error.message
    });
  }
};

/**
 * Medikamente mit niedrigem Bestand abrufen
 */
exports.getLowInventoryMedications = async (req, res) => {
  try {
    const medications = await Medication.find({
      user: req.user.id,
      refillReminder: true,
      $expr: { $lte: ["$remainingAmount", "$refillThreshold"] }
    }).sort('remainingAmount');
    
    res.status(200).json({
      success: true,
      count: medications.length,
      data: medications
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Medikamente mit niedrigem Bestand:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Medikamente mit niedrigem Bestand',
      error: error.message
    });
  }
};