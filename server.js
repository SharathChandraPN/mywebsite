const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3019;

// MongoDB Connection
const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;
const uri = `mongodb+srv://${user}:${pass}@userb.57sqcf0.mongodb.net/`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Mongoose User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  visits: [{ date: { type: Date, default: Date.now } }]
});
const User = mongoose.model('User', userSchema);

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).send('User already exists');
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hash });
  user.visits.push({});
  await user.save();
  req.session.userId = user._id;
  res.status(201).send('Registered');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).send('Invalid email');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send('Invalid password');
  user.visits.push({});
  await user.save();
  req.session.userId = user._id;
  res.status(200).send('Logged in');
});

// Protect portfolio.html
app.get('/portfolio.html', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'portfolio.html'));
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.status(200).send('Logged out');
  });
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
