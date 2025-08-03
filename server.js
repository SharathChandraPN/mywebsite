const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3019;

// Allow CORS for frontend hosted elsewhere (optional)
app.use(cors());

// Serve static files (HTML, CSS, JS, GIFs)
app.use(express.static(path.join(__dirname)));

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://rajuser:mZRUEs6CPRlOCRJK@userb.57sqcf0.mongodb.net/visitorDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Define schema and model
const visitorSchema = new mongoose.Schema({
  name: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
const Visitor = mongoose.model('Visitor', visitorSchema);

// Save visitor name API
app.post('/api/save-user', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  try {
    await Visitor.create({ name });
    res.status(201).json({ message: 'Name saved successfully' });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/portfolio.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'portfolio.html'));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
