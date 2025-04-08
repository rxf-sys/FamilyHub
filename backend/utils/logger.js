const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Logs-Verzeichnis erstellen, falls es nicht existiert
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Log-Level aus der Umgebungsvariable oder Standard-Level
const level = process.env.LOG_LEVEL || 'info';

// Farbcodierung für verschiedene Log-Level im Konsolentransport
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Winston-Farbschema hinzufügen
winston.addColors(colors);

// Formatierung der Logs für die Konsole
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Formatierung der Logs für Dateien
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json()
);

// Logger-Instanz erstellen
const logger = winston.createLogger({
  level,
  format: fileFormat,
  transports: [
    // Dateienausgabe für alle Log-Level einrichten
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log') 
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'exceptions.log') 
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'rejections.log') 
    })
  ]
});

// Im Entwicklungsmodus auch in die Konsole loggen
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Hilfsfunktionen für häufige Logging-Muster
logger.logRequest = (req, res, next) => {
  const startTime = new Date();
  
  res.on('finish', () => {
    const duration = new Date() - startTime;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
    
    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.http(message);
    }
  });
  
  next();
};

logger.logError = (error, context = '') => {
  let message = error.message || 'Ein Fehler ist aufgetreten';
  
  if (context) {
    message = `[${context}] ${message}`;
  }
  
  logger.error({
    message,
    stack: error.stack,
    ...(context && { context })
  });
};

// Express-Middleware für das Logging von Anfragen
logger.requestLogger = (req, res, next) => {
  logger.http(`${req.method} ${req.originalUrl}`);
  next();
};

// Express-Middleware für das Logging von Fehlern
logger.errorLogger = (err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  next(err);
};

module.exports = logger;