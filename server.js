require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the Database Schema for Visitors
const visitorSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  userAgent: String, // Device/Browser info
});
const Visitor = mongoose.model('Visitor', visitorSchema);

// (a) POST endpoint - Logs a new visit
app.post('/api/visit', async (req, res) => {
  try {
    const newVisit = new Visitor({
      userAgent: req.headers['user-agent'] || 'Unknown'
    });
    await newVisit.save();
    res.status(201).json({ message: 'Visit logged successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log visit' });
  }
});

// (b) GET endpoint - Returns aggregated data
app.get('/api/stats', async (req, res) => {
  try {
    const totalCount = await Visitor.countDocuments();
    // Get the last 5 entries, sorted by newest first
    const recentVisits = await Visitor.find().sort({ timestamp: -1 }).limit(5);
    
    res.status(200).json({
      totalCount: totalCount,
      lastEntries: recentVisits
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});