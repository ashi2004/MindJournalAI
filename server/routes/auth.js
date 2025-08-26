const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    // Check for missing fields
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required: username, email, password.' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({ username, email, password: hashedPassword });
    await user.save();
    // 🔑 Generate JWT right after registration
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Return token along with user info
    res.status(201).json({ token, username: user.username, email: user.email });
  } catch (err) {
    // Improved error output for debugging
    console.error('Register error:', err);
    let errorMsg = 'Server error';
    if (err.name === 'ValidationError') {
      errorMsg = err.message;
    } else if (err.code === 11000) {
      errorMsg = 'Duplicate field value: ' + JSON.stringify(err.keyValue);
    }
    res.status(500).json({ message: errorMsg, error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
