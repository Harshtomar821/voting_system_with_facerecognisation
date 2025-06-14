// const express = require('express');
// const router = express.Router();
// const { verifyAdmin } = require('./auth');
// const Candidate = require('../models/Candidate');
// const Election = require('../models/Election');
// const Voter = require('../models/Voter');
// const Vote = require('../models/Vote');

// // Get all candidates
// router.get('/candidates', verifyAdmin, async (req, res) => {
//   try {
//     let candidates;
//     if (global.fallbackStorage) {
//       candidates = global.fallbackStorage.candidates;
//     } else {
//       candidates = await Candidate.find().sort({ createdAt: -1 });
//     }
//     res.json({ success: true, candidates });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Add candidate
// router.post('/candidates', verifyAdmin, async (req, res) => {
//   try {
//     const { name, party, symbol } = req.body;

//     if (global.fallbackStorage) {
//       const candidate = {
//         id: Date.now().toString(),
//         name,
//         party,
//         symbol,
//         votes: 0,
//         isActive: true,
//         createdAt: new Date()
//       };
//       global.fallbackStorage.candidates.push(candidate);
//       res.json({ success: true, candidate });
//     } else {
//       const candidate = new Candidate({ name, party, symbol });
//       await candidate.save();
//       res.json({ success: true, candidate });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Delete candidate
// router.delete('/candidates/:id', verifyAdmin, async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (global.fallbackStorage) {
//       global.fallbackStorage.candidates = global.fallbackStorage.candidates.filter(c => c.id !== id);
//     } else {
//       await Candidate.findByIdAndDelete(id);
//     }

//     res.json({ success: true, message: 'Candidate deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Initialize default parties
// router.post('/init-parties', verifyAdmin, async (req, res) => {
//   try {
//     const defaultParties = [
//       { name: 'Narendra Modi', party: 'BJP', symbol: '🪷' },
//       { name: 'Rahul Gandhi', party: 'INC', symbol: '✋' },
//       { name: 'Arvind Kejriwal', party: 'AAP', symbol: '🧹' },
//       { name: 'Mayawati', party: 'BSP', symbol: '🐘' },
//       { name: 'Akhilesh Yadav', party: 'SP', symbol: '🚲' }
//     ];

//     if (global.fallbackStorage) {
//       global.fallbackStorage.candidates = defaultParties.map((party, index) => ({
//         id: (index + 1).toString(),
//         ...party,
//         votes: 0,
//         isActive: true,
//         createdAt: new Date()
//       }));
//     } else {
//       await Candidate.deleteMany({});
//       await Candidate.insertMany(defaultParties);
//     }

//     res.json({ success: true, message: 'Default parties initialized' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Election management
// router.get('/election', verifyAdmin, async (req, res) => {
//   try {
//     let election;
//     if (global.fallbackStorage) {
//       election = global.fallbackStorage.elections[0] || { isActive: false };
//     } else {
//       election = await Election.findOne() || { isActive: false };
//     }
//     res.json({ success: true, election });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// router.post('/election/toggle', verifyAdmin, async (req, res) => {
//   try {
//     if (global.fallbackStorage) {
//       if (!global.fallbackStorage.elections[0]) {
//         global.fallbackStorage.elections[0] = {
//           id: '1',
//           title: 'General Election 2024',
//           isActive: false,
//           totalVotes: 0,
//           createdAt: new Date()
//         };
//       }
//       global.fallbackStorage.elections[0].isActive = !global.fallbackStorage.elections[0].isActive;
//       const election = global.fallbackStorage.elections[0];
//     } else {
//       let election = await Election.findOne();
//       if (!election) {
//         election = new Election({
//           title: 'General Election 2024',
//           isActive: true,
//           startTime: new Date()
//         });
//       } else {
//         election.isActive = !election.isActive;
//         if (election.isActive) {
//           election.startTime = new Date();
//         } else {
//           election.endTime = new Date();
//         }
//       }
//       await election.save();
//     }
//     res.json({ success: true, message: `Election ${election.isActive ? 'started' : 'stopped'}` });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Get dashboard stats
// router.get('/stats', verifyAdmin, async (req, res) => {
//   try {
//     let stats;
//     if (global.fallbackStorage) {
//       stats = {
//         totalVoters: global.fallbackStorage.voters.length,
//         totalCandidates: global.fallbackStorage.candidates.length,
//         totalVotes: global.fallbackStorage.votes.length,
//         voterTurnout: global.fallbackStorage.voters.length > 0 ? 
//           (global.fallbackStorage.votes.length / global.fallbackStorage.voters.length * 100).toFixed(1) : 0
//       };
//     } else {
//       const totalVoters = await Voter.countDocuments();
//       const totalCandidates = await Candidate.countDocuments();
//       const totalVotes = await Vote.countDocuments();
//       const voterTurnout = totalVoters > 0 ? (totalVotes / totalVoters * 100).toFixed(1) : 0;

