const Donation = require('../models/Donation');
const User = require('../models/User');
const calculateDistance = require('../utils/calculateDistance');
const FoodRequest = require('../models/FoodRequest');
// Create Food Donation
const createDonation = async (req, res) => {
  try {
    const {
  foodName,
  category,
  quantity,
  unit,
  foodType,
  preparedAt,
  pickupDeadline,
  storage,
  allergens,
  address,
  notes,
  pickupLatitude,
  pickupLongitude,
  distributionRadiusKm
} = req.body;

    // Check required fields
    if (
      !foodName ||
      !category ||
      !quantity ||
      !unit ||
      !foodType ||
      !preparedAt ||
      !pickupDeadline ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required donation details.'
      });
    }
    // Validate pickup location
const latitude = Number(pickupLatitude);
const longitude = Number(pickupLongitude);
const radius = distributionRadiusKm === undefined || distributionRadiusKm === ''
  ? 5
  : Number(distributionRadiusKm);

if (
  pickupLatitude === undefined ||
  pickupLongitude === undefined ||
  !Number.isFinite(latitude) ||
  !Number.isFinite(longitude) ||
  latitude < -90 ||
  latitude > 90 ||
  longitude < -180 ||
  longitude > 180
) {
  return res.status(400).json({
    success: false,
    message: 'Please provide valid pickup location coordinates.'
  });
}

if (!Number.isFinite(radius) || radius < 1 || radius > 50) {
  return res.status(400).json({
    success: false,
    message: 'Distribution radius must be between 1 and 50 km.'
  });
}

    // Validate quantity
    if (!Number.isFinite(Number(quantity)) || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than zero.'
      });
    }

    // Validate dates
    const preparationDate = new Date(preparedAt);
    const deadline = new Date(pickupDeadline);

    if (
      Number.isNaN(preparationDate.getTime()) ||
      Number.isNaN(deadline.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid dates.'
      });
    }

    if (preparationDate > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Preparation date cannot be in the future.'
      });
    }

    if (deadline <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Pickup deadline must be in the future.'
      });
    }

    if (deadline <= preparationDate) {
      return res.status(400).json({
        success: false,
        message: 'Pickup deadline must be after preparation time.'
      });
    }

    // Get uploaded image paths
const images = req.files
  ? req.files.map(file => `/uploads/${file.filename}`)
  : [];

