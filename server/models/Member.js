const mongoose = require('mongoose');

const memberSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    balance: {
      type: Number,
      required: true,
      default: 25000, // Default balance in TZS
    },
    lastFeeDate: {
      type: Date,
      required: false,
      // Will be set to the joining date when a member is created
    },
  },
  {
    timestamps: true,
    database: 'KMC',
    collection: 'Membership'
  }
);

// Pre-save middleware to set lastFeeDate to joining date if not already set
memberSchema.pre('save', function(next) {
  // Only set lastFeeDate if it's a new document or lastFeeDate isn't set
  if (this.isNew || !this.lastFeeDate) {
    this.lastFeeDate = this.joiningDate;
  }
  next();
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;