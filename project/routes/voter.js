const express = require('express');
const router = express.Router();
const Voter = require('../models/Voter');

// Register voter
router.post('/register', async (req, res) => {
  try {
    const { name, aadhaar, faceImage } = req.body;

    // Validate Aadhaar format (XXXX XXXX XXXX)
    const aadhaarRegex = /^\d{4}\s\d{4}\s\d{4}$/;
    if (!aadhaarRegex.test(aadhaar)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Aadhaar format. Use: XXXX XXXX XXXX'
      });
    }

    // Check if voter already exists
    let existingVoter;
    if (global.fallbackStorage) {
      existingVoter = global.fallbackStorage.voters.find(v => v.aadhaar === aadhaar);
    } else {
      existingVoter = await Voter.findOne({ aadhaar });
    }

    if (existingVoter) {
      return res.status(400).json({
        success: false,
        message: 'Voter with this Aadhaar number already registered'
      });
    }

    // Create new voter
    if (global.fallbackStorage) {
      const voter = {
        id: Date.now().toString(),
        name,
        aadhaar,
        faceImage,
        hasVoted: false,
        registeredAt: new Date()
      };
      global.fallbackStorage.voters.push(voter);
      res.json({ success: true, message: 'Voter registered successfully', voterId: voter.id });
    } else {
      const voter = new Voter({ name, aadhaar, faceImage });
      await voter.save();
      res.json({ success: true, message: 'Voter registered successfully', voterId: voter._id });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Verify voter by Aadhaar
router.post('/verify', async (req, res) => {
  try {
    const { aadhaar } = req.body;

    let voter;
    if (global.fallbackStorage) {
      voter = global.fallbackStorage.voters.find(v => v.aadhaar === aadhaar);
    } else {
      voter = await Voter.findOne({ aadhaar }).select('-faceImage');
    }

    if (!voter) {
      return res.status(404).json({
        success: false,
        message: 'Voter not found. Please register first.'
      });
    }

    if (voter.hasVoted) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted in this election.'
      });
    }

    res.json({
      success: true,
      voter: {
        id: voter.id || voter._id,
        name: voter.name,
        aadhaar: voter.aadhaar,
        hasVoted: voter.hasVoted
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get voter face for verification
router.get('/face/:aadhaar', async (req, res) => {
  try {
    const { aadhaar } = req.params;

    let voter;
    if (global.fallbackStorage) {
      voter = global.fallbackStorage.voters.find(v => v.aadhaar === aadhaar);
    } else {
      voter = await Voter.findOne({ aadhaar });
    }

    if (!voter) {
      return res.status(404).json({
        success: false,
        message: 'Voter not found'
      });
    }

    res.json({
      success: true,
      faceImage: voter.faceImage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;