// Create donation
const donation = await Donation.create({
  donor: req.user.id,
  foodName,
  category,
  quantity,
  unit,
  foodType,
  preparedAt: preparationDate,
  pickupDeadline: deadline,
  storage,
  allergens,
  address,
  notes,
  images,

  pickupLocation: {
    latitude,
    longitude
  },

  distributionRadiusKm: radius
});

    res.status(201).json({
      success: true,
      message: 'Food donation created successfully!',
      donation
    });

  } catch (error) {
    console.error('Create Donation Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while creating donation.'
    });
  }
};
// Get Donations Created by Logged-in Donor
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      donor: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations
    });

  } catch (error) {
    console.error('Get Donations Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching donations.'
    });
  }
};
// Get Available Donations for NGOs
// Get Available Donations for NGOs with Search and Filters
const getAvailableDonations = async (req, res) => {
  try {
    const { search, category, foodType } = req.query;

    // Get NGO's saved location
    const ngo = await User.findById(req.user.id);

    if (
      !ngo ||
      !ngo.organizationLocation ||
      !Number.isFinite(ngo.organizationLocation.latitude) ||
      !Number.isFinite(ngo.organizationLocation.longitude)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please update your organisation location first.'
      });
    }

    // Find donations already requested by this NGO
    const existingRequests = await FoodRequest.find({
  ngo: req.user.id,
  status: { $in: ['Pending', 'Approved'] }
}).select('donation');

    const requestedDonationIds = existingRequests.map(
      request => request.donation
    );

    // Build donation filters
    const filters = {
      status: { $in: ['Available', 'Partially Requested'] },
      pickupDeadline: { $gt: new Date() },
      _id: { $nin: requestedDonationIds }
    };

    if (search && search.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filters.foodName = { $regex: escapedSearch, $options: 'i' };
    }

    if (category) filters.category = category;
    if (foodType) filters.foodType = foodType;

    const donations = await Donation.find(filters)
      .populate('donor', 'fullName organizationName')
      .sort({ createdAt: -1 });

    // Filter donations using distance
    const nearbyDonations = donations
      .map(donation => {
        if (
          !donation.pickupLocation ||
          !Number.isFinite(donation.pickupLocation.latitude) ||
          !Number.isFinite(donation.pickupLocation.longitude)
        ) {
          return null;
        }

        const distanceKm = calculateDistance(
          ngo.organizationLocation.latitude,
          ngo.organizationLocation.longitude,
          donation.pickupLocation.latitude,
          donation.pickupLocation.longitude
        );

        if (distanceKm > donation.distributionRadiusKm) {
          return null;
        }

        return {
          ...donation.toObject(),
          distanceKm: Number(distanceKm.toFixed(2))
        };
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      count: nearbyDonations.length,
      donations: nearbyDonations
    });

  } catch (error) {
    console.error('Get Available Donations Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching available donations.'
    });
  }
};
// Get Single Donation Details for NGOs
const getDonationDetailsForNGO = async (req, res) => {
  try {
    // Get NGO location
    const ngo = await User.findById(req.user.id);

    if (
      !ngo ||
      !ngo.organizationLocation ||
      !Number.isFinite(ngo.organizationLocation.latitude) ||
      !Number.isFinite(ngo.organizationLocation.longitude)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please update your organisation location first.'
      });
    }

    // Find available donation
    const donation = await Donation.findOne({
      _id: req.params.id,
      status: { $in: ['Available', 'Partially Requested'] },
      pickupDeadline: { $gt: new Date() }
    }).populate('donor', 'fullName organizationName');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found or no longer available.'
      });
    }

    // Check whether donation has coordinates
    if (
      !donation.pickupLocation ||
      !Number.isFinite(donation.pickupLocation.latitude) ||
      !Number.isFinite(donation.pickupLocation.longitude)
    ) {
      return res.status(404).json({
        success: false,
        message: 'Donation location is unavailable.'
      });
    }

    // Calculate distance
    const distanceKm = calculateDistance(
      ngo.organizationLocation.latitude,
      ngo.organizationLocation.longitude,
      donation.pickupLocation.latitude,
      donation.pickupLocation.longitude
    );

    // Check distribution radius
    if (distanceKm > donation.distributionRadiusKm) {
      return res.status(403).json({
        success: false,
        message: 'This donation is outside your permitted distribution area.'
      });
    }

    res.status(200).json({
      success: true,
      donation: {
        ...donation.toObject(),
        distanceKm: Number(distanceKm.toFixed(2))
      }
    });

  } catch (error) {
    console.error('Get NGO Donation Details Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching donation details.'
    });
  }
};
// Get Single Donation Details
const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findOne({
      _id: req.params.id,
      donor: req.user.id
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found.'
      });
    }

    res.status(200).json({
      success: true,
      donation
    });

  } catch (error) {
    console.error('Get Donation Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching donation.'
    });
  }
};
// Update Food Donation
// Update Food Donation
const updateDonation = async (req, res) => {
  try {
    const allowedFields = [
      'foodName',
      'category',
      'quantity',
      'unit',
      'foodType',
      'preparedAt',
      'pickupDeadline',
      'storage',
      'allergens',
      'address',
      'notes'
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update.'
      });
    }

    const donation = await Donation.findOne({
      _id: req.params.id,
      donor: req.user.id,
      status: 'Available'
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found or cannot be updated.'
      });
    }

    // Validate preparation and pickup dates
    const preparedAt = new Date(
      updates.preparedAt !== undefined
        ? updates.preparedAt
        : donation.preparedAt
    );

    const pickupDeadline = new Date(
      updates.pickupDeadline !== undefined
        ? updates.pickupDeadline
        : donation.pickupDeadline
    );

    const now = new Date();

    if (
      Number.isNaN(preparedAt.getTime()) ||
      Number.isNaN(pickupDeadline.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid dates.'
      });
    }

    if (preparedAt > now) {
      return res.status(400).json({
        success: false,
        message: 'Preparation date cannot be in the future.'
      });
    }

    if (pickupDeadline <= now) {
      return res.status(400).json({
        success: false,
        message: 'Pickup deadline must be in the future.'
      });
    }

    if (pickupDeadline <= preparedAt) {
      return res.status(400).json({
        success: false,
        message: 'Pickup deadline must be after preparation time.'
      });
    }

    if (updates.preparedAt !== undefined) {
      updates.preparedAt = preparedAt;
    }

    if (updates.pickupDeadline !== undefined) {
      updates.pickupDeadline = pickupDeadline;
    }

    const updatedDonation = await Donation.findByIdAndUpdate(
      donation._id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Donation updated successfully!',
      donation: updatedDonation
    });

  } catch (error) {
    console.error('Update Donation Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while updating donation.'
    });
  }
};
// Delete Food Donation
const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findOneAndDelete({
      _id: req.params.id,
      donor: req.user.id,
      status: 'Available'
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found or cannot be deleted.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Donation deleted successfully!'
    });

  } catch (error) {
    console.error('Delete Donation Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while deleting donation.'
    });
  }
};

module.exports = {
  createDonation,
  getMyDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  getAvailableDonations,
  getDonationDetailsForNGO
};