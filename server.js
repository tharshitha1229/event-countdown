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