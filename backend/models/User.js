const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ['donor', 'ngo', 'admin'],
      required: true
    },

    organizationName: {
      type: String,
      trim: true,
      default: ''
    },
    
    // NGO organisation location
organizationAddress: {
  type: String,
  default: ''
},
registrationNumber: {
  type: String,
  default: ''
},

contactPerson: {
  type: String,
  default: ''
},

phone: {
  type: String,
  default: ''
},

description: {
  type: String,
  default: ''
},

organizationLocation: {
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  }
},

    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;