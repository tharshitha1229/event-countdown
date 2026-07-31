const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('Server is successfully running! Go to /api/stats to view data.');
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB successfully!"))
.catch(err => console.error("MongoDB connection error:", err));

// 1. Create the Database Schema for a Visit
const visitSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  userAgent: { type: String } 
});
const Visit = mongoose.model('Visit', visitSchema);

// 2. The POST Route (Requirement A)
app.post('/api/visit', async (req, res) => {
  try {
    const visitorInfo = req.headers['user-agent'] || 'Unknown Device';
    const newVisit = new Visit({ userAgent: visitorInfo });
    await newVisit.save();
    res.status(201).json({ message: "Visitor activity logged successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to log visit" });
  }
});

// 3. The GET Route (Requirement B)
app.get('/api/stats', async (req, res) => {
  try {
    const totalVisits = await Visit.countDocuments();
    const recentVisits = await Visit.find().sort({ timestamp: -1 }).limit(5);
    
    res.status(200).json({
      totalCount: totalVisits,
      lastEntries: recentVisits
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
