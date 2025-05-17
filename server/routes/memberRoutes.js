// server/routes/memberRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Member = require('../models/Member');

// Helper function to calculate years between two dates
function calculateYearsBetweenDates(startDate, endDate) {
  // Calculate the time difference in milliseconds
  const timeDiff = endDate.getTime() - startDate.getTime();
  
  // Convert milliseconds to years
  // Using 365.25 days per year to account for leap years
  const yearsDiff = timeDiff / (1000 * 60 * 60 * 24 * 365.25);
  
  return yearsDiff;
}

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find({});
    const updatedMembers = [];
    
    // Track if any balances were updated and need to be saved
    const membersToUpdate = [];
    
    for (const member of members) {
      const joiningDate = new Date(member.joiningDate);
      const currentDate = new Date();
      
      // Get the last date annual fees were charged or use joining date if not set
      const lastFeeDate = member.lastFeeDate ? new Date(member.lastFeeDate) : new Date(member.joiningDate);
      
      // Calculate how many years have passed since the last fee was charged
      const yearsSinceLastFee = calculateYearsBetweenDates(lastFeeDate, currentDate);
      
      // If at least one year has passed since the last fee was charged, add the fee
      if (yearsSinceLastFee >= 1) {
        // Round down to whole years
        const wholeYears = Math.floor(yearsSinceLastFee);
        const feeToAdd = 25000 * wholeYears;
        
        // Add the fee to the balance
        member.balance += feeToAdd;
        
        // Update the lastFeeDate by adding the exact number of years charged
        const newLastFeeDate = new Date(lastFeeDate);
        newLastFeeDate.setFullYear(lastFeeDate.getFullYear() + wholeYears);
        member.lastFeeDate = newLastFeeDate;
        
        console.log(`Adding ${feeToAdd} TZS to ${member.name} for ${wholeYears} years`);
        membersToUpdate.push(member);
      }
      
      // Calculate years since joining for expected balance calculation
      const yearsSinceJoining = calculateYearsBetweenDates(joiningDate, currentDate);
      const expectedFees = 25000 * (Math.floor(yearsSinceJoining) + 1); // +1 for initial fee
      
      // Add the member to the response array
      updatedMembers.push({
        ...member._doc,
        expectedBalance: expectedFees
      });
    }
    
    // Save all members that need balance updates
    if (membersToUpdate.length > 0) {
      const savePromises = membersToUpdate.map(member => member.save());
      await Promise.all(savePromises);
      console.log(`Updated balances for ${membersToUpdate.length} members`);
    }
    
    res.json(updatedMembers);
  } catch (error) {
    console.error('Error updating member balances:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add a new member
router.post('/', async (req, res) => {
  try {
    const { name, phoneNumber, joiningDate, balance } = req.body;

    const member = await Member.create({
      name,
      phoneNumber,
      joiningDate: joiningDate || Date.now(),
      balance: balance !== undefined ? balance : 25000, // ✅ allows 0
    });

    if (member) {
      res.status(201).json(member);
    } else {
      res.status(400).json({ message: 'Invalid member data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Make a payment
router.post('/:id/payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Subtract the payment amount from the balance
    // Note: This allows balance to go negative
    member.balance -= Number(amount);
    await member.save();

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a member
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    await Member.findByIdAndDelete(id);
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;