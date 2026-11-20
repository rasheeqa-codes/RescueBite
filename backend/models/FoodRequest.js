const mongoose = require('mongoose');

const foodRequestSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      required: true
    },

    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    requestedQuantity: {
      type: Number,
      required: true,
      min: 1
    },

    status: {
      type: String,
      enum: [
        'Pending',
        'Approved',
        'Rejected',
        'Collected',
        'Cancelled'
      ],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

const FoodRequest = mongoose.model('FoodRequest', foodRequestSchema);

module.exports = FoodRequest;