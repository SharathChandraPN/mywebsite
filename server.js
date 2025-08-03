const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = process.env.PORT || 3019;

// Mongoose Schema
const visitorSchema = new mongoose.Schema({
  name: String,
  date: { type: Date, default: Date.now }
});

const Visitor = mongoose.model('Visitor', visitorSchema);

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;
const uri = `mongodb+srv://${user}:${pass}@userb.57sqcf0.mongodb.net/`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// Route to store visitor name
app.post('/api/visitors', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send('Name required');

  try {
    const visitor = new Visitor({ name });
    await visitor.save();
    res.status(201).send('Visitor saved');
  } catch (err) {
    res.status(500).send('Error saving visitor');
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
