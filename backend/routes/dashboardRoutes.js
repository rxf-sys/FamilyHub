const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  getWidgetConfig,
  updateWidgetConfig,
  getWeatherData,
  getTrafficData,
  getNewsFeed
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// Alle Routen schützen
router.use(protect);

// Dashboard-Hauptdaten
router.get('/', getDashboardData);

// Widget-Konfiguration
router.get('/widgets/config', getWidgetConfig);
router.put('/widgets/config', updateWidgetConfig);

// Externe API-Integrationen
router.get('/weather', getWeatherData);
router.get('/traffic', getTrafficData);
router.get('/news', getNewsFeed);

module.exports = router;