/**
 * FamilyHub Backend
 * Haupteinstiegspunkt der Anwendung
 */

// Umgebungsvariablen laden
require('dotenv').config();

// Server importieren und starten
const app = require('./server');

// Uncaught Exception Handler
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Port für den Server
const PORT = process.env.PORT || 5000;

// Server starten
const server = app.listen(PORT, () => {
  console.log(`Server läuft im ${process.env.NODE_ENV || 'development'}-Modus auf Port ${PORT}`);
});

// Unhandled Rejection Handler (für asynchrone Fehler)
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  server.close(() => {
    process.exit(1);
  });
});

// SIGTERM Handler
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated!');
  });
});