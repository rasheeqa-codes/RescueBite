const express = require('express');
const router = express.Router();

const {
  updateNGOLocation
} = require('../controllers/locationController');

const {
  protect,
  authorizeRoles
} = require('../middleware/authMiddleware');

// NGO updates its organisation location
router.put(
  '/ngo',
  protect,
  authorizeRoles('ngo'),
  updateNGOLocation
);

module.exports = router;