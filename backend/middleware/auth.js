const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware zum Schutz von Routen
 * Überprüft den JWT-Token und fügt den Benutzer zur Request hinzu
 */
exports.protect = async (req, res, next) => {
  let token;

  // Token aus dem Authorization-Header extrahieren
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Prüfen, ob Token existiert
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Zugriff verweigert. Nicht autorisiert.'
    });
  }

  try {
    // Token verifizieren
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Benutzer zur Request hinzufügen
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: 'Benutzer nicht gefunden'
      });
    }
    
    next();
  } catch (error) {
    console.error('Auth Middleware Fehler:', error);
    
    return res.status(401).json({
      success: false,
      message: 'Ungültiger Token'
    });
  }
};

/**
 * Middleware zur Prüfung von Benutzerrollen
 * Erlaubt nur bestimmten Rollen den Zugriff auf Ressourcen
 * @param {...string} roles - Erlaubte Rollen
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Nicht authentifiziert'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Rolle '${req.user.role}' ist nicht autorisiert, auf diese Ressource zuzugreifen`
      });
    }
    
    next();
  };
};