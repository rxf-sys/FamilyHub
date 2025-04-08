const logger = require('../utils/logger');

/**
 * Globaler Error Handler für die API
 * Behandelt Fehler einheitlich und sendet konsistente Antworten
 */
const errorHandler = (err, req, res, next) => {
  // Log des Fehlers
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });
  
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Serverfehler';
  let errors = err.errors || [];
  
  // Mongoose Validierungsfehler
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validierungsfehler';
    errors = Object.values(err.errors).map(val => val.message);
  }
  
  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplizierter Schlüsselwert';
    const field = Object.keys(err.keyValue)[0];
    errors = [`Der Wert '${err.keyValue[field]}' für das Feld '${field}' wird bereits verwendet`];
  }
  
  // Mongoose Cast Error (ungültige ID)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Ungültiger Ressourcen-Identifier';
    errors = [`'${err.value}' ist keine gültige ${err.kind} für ${err.path}`];
  }

  // JWT Fehler
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Ungültiger Token';
  }

  // JWT Ablauf-Fehler
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token abgelaufen';
  }

  // Multer-Fehler für Datei-Uploads
  if (err.name === 'MulterError') {
    statusCode = 400;
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Datei zu groß';
      errors = [`Die maximale Dateigröße beträgt ${err.limit / (1024 * 1024)} MB`];
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unerwartetes Dateifeld';
      errors = [`Unerwartetes Dateifeld: ${err.field}`];
    } else {
      message = 'Fehler beim Datei-Upload';
      errors = [err.message];
    }
  }

  // SyntaxError bei JSON-Parsing
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Ungültiger JSON-Body';
  }

  // Antwort senden
  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;