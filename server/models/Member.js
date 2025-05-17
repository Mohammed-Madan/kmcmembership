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
      // Will be set based on joining date
    },
  },
  {
    timestamps: true,
    database: 'KMC',
    collection: 'Membership'
  }
);

// Pre-save middleware to set lastFeeDate to same day/month but current year
memberSchema.pre('save', function(next) {
  // Only set lastFeeDate if it's a new document or lastFeeDate isn't set
  if (this.isNew || !this.lastFeeDate) {
    const joiningDate = new Date(this.joiningDate);
    const currentDate = new Date();
    
    // Create a new date with joining date's day/month but current year
    const lastFeeDate = new Date(
      currentDate.getFullYear(),
      joiningDate.getMonth(),
      joiningDate.getDate()
    );
    
    // If this date is in the future (joining month/day hasn't occurred yet this year)
    // then use previous year instead
    if (lastFeeDate > currentDate) {
      lastFeeDate.setFullYear(currentDate.getFullYear() - 1);
    }
    
    this.lastFeeDate = lastFeeDate;
  }
  next();
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;