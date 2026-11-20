const Donation = require('../models/Donation');
const FoodRequest = require('../models/FoodRequest');
// Update donation status based on remaining and reserved quantities
const updateDonationStatus = async (donationId) => {
  const donation = await Donation.findById(donationId);

  if (!donation) return;

  if (donation.quantity <= 0) {
    donation.status = 'Collected';
  } else {
    const reservedRequests = await FoodRequest.aggregate([
      {
        $match: {
          donation: donation._id,
          status: { $in: ['Pending', 'Approved'] }
        }
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$requestedQuantity' }
        }
      }
    ]);

    const reservedQuantity =
      reservedRequests[0]?.totalQuantity || 0;

    if (reservedQuantity >= donation.quantity) {
      donation.status = 'Requested';
    } else if (reservedQuantity > 0) {
      donation.status = 'Partially Requested';
    } else {
      donation.status = 'Available';
    }
  }

  await donation.save();
};

// Create Food Request by NGO
const createFoodRequest = async (req, res) => {
  try {
    const { donationId, requestedQuantity } = req.body;

    // Validate required fields
    if (!donationId || !requestedQuantity) {
      return res.status(400).json({
        success: false,
        message: 'Donation ID and requested quantity are required.'
      });
    }

    if (!Number.isFinite(Number(requestedQuantity)) || Number(requestedQuantity) < 1) {
      return res.status(400).json({
        success: false,
        message: 'Requested quantity must be at least 1.'
      });
    }

    if (!require('mongoose').isValidObjectId(donationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid donation ID.'
      });
    }

    // Find available donation
    const donation = await Donation.findOne({
      _id: donationId,
      status: { $in: ['Available', 'Partially Requested'] },
      pickupDeadline: { $gt: new Date() }
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found or no longer available.'
      });
    }

    // Prevent the same NGO from making multiple active requests
const existingRequest = await FoodRequest.findOne({
  donation: donationId,
  ngo: req.user.id,
  status: { $in: ['Pending', 'Approved'] }
});

if (existingRequest) {
  return res.status(400).json({
    success: false,
    message: 'You already have an active request for this donation.'
  });
}
    // Calculate quantity already requested
    const reservedRequests = await FoodRequest.aggregate([
      {
        $match: {
          donation: donation._id,
          status: { $in: ['Pending', 'Approved'] }
        }
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$requestedQuantity' }
        }
      }
    ]);

    const reservedQuantity = reservedRequests[0]?.totalQuantity || 0;
    const remainingQuantity = donation.quantity - reservedQuantity;

    if (Number(requestedQuantity) > remainingQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${remainingQuantity} ${donation.unit} remaining for requests.`
      });
    }

    // Create food request
    const foodRequest = await FoodRequest.create({
      donation: donation._id,
      ngo: req.user.id,
      donor: donation.donor,
      requestedQuantity: Number(requestedQuantity)
    });
    // Update donation status after receiving a request
await updateDonationStatus(donation._id);

    res.status(201).json({
      success: true,
      message: 'Food request submitted successfully!',
      foodRequest
    });

  } catch (error) {
    console.error('Create Food Request Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while creating food request.'
    });
  }
};
// Get Food Requests Submitted by NGO
const getMyFoodRequests = async (req, res) => {
  try {
    const requests = await FoodRequest.find({
      ngo: req.user.id
    })
      .populate('donation')
      .populate('donor', 'fullName organizationName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });

  } catch (error) {
    console.error('Get My Food Requests Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching food requests.'
    });
  }
};
// Cancel Pending Food Request by NGO
const cancelFoodRequest = async (req, res) => {
  try {
    const request = await FoodRequest.findOneAndUpdate(
      {
        _id: req.params.id,
        ngo: req.user.id,
        status: 'Pending'
      },
      {
        status: 'Cancelled'
      },
      {
        new: true
      }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Pending request not found or cannot be cancelled.'
      });
    }
    // Update donation status after cancellation
await updateDonationStatus(request.donation);

    res.status(200).json({
      success: true,
      message: 'Food request cancelled successfully!',
      request
    });

  } catch (error) {
    console.error('Cancel Food Request Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while cancelling food request.'
    });
  }
};
// Get Incoming Food Requests for Donor
const getIncomingRequests = async (req, res) => {
  try {
    const requests = await FoodRequest.find({
      donor: req.user.id
    })
      .populate('donation', 'foodName category quantity unit')
      .populate('ngo', 'fullName organizationName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });

  } catch (error) {
    console.error('Get Incoming Requests Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching incoming requests.'
    });
  }
};
// Donor Approves or Rejects a Food Request
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Approved or Rejected.'
      });
    }

    // Find and update the donor's pending request
    const request = await FoodRequest.findOneAndUpdate(
      {
        _id: req.params.id,
        donor: req.user.id,
        status: 'Pending'
      },
      {
        status
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Pending request not found or cannot be updated.'
      });
    }
    // Refresh donation status after approval or rejection
await updateDonationStatus(request.donation);

    res.status(200).json({
      success: true,
      message: `Food request ${status.toLowerCase()} successfully!`,
      request
    });

  } catch (error) {
    console.error('Update Request Status Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while updating request status.'
    });
  }
};
// NGO Confirms Food Collection
const confirmFoodCollection = async (req, res) => {
  try {
    // Find an approved request belonging to this NGO
    const request = await FoodRequest.findOne({
      _id: req.params.id,
      ngo: req.user.id,
      status: 'Approved'
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Approved request not found or cannot be collected.'
      });
    }

    // Find the associated donation
    const donation = await Donation.findById(request.donation);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Associated donation not found.'
      });
    }

    // Calculate remaining food quantity
    const remainingQuantity =
      donation.quantity - request.requestedQuantity;

    if (remainingQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient food quantity remaining.'
      });
    }

    // Update donation quantity
    donation.quantity = remainingQuantity;

    // Update donation status
    const otherRequests = await FoodRequest.aggregate([
      {
        $match: {
          donation: donation._id,
          _id: { $ne: request._id },
          status: { $in: ['Pending', 'Approved'] }
        }
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$requestedQuantity' }
        }
      }
    ]);

    const reservedQuantity = otherRequests[0]?.totalQuantity || 0;

    if (remainingQuantity === 0) {
      donation.status = 'Collected';
    } else if (reservedQuantity >= remainingQuantity) {
      donation.status = 'Requested';
    } else if (reservedQuantity > 0) {
      donation.status = 'Partially Requested';
    } else {
      donation.status = 'Available';
    }

    await donation.save();

    // Update request status
    request.status = 'Collected';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Food collection confirmed successfully!',
      request,
      remainingQuantity,
      donationStatus: donation.status
    });

  } catch (error) {
    console.error('Confirm Food Collection Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while confirming food collection.'
    });
  }
};
module.exports = {
  createFoodRequest,
  getMyFoodRequests,
  cancelFoodRequest,
  getIncomingRequests,
  updateRequestStatus,
  confirmFoodCollection
};