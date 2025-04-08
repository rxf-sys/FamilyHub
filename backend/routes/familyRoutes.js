const express = require('express');
const router = express.Router();
const {
  getFamilies,
  getFamily,
  createFamily,
  updateFamily,
  deleteFamily,
  addMember,
  removeMember
} = require('../controllers/familyController');
const { protect } = require('../middleware/auth');

// Alle Routen schützen
router.use(protect);

// Familien-Routen
router.route('/')
  .get(getFamilies)
  .post(createFamily);

router.route('/:id')
  .get(getFamily)
  .put(updateFamily)
  .delete(deleteFamily);

// Mitglieder-Routen
router.post('/:id/members', addMember);
router.delete('/:id/members/:memberId', removeMember);

module.exports = router;