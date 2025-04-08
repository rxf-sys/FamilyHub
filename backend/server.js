const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const logger = require('./utils/logger');

// Middleware
const errorHandler = require('./middleware/errorHandler');

// Route-Importe
const authRoutes = require('./routes/authRoutes');
const familyRoutes = require('./routes/familyRoutes');
const eventRoutes = require('./routes/eventRoutes');
const shoppingRoutes = require('./routes/shoppingRoutes');
const mealRoutes = require('./routes/mealRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const documentRoutes = require('./routes/documentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Umgebungsvariablen laden
dotenv.config();

const app = express();

// Upload-Verzeichnisse erstellen, falls sie nicht existieren
const uploadDirs = ['uploads', 'uploads/temp', 'uploads/documents'];
uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger.requestLogger);

// MongoDB-Verbindung
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/familyhub')
  .then(() => logger.info('MongoDB verbunden'))
  .catch(err => {
    logger.error('MongoDB Verbindungsfehler:', err);
    process.exit(1);
  });

// API-Routes
app.use('/api/auth', authRoutes);
app.use('/api/families', familyRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Basis-Route zum Testen
app.get('/api', (req, res) => {
  res.json({ 
    message: 'FamilyHub API läuft', 
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/families',
      '/api/events',
      '/api/shopping',
      '/api/meals',
      '/api/medications',
      '/api/documents',
      '/api/dashboard'
    ]
  });
});

// Statische Assets in Produktion
if (process.env.NODE_ENV === 'production') {
  // Statische Ordner
  app.use(express.static(path.join(__dirname, '../client/build')));

  // SPA Routing handhaben
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Fehlerlogger und Error Handler Middleware (muss nach den Routen stehen)
app.use(logger.errorLogger);
app.use(errorHandler);

// Port und Starten des Servers
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server läuft im ${process.env.NODE_ENV || 'development'}-Modus auf Port ${PORT}`);
});

// Für Testumgebungen
module.exports = app;