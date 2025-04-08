const express = require('express');
const router = express.Router();
const {
  getMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
  addMedicationLog,
  updateMedicationInventory,
  getLowInventoryMedications
} = require('../controllers/medicationController');
const { protect } = require('../middleware/auth');

// Alle Routen schützen
router.use(protect);

// Medikamenten-Routen
router.route('/')
  .get(getMedications)
  .post(createMedication);

router.route('/:id')
  .get(getMedication)
  .put(updateMedication)
  .delete(deleteMedication);

// Medikamenten-Logs hinzufügen
router.post('/:id/logs', addMedicationLog);

// Bestand aktualisieren
router.put('/:id/inventory', updateMedicationInventory);

// Medikamente mit niedrigem Bestand abrufen
router.get('/low-inventory', getLowInventoryMedications);

module.exports = router;