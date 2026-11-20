const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    foodName: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Cooked Meals',
        'Bakery Items',
        'Fruits',
        'Vegetables',
        'Dairy Products',
        'Packaged Food'
      ]
    },

    quantity: {
  type: Number,
  required: true,
  min: 0
},

    unit: {
      type: String,
      required: true,
      enum: ['Packs', 'Kg', 'Litres', 'Pieces', 'Boxes']
    },

    foodType: {
      type: String,
      required: true,
      enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan']
    },

    preparedAt: {
      type: Date,
      required: true
    },

    pickupDeadline: {
      type: Date,
      required: true
    },

    storage: {
      type: String,
      default: ''
    },

    allergens: {
      type: [String],
      default: []
    },

    address: { type: String, required: true },
    // Pickup location coordinates
pickupLocation: {
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  }
},

// Maximum distance for food distribution
distributionRadiusKm: {
  type: Number,
  required: true,
  min: 1,
  max: 50,
  default: 5
},
notes: { type: String, default: '' },

// Food donation images
images: {
  type: [String],
  default: []
},

    status: {
      type: String,
      enum: [
        'Available',
        'Partially Requested',
        'Requested',
        'Collected',
        'Expired'
      ],
      default: 'Available'
    }
  },
  {
    timestamps: true
  }
);

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;