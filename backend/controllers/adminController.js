const mongoose = require('mongoose');
const User = require('../models/User');
const Donation = require('../models/Donation');
const FoodRequest = require('../models/FoodRequest');

// ==========================================
// ADMIN DASHBOARD STATISTICS
// ==========================================

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalDonors,
      totalNGOs,
      totalDonations,
      completedCollections,
      pendingRequests,
      totalRequests
    ] = await Promise.all([
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'ngo' }),
      Donation.countDocuments(),
      Donation.countDocuments({ status: 'Collected' }),
      FoodRequest.countDocuments({ status: 'Pending' }),
      FoodRequest.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalDonors,
        totalNGOs,
        totalDonations,
        completedCollections,
        pendingRequests,
        totalRequests
      }
    });
  } catch (error) {
    console.error('Admin dashboard statistics error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch dashboard statistics.'
    });
  }
};

// ==========================================
// GET ALL DONORS
// ==========================================

const getAllDonors = async (req, res) => {
  try {
    const donors = await User.find({ role: 'donor' })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: donors.length,
      donors
    });
  } catch (error) {
    console.error('Admin get donors error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch donors.'
    });
  }
};

// ==========================================
// GET ALL NGOs
// ==========================================

const getAllNGOs = async (req, res) => {
  try {
    const ngos = await User.find({ role: 'ngo' })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: ngos.length,
      ngos
    });
  } catch (error) {
    console.error('Admin get NGOs error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch NGOs.'
    });
  }
};

// ==========================================
// GET ALL DONATIONS
// ==========================================

const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'fullName email phone organizationName')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    console.error('Admin get donations error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch donations.'
    });
  }
};

// ==========================================
// GET ALL FOOD REQUESTS
// ==========================================

const getAllRequests = async (req, res) => {
  try {
    const requests = await FoodRequest.find()
      .populate('donation')
      .populate('ngo', 'fullName email phone organizationName')
      .populate('donor', 'fullName email phone organizationName')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Admin get requests error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch food requests.'
    });
  }
};
// ==========================================
// VERIFY DONOR / NGO ACCOUNT
// ==========================================

const verifyAccount = async (req, res) => {
  try {
    const { role, id } = req.params;

    // Only donors and NGOs can be verified through this function
    if (!['donor', 'ngo'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid account role.'
      });
    }

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid account ID.'
      });
    }

    // Find and verify the account
    const user = await User.findOneAndUpdate(
      {
        _id: id,
        role: role
      },
      {
        $set: { isVerified: true }
      },
      {
        new: true,
        runValidators: true
      }
    )
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `${role === 'ngo' ? 'NGO' : 'Donor'} verified successfully.`,
      user
    });

  } catch (error) {
    console.error('Admin account verification error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to verify account.'
    });
  }
};
// Reports & Analytics
const getReportsAnalytics = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const [
      totalDonations,
      completedCollections,
      totalDonors,
      totalNGOs,
      monthlyDonations,
      donationStatuses,
      topNGOs
    ] = await Promise.all([

      // Overall statistics
      Donation.countDocuments(),
      Donation.countDocuments({ status: 'Collected' }),
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'ngo' }),

      // Monthly donations for current year
      Donation.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(currentYear, 0, 1),
              $lt: new Date(currentYear + 1, 0, 1)
            }
          }
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Donation status distribution
      Donation.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),

      // Top NGOs based on successful collections
      FoodRequest.aggregate([
        {
          $match: {
            status: 'Collected'
          }
        },
        {
          $group: {
            _id: '$ngo',
            totalCollected: { $sum: 1 }
          }
        },
        { $sort: { totalCollected: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'ngoDetails'
          }
        },
        {
          $unwind: '$ngoDetails'
        },
        {
          $project: {
            _id: 1,
            ngoName: {
              $ifNull: [
                '$ngoDetails.organizationName',
                '$ngoDetails.fullName'
              ]
            },
            totalCollected: 1
          }
        }
      ])
    ]);

    // Fill all 12 months, including months with zero donations
    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const monthNumber = index + 1;

      const existingMonth = monthlyDonations.find(
        item => item._id === monthNumber
      );

      return {
        month: new Date(currentYear, index).toLocaleString('en', {
          month: 'short'
        }),
        count: existingMonth ? existingMonth.count : 0
      };
    });

    // Calculate percentage for each status
    const statusData = donationStatuses.map(item => ({
      name: item._id,
      value: item.count,
      percentage: totalDonations
        ? Math.round((item.count / totalDonations) * 100)
        : 0
    }));

    res.status(200).json({
      success: true,
      analytics: {
        year: currentYear,
        stats: {
          totalDonations,
          completedCollections,
          totalDonors,
          totalNGOs
        },
        monthlyDonations: monthlyData,
        donationStatuses: statusData,
        topNGOs
      }
    });

  } catch (error) {
    console.error('Admin reports analytics error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch reports and analytics.'
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllDonors,
  getAllNGOs,
  getAllDonations,
  getAllRequests,
  verifyAccount,
  getReportsAnalytics
};