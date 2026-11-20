const User = require('../models/User');

// Update NGO organisation location
const updateNGOLocation = async (req, res) => {
  try {
    const {
      organizationAddress,
      latitude,
      longitude
    } = req.body;

    const lat = Number(latitude);
    const lon = Number(longitude);

    if (
      !organizationAddress ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid address and location coordinates.'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        organizationAddress,
        organizationLocation: {
          latitude: lat,
          longitude: lon
        }
      },
      { returnDocument: 'after' }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'NGO account not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'NGO location updated successfully!',
      user
    });

  } catch (error) {
    console.error('Update NGO Location Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while updating NGO location.'
    });
  }
};

module.exports = { updateNGOLocation };