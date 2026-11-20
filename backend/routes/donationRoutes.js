const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  createDonation,
  getMyDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  getAvailableDonations,
  getDonationDetailsForNGO
} = require('../controllers/donationController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Create Food Donation
router.post(
  '/',
  protect,
  authorizeRoles('donor'),
  upload.array('images', 5),
  createDonation
);
// Get My Donations
router.get(
  '/my-donations',
  protect,
  authorizeRoles('donor'),
  getMyDonations
);
// Get Available Donations for NGOs
router.get(
  '/available',
  protect,
  authorizeRoles('ngo'),
  getAvailableDonations
);
// Get Single Donation Details for NGOs
router.get(
  '/ngo/:id',
  protect,
  authorizeRoles('ngo'),
  getDonationDetailsForNGO
);
// Get Single Donation by ID
router.get(
  '/:id',
  protect,
  authorizeRoles('donor'),
  getDonationById
);
// Update Food Donation
router.put(
  '/:id',
  protect,
  authorizeRoles('donor'),
  updateDonation
);
// Delete Food Donation
router.delete(
  '/:id',
  protect,
  authorizeRoles('donor'),
  deleteDonation
);

module.exports = router;