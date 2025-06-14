const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// MongoDB Connection (using local MongoDB or fallback to in-memory storage)
const connectDB = async () => {
  try {
    // Try to connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/voting_system');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log('MongoDB connection failed, using fallback storage');
    // Fallback to in-memory storage for demo purposes
    global.fallbackStorage = {
      voters: [],
      candidates: [],
      elections: [],
      votes: []
    };
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/voter', require('./routes/voter'));
app.use('/api/voting', require('./routes/voting'));

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/voter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'voter.html'));
});

app.get('/vote', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'vote.html'));
});

app.get('/results', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'results.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the application at http://localhost:${PORT}`);
});