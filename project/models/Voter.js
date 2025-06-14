const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  aadhaar: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{4}\s\d{4}\s\d{4}$/
  },
  faceImage: {
    type: String, // Base64 encoded image
    required: true
  },
  hasVoted: {
    type: Boolean,
    default: false
  },
  votedAt: {
    type: Date
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Voter', voterSchema);