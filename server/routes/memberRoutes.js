// server/routes/memberRoutes.js
const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find({});
    
    // Calculate updated balances based on joining date
    const updatedMembers = members.map(member => {
      const joiningDate = new Date(member.joiningDate);
      const currentDate = new Date();
      
      // Calculate years since joining
      const yearDiff = currentDate.getFullYear() - joiningDate.getFullYear();
      const monthDiff = currentDate.getMonth() - joiningDate.getMonth();
      const dayDiff = currentDate.getDate() - joiningDate.getDate();
      
      // Adjust year difference if needed based on month and day
      let yearsSinceJoining = yearDiff;
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        yearsSinceJoining--;
      }
      
      // Calculate what the total expected annual fees would be
      const expectedFees = 25000 * (yearsSinceJoining + 1);
      
      // Return the document with its actual balance (which includes payments made)
      // and a calculated field showing the total expected fees since joining
      return {
        ...member._doc,
        calculatedBalance: expectedFees
      };
    });
    
    res.json(updatedMembers);
  } catch (error) {
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
      balance: balance || 25000,
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