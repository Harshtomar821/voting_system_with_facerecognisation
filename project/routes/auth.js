// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const router = express.Router();

// // Admin login (hardcoded for demo)
// const ADMIN_CREDENTIALS = {
//   username: 'admin',
//   password: 'admin123' // In production, this should be hashed
// };

// // Admin login
// router.post('/admin/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
//       const token = jwt.sign(
//         { userId: 'admin', role: 'admin' },
//         process.env.JWT_SECRET || 'fallback_secret',
//         { expiresIn: '24h' }
//       );

//       res.json({
//         success: true,
//         token,
//         user: { username, role: 'admin' }
//       });
//     } else {
//       res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Middleware to verify admin token
// const verifyAdmin = (req, res, next) => {
//   const token = req.header('x-auth-token');

//   if (!token) {
//     return res.status(401).json({ success: false, message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
//     if (decoded.role !== 'admin') {
//       return res.status(403).json({ success: false, message: 'Access denied' });
//     }
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ success: false, message: 'Invalid token' });
//   }
// };

// module.exports = { router, verifyAdmin };
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Admin login route
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const token = jwt.sign(
        { userId: 'admin', role: 'admin' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        user: { username, role: 'admin' }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Middleware to verify admin token (export separately later if needed)
const verifyAdmin = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// 👇 Export only the router
module.exports = router;

// 👇 ALSO export the middleware separately (optional)
module.exports.verifyAdmin = verifyAdmin;
