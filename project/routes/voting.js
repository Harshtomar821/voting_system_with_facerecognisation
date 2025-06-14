// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const Voter = require('../models/Voter');
// const Candidate = require('../models/Candidate');
// const Vote = require('../models/Vote');
// const Election = require('../models/Election');

// // Get active election and candidates
// router.get('/election', async (req, res) => {
//   try {
//     let election, candidates;
    
//     if (global.fallbackStorage) {
//       election = global.fallbackStorage.elections[0];
//       candidates = global.fallbackStorage.candidates.filter(c => c.isActive);
//     } else {
//       election = await Election.findOne({ isActive: true });
//       candidates = await Candidate.find({ isActive: true });
//     }

//     if (!election || !election.isActive) {
//       return res.status(400).json({
//         success: false,
//         message: 'No active election found'
//       });
//     }

//     res.json({
//       success: true,
//       election,
//       candidates
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Verify face and cast vote
// router.post('/cast-vote', async (req, res) => {
//   try {
//     const { voterId, candidateId, faceImage } = req.body;

//     // Get voter details
//     let voter;
//     if (global.fallbackStorage) {
//       voter = global.fallbackStorage.voters.find(v => v.id === voterId);
//     } else {
//       voter = await Voter.findById(voterId);
//     }

//     if (!voter) {
//       return res.status(404).json({
//         success: false,
//         message: 'Voter not found'
//       });
//     }

//     if (voter.hasVoted) {
//       return res.status(400).json({
//         success: false,
//         message: 'Vote already cast'
//       });
//     }

//     // Face verification (simplified for demo)
//     const faceMatch = await verifyFace(voter.faceImage, faceImage);
    
//     if (!faceMatch) {
//       return res.status(400).json({
//         success: false,
//         message: 'Face verification failed. Please try again.'
//       });
//     }

//     // Cast vote
//     if (global.fallbackStorage) {
//       // Update voter
//       voter.hasVoted = true;
//       voter.votedAt = new Date();

//       // Update candidate votes
//       const candidate = global.fallbackStorage.candidates.find(c => c.id === candidateId);
//       if (candidate) {
//         candidate.votes += 1;
//       }

//       // Record vote
//       global.fallbackStorage.votes.push({
//         id: Date.now().toString(),
//         voterId,
//         candidateId,
//         timestamp: new Date()
//       });

//       // Update election
//       if (global.fallbackStorage.elections[0]) {
//         global.fallbackStorage.elections[0].totalVotes += 1;
//       }
//     } else {
//       // Update voter
//       voter.hasVoted = true;
//       voter.votedAt = new Date();
//       await voter.save();

//       // Update candidate votes
//       await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

//       // Record vote
//       const vote = new Vote({
//         voterId,
//         candidateId,
//         electionId: voter.electionId || null
//       });
//       await vote.save();

//       // Update election total votes
//       await Election.findOneAndUpdate(
//         { isActive: true },
//         { $inc: { totalVotes: 1 } }
//       );
//     }

//     res.json({
//       success: true,
//       message: 'Vote cast successfully!'
//     });
//   } catch (error) {
//     console.error('Voting error:', error);
//     res.status(500).json({ success: false, message: 'Server error during voting' });
//   }
// });

// // Get live results
// router.get('/results', async (req, res) => {
//   try {
//     let candidates, totalVotes;

//     if (global.fallbackStorage) {
//       candidates = global.fallbackStorage.candidates.map(c => ({
//         id: c.id,
//         name: c.name,
//         party: c.party,
//         symbol: c.symbol,
//         votes: c.votes
//       }));
//       totalVotes = global.fallbackStorage.votes.length;
//     } else {
//       candidates = await Candidate.find({ isActive: true }).select('name party symbol votes');
//       totalVotes = await Vote.countDocuments();
//     }

//     // Calculate percentages
//     const results = candidates.map(candidate => ({
//       ...candidate.toObject ? candidate.toObject() : candidate,
//       percentage: totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0
//     }));

//     // Sort by votes (descending)
//     results.sort((a, b) => b.votes - a.votes);

//     res.json({
//       success: true,
//       results,
//       totalVotes
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Simplified face verification function
// async function verifyFace(storedFace, liveFace) {
//   try {
//     // In production, this would call the Python face recognition API
//     // For demo purposes, we'll simulate face matching
    
//     // Basic similarity check (this is just for demo - not actual face recognition)
//     if (storedFace && liveFace) {
//       // Simulate face matching with 90% success rate for demo
//       return Math.random() > 0.1;
//     }
    