//       stats = {
//         totalVoters,
//         totalCandidates,
//         totalVotes,
//         voterTurnout
//       };
//     }
//     res.json({ success: true, stats });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// module.exports = router;





// gpt code 



const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('./auth');
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const Voter = require('../models/Voter');
const Vote = require('../models/Vote');

// Get all candidates
router.get('/candidates', verifyAdmin, async (req, res) => {
  try {
    let candidates;
    if (global.fallbackStorage) {
      candidates = global.fallbackStorage.candidates;
    } else {
      candidates = await Candidate.find().sort({ createdAt: -1 });
    }
    res.json({ success: true, candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add candidate
router.post('/candidates', verifyAdmin, async (req, res) => {
  try {
    const { name, party, symbol } = req.body;

    if (global.fallbackStorage) {
      const candidate = {
        id: Date.now().toString(),
        name,
        party,
        symbol,
        votes: 0,
        isActive: true,
        createdAt: new Date()
      };
      global.fallbackStorage.candidates.push(candidate);
      res.json({ success: true, candidate });
    } else {
      const candidate = new Candidate({ name, party, symbol });
      await candidate.save();
      res.json({ success: true, candidate });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete candidate
router.delete('/candidates/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (global.fallbackStorage) {
      global.fallbackStorage.candidates = global.fallbackStorage.candidates.filter(c => c.id !== id);
    } else {
      await Candidate.findByIdAndDelete(id);
    }

    res.json({ success: true, message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Initialize default parties
router.post('/init-parties', verifyAdmin, async (req, res) => {
  try {
    const defaultParties = [
      { name: 'Narendra Modi', party: 'BJP', symbol: '🪷' },
      { name: 'Rahul Gandhi', party: 'INC', symbol: '✋' },
      { name: 'Arvind Kejriwal', party: 'AAP', symbol: '🧹' },
      { name: 'Mayawati', party: 'BSP', symbol: '🐘' },
      { name: 'Akhilesh Yadav', party: 'SP', symbol: '🚲' }
    ];

    if (global.fallbackStorage) {
      global.fallbackStorage.candidates = defaultParties.map((party, index) => ({
        id: (index + 1).toString(),
        ...party,
        votes: 0,
        isActive: true,
        createdAt: new Date()
      }));
    } else {
      await Candidate.deleteMany({});
      await Candidate.insertMany(defaultParties);
    }

    res.json({ success: true, message: 'Default parties initialized' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Election management
router.get('/election', verifyAdmin, async (req, res) => {
  try {
    let election;
    if (global.fallbackStorage) {
      election = global.fallbackStorage.elections[0] || { isActive: false };
    } else {
      election = await Election.findOne() || { isActive: false };
    }
    res.json({ success: true, election });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Fixed toggle election route
router.post('/election/toggle', verifyAdmin, async (req, res) => {
  try {
    let election;

    if (global.fallbackStorage) {
      if (!global.fallbackStorage.elections) {
        global.fallbackStorage.elections = [];
      }

      if (!global.fallbackStorage.elections[0]) {
        global.fallbackStorage.elections[0] = {
          id: '1',
          title: 'General Election 2024',
          isActive: false,
          totalVotes: 0,
          createdAt: new Date()
        };
      }

      global.fallbackStorage.elections[0].isActive = !global.fallbackStorage.elections[0].isActive;
      election = global.fallbackStorage.elections[0];
    } else {
      election = await Election.findOne();
      if (!election) {
        election = new Election({
          title: 'General Election 2024',
          isActive: true,
          startTime: new Date()
        });
      } else {
        election.isActive = !election.isActive;
        if (election.isActive) {
          election.startTime = new Date();
        } else {
          election.endTime = new Date();
        }
      }
      await election.save();
    }

    res.json({ success: true, message: `Election ${election.isActive ? 'started' : 'stopped'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get dashboard stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    let stats;
    if (global.fallbackStorage) {
      stats = {
        totalVoters: global.fallbackStorage.voters.length,
        totalCandidates: global.fallbackStorage.candidates.length,
        totalVotes: global.fallbackStorage.votes.length,
        voterTurnout: global.fallbackStorage.voters.length > 0 ?
          (global.fallbackStorage.votes.length / global.fallbackStorage.voters.length * 100).toFixed(1) : 0
      };
    } else {
      const totalVoters = await Voter.countDocuments();
      const totalCandidates = await Candidate.countDocuments();
      const totalVotes = await Vote.countDocuments();
      const voterTurnout = totalVoters > 0 ? (totalVotes / totalVoters * 100).toFixed(1) : 0;

      stats = {
        totalVoters,
        totalCandidates,
        totalVotes,
        voterTurnout
      };
    }
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
