require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('../config/db');
const User = require('../models/User');

const setupAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error('Admin environment variables are missing.');
    }

    await connectDB();

    const email = ADMIN_EMAIL.trim().toLowerCase();

    // Check whether this email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log('An Admin account with this email already exists.');
        return;
      }

      throw new Error(
        'This email already belongs to a non-admin account. Choose another email.'
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = await User.create({
      fullName: ADMIN_NAME.trim(),
      email,
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });

    console.log('Admin account created successfully!');
    console.log('Admin email:', admin.email);
    console.log('Admin role:', admin.role);

  } catch (error) {
    console.error('Admin setup failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

setupAdmin();