const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  getAllDonors,
  getAllNGOs,
  getAllDonations,
  getAllRequests,
verifyAccount,
getReportsAnalytics
} = require('../controllers/adminController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// All routes below require an authenticated Admin
router.use(protect, authorizeRoles('admin'));

// Dashboard statistics
router.get('/stats', getDashboardStats);

// Manage users
router.get('/donors', getAllDonors);
router.get('/ngos', getAllNGOs);

// Manage platform activity
router.get('/donations', getAllDonations);
router.get('/requests', getAllRequests);
router.patch('/verify/:role/:id', verifyAccount);
// Reports & Analytics
router.get('/reports', getReportsAnalytics);

module.exports = router;