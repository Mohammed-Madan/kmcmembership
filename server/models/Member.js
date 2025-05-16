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
  },
  {
    timestamps: true,
    database: 'KMC',
    collection: 'Membership'
    
  }
);

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;