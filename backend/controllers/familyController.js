// controllers/familyController.js

// Family Controller

const Family = require('../models/Family');
const User = require('../models/User');

/**
 * Alle Familien des angemeldeten Benutzers abrufen
 */
exports.getFamilies = async (req, res) => {
  try {
    // Familien finden, in denen der Benutzer Mitglied ist
    const families = await Family.find({
      'members.user': req.user.id
    })
    .populate('members.user', 'firstName lastName email')
    .populate('createdBy', 'firstName lastName');
    
    res.status(200).json({
      success: true,
      count: families.length,
      data: families
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Familien:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Familien',
      error: error.message
    });
  }
};

/**
 * Eine einzelne Familie anhand der ID abrufen
 */
exports.getFamily = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id)
      .populate('members.user', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName');
    
    if (!family) {
      return res.status(404).json({
        success: false,
        message: 'Familie nicht gefunden'
      });
    }

    // Prüfen, ob der Benutzer Mitglied der Familie ist
    const isMember = family.members.some(member => 
      member.user._id.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert. Sie sind kein Mitglied dieser Familie'
      });
    }
    
    res.status(200).json({
      success: true,
      data: family
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Familie:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Familie',
      error: error.message
    });
  }
};

/**
 * Neue Familie erstellen
 */
exports.createFamily = async (req, res) => {
  try {
    const { name, description, settings } = req.body;
    
    // Familie erstellen
    const family = await Family.create({
      name,
      description,
      createdBy: req.user.id,
      members: [{ user: req.user.id, role: 'admin' }],
      settings: settings || {}
    });
    
    // Benutzer aktualisieren, um die Familie hinzuzufügen
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { families: family._id } }
    );
    
    res.status(201).json({
      success: true,
      data: family
    });
  } catch (error) {
    console.error('Fehler beim Erstellen der Familie:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Erstellen der Familie',
      error: error.message
    });
  }
};

/**
 * Familie aktualisieren
 */
exports.updateFamily = async (req, res) => {
  try {
    let family = await Family.findById(req.params.id);
    
    if (!family) {
      return res.status(404).json({
        success: false,
        message: 'Familie nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer Admin der Familie ist
    const isAdmin = family.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert. Nur Familienadministratoren können die Familie aktualisieren'
      });
    }
    
    const { name, description, settings } = req.body;
    
    // Aktualisierbare Felder
    if (name) family.name = name;
    if (description) family.description = description;
    if (settings) family.settings = { ...family.settings, ...settings };
    
    await family.save();
    
    res.status(200).json({
      success: true,
      data: family
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Familie:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Aktualisieren der Familie',
      error: error.message
    });
  }
};

/**
 * Familie löschen
 */
exports.deleteFamily = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    
    if (!family) {
      return res.status(404).json({
        success: false,
        message: 'Familie nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Ersteller der Familie ist
    if (family.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert. Nur der Ersteller kann die Familie löschen'
      });
    }
    
    // Referenzen aus Benutzern entfernen
    await User.updateMany(
      { families: family._id },
      { $pull: { families: family._id } }
    );
    
    // Familie löschen
    await family.remove();
    
    res.status(200).json({
      success: true,
      message: 'Familie erfolgreich gelöscht'
    });
  } catch (error) {
    console.error('Fehler beim Löschen der Familie:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Löschen der Familie',
      error: error.message
    });
  }
};

/**
 * Mitglied zur Familie hinzufügen
 */
exports.addMember = async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;
    
    // Familie finden
    const family = await Family.findById(req.params.id);
    
    if (!family) {
      return res.status(404).json({
        success: false,
        message: 'Familie nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer Admin der Familie ist
    const isAdmin = family.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert. Nur Familienadministratoren können Mitglieder hinzufügen'
      });
    }
    
    // Benutzer finden
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Benutzer nicht gefunden'
      });
    }
    
    // Benutzer zur Familie hinzufügen
    const added = family.addMember(user._id, role);
    
    if (!added) {
      return res.status(400).json({
        success: false,
        message: 'Benutzer ist bereits Mitglied der Familie'
      });
    }
    
    await family.save();
    
    // Familie zur Benutzerliste hinzufügen
    await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { families: family._id } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Mitglied erfolgreich hinzugefügt',
      data: family
    });
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Mitglieds:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Hinzufügen des Mitglieds',
      error: error.message
    });
  }
};

/**
 * Mitglied aus der Familie entfernen
 */
exports.removeMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    
    // Familie finden
    const family = await Family.findById(req.params.id);
    
    if (!family) {
      return res.status(404).json({
        success: false,
        message: 'Familie nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer Admin der Familie ist
    const isAdmin = family.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    // Benutzer kann sich selbst entfernen oder Admin kann Mitglieder entfernen
    const isSelfRemoval = memberId === req.user.id;
    
    if (!isAdmin && !isSelfRemoval) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert. Sie haben keine Berechtigung, dieses Mitglied zu entfernen'
      });
    }
    
    // Prüfen, ob der zu entfernende Benutzer der einzige Admin ist
    const isOnlyAdmin = 
      family.members.filter(m => m.role === 'admin').length === 1 && 
      family.members.find(m => m.user.toString() === memberId)?.role === 'admin';
      
    if (isOnlyAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Der letzte Administrator kann nicht entfernt werden. Befördern Sie zunächst ein anderes Mitglied zum Administrator'
      });
    }
    
    // Mitglied entfernen
    const removed = family.removeMember(memberId);
    
    if (!removed) {
      return res.status(400).json({
        success: false,
        message: 'Benutzer ist kein Mitglied der Familie'
      });
    }
    
    await family.save();
    
    // Familie aus der Benutzerliste entfernen
    await User.findByIdAndUpdate(
      memberId,
      { $pull: { families: family._id } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Mitglied erfolgreich entfernt',
      data: family
    });
  } catch (error) {
    console.error('Fehler beim Entfernen des Mitglieds:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Entfernen des Mitglieds',
      error: error.message
    });
  }
};