const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      organizationName
    } = req.body;

    // Check required fields
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields.'
      });
    }

    // Validate role
    if (!['donor', 'ngo'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration role.'
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered.'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      organizationName: role === 'ngo' ? organizationName : ''
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error during registration.'
    });
  }
};
// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter email and password.'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Login Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error during login.'
    });
  }
};
// Get Logged-in User Profile
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Profile Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile.'
    });
  }
};
// Update Logged-in User Profile
const updateProfile = async (req, res) => {
  try {
    const {
  fullName,
  organizationName,
  organizationAddress,
  registrationNumber,
  contactPerson,
  phone,
  description,
  organizationLocation
} = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (fullName !== undefined) {
      user.fullName = fullName.trim();
    }

    if (organizationName !== undefined) {
      user.organizationName = organizationName.trim();
    }
    if (organizationAddress !== undefined) {
  user.organizationAddress = organizationAddress.trim();
}

   if (registrationNumber !== undefined) {
  user.registrationNumber = registrationNumber.trim();
}

if (contactPerson !== undefined) {
  user.contactPerson = contactPerson.trim();
}

if (phone !== undefined) {
  user.phone = phone.trim();
}

if (description !== undefined) {
  user.description = description.trim();
}
if (organizationLocation !== undefined) {
  user.organizationLocation = organizationLocation;
}

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  organizationName: user.organizationName,
  organizationAddress: user.organizationAddress,
  registrationNumber: user.registrationNumber,
  contactPerson: user.contactPerson,
  phone: user.phone,
  description: user.description,
  organizationLocation: user.organizationLocation,
  isVerified: user.isVerified
}
    });

  } catch (error) {
    console.error('Update Profile Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while updating profile.'
    });
  }
};
module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};