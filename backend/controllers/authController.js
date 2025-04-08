// controllers/authController.js

// Auth Controller

const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * JWT Token generieren
 * @param {string} id - Benutzer-ID
 * @returns {string} JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d' // 7 Tage Gültigkeit
  });
};

// Registrierung
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Prüfen, ob der Benutzer bereits existiert
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Benutzer mit dieser E-Mail existiert bereits'
      });
    }

    // Benutzer erstellen
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'parent'
    });

    // Erfolgreiche Antwort mit Token
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registrierungsfehler:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler bei der Registrierung',
      error: error.message
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validierung
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Bitte E-Mail und Passwort angeben'
      });
    }

    // Benutzer suchen
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Ungültige Anmeldedaten'
      });
    }

    // Passwort prüfen
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Ungültige Anmeldedaten'
      });
    }

    // Erfolgreiche Antwort mit Token
    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Anmeldefehler:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler bei der Anmeldung',
      error: error.message
    });
  }
};

// Profilinformationen abrufen
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profilabruf-Fehler:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen des Profils',
      error: error.message
    });
  }
};

// Profil aktualisieren
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    
    // Benutzer suchen und aktualisieren
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Profilaktualisierungsfehler:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler bei der Aktualisierung des Profils',
      error: error.message
    });
  }
};

// Passwort ändern
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validierung
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Bitte geben Sie das aktuelle und das neue Passwort an'
      });
    }
    
    // Mindestkomplexität für Passwort prüfen
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Das neue Passwort muss mindestens 8 Zeichen lang sein'
      });
    }
    
    // Benutzer mit Passwort abrufen
    const user = await User.findById(req.user.id);
    
    // Aktuelles Passwort prüfen
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Aktuelles Passwort ist falsch'
      });
    }
    
    // Neues Passwort setzen
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Passwort erfolgreich geändert'
    });
  } catch (error) {
    console.error('Passwortänderungsfehler:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler bei der Passwortänderung',
      error: error.message
    });
  }
};