//     return false;
//   } catch (error) {
//     console.error('Face verification error:', error);
//     return false;
//   }
// }

// module.exports = router;
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Voter = require('../models/Voter');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const Election = require('../models/Election');

// Get active election and candidates
router.get('/election', async (req, res) => {
  try {
    let election, candidates;
    
    if (global.fallbackStorage) {
      election = global.fallbackStorage.elections[0];
      candidates = global.fallbackStorage.candidates.filter(c => c.isActive);
    } else {
      election = await Election.findOne({ isActive: true });
      candidates = await Candidate.find({ isActive: true });
    }

    if (!election || !election.isActive) {
      return res.status(400).json({
        success: false,
        message: 'No active election found'
      });
    }

    res.json({
      success: true,
      election,
      candidates
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Verify face and cast vote
router.post('/cast-vote', async (req, res) => {
  try {
    const { voterId, candidateId, faceImage } = req.body;

    // Get voter details
    let voter;
    if (global.fallbackStorage) {
      voter = global.fallbackStorage.voters.find(v => v.id === voterId);
    } else {
      voter = await Voter.findById(voterId);
    }

    if (!voter) {
      return res.status(404).json({
        success: false,
        message: 'Voter not found'
      });
    }

    if (voter.hasVoted) {
      return res.status(400).json({
        success: false,
        message: 'Vote already cast'
      });
    }

    // Face verification (simplified for demo)
    const faceMatch = await verifyFace(voter.faceImage, faceImage);
    
    if (!faceMatch) {
      return res.status(400).json({
        success: false,
        message: 'Face verification failed. Please try again.'
      });
    }

    // Cast vote
    if (global.fallbackStorage) {
      // Update voter
      voter.hasVoted = true;
      voter.votedAt = new Date();

      // Update candidate votes
      const candidate = global.fallbackStorage.candidates.find(c => c.id === candidateId);
      if (candidate) {
        candidate.votes += 1;
      }

      // Record vote
      global.fallbackStorage.votes.push({
        id: Date.now().toString(),
        voterId,
        candidateId,
        timestamp: new Date()
      });

      // Update election
      if (global.fallbackStorage.elections[0]) {
        global.fallbackStorage.elections[0].totalVotes += 1;
      }
    } else {
      // ✅ Get active election from DB
      const activeElection = await Election.findOne({ isActive: true });

      if (!activeElection) {
        return res.status(400).json({
          success: false,
          message: 'No active election available.'
        });
      }

      // ✅ Update voter
      voter.hasVoted = true;
      voter.votedAt = new Date();
      await voter.save();

      // ✅ Update candidate votes
      await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

      // ✅ Record vote with electionId
      const vote = new Vote({
        voterId,
        candidateId,
        electionId: activeElection._id
      });
      await vote.save();

      // ✅ Update election total votes
      await Election.findByIdAndUpdate(
        activeElection._id,
        { $inc: { totalVotes: 1 } }
      );
    }

    res.json({
      success: true,
      message: 'Vote cast successfully!'
    });
  } catch (error) {
    console.error('Voting error:', error);
    res.status(500).json({ success: false, message: 'Server error during voting' });
  }
});

// Get live results
router.get('/results', async (req, res) => {
  try {
    let candidates, totalVotes;

    if (global.fallbackStorage) {
      candidates = global.fallbackStorage.candidates.map(c => ({
        id: c.id,
        name: c.name,
        party: c.party,
        symbol: c.symbol,
        votes: c.votes
      }));
      totalVotes = global.fallbackStorage.votes.length;
    } else {
      candidates = await Candidate.find({ isActive: true }).select('name party symbol votes');
      totalVotes = await Vote.countDocuments();
    }

    // Calculate percentages
    const results = candidates.map(candidate => ({
      ...candidate.toObject ? candidate.toObject() : candidate,
      percentage: totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0
    }));

    // Sort by votes (descending)
    results.sort((a, b) => b.votes - a.votes);

    res.json({
      success: true,
      results,
      totalVotes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Simplified face verification function
async function verifyFace(storedFace, liveFace) {
  try {
    // In production, this would call the Python face recognition API
    // For demo purposes, we'll simulate face matching
    
    // Basic similarity check (this is just for demo - not actual face recognition)
    if (storedFace && liveFace) {
      // Simulate face matching with 90% success rate for demo
      return Math.random() > 0.1;
    }
    
    return false;
  } catch (error) {
    console.error('Face verification error:', error);
    return false;
  }
}

module.exports = router;
