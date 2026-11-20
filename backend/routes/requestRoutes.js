const express = require('express');
const router = express.Router();

const {
  createFoodRequest,
  getMyFoodRequests,
  cancelFoodRequest,
  getIncomingRequests,
  updateRequestStatus,
  confirmFoodCollection
} = require('../controllers/requestController');

const {
  protect,
  authorizeRoles
} = require('../middleware/authMiddleware');

// NGO creates a food request
router.post(
  '/',
  protect,
  authorizeRoles('ngo'),
  createFoodRequest
);
// NGO views their own food requests
router.get(
  '/my-requests',
  protect,
  authorizeRoles('ngo'),
  getMyFoodRequests
);
// NGO cancels a pending food request
router.patch(
  '/:id/cancel',
  protect,
  authorizeRoles('ngo'),
  cancelFoodRequest
);
// Donor views incoming food requests
router.get(
  '/incoming',
  protect,
  authorizeRoles('donor'),
  getIncomingRequests
);
// Donor approves or rejects a food request
router.patch(
  '/:id/status',
  protect,
  authorizeRoles('donor'),
  updateRequestStatus
);
// NGO confirms food collection
router.patch(
  '/:id/collect',
  protect,
  authorizeRoles('ngo'),
  confirmFoodCollection
);
module.exports = router;