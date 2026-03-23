/**
 * routes/auth.js — NEW FILE
 * Path: backend/routes/auth.js
 *
 * POST /api/auth/register  → create account
 * POST /api/auth/login     → login + get JWT
 */
const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const router  = express.Router();

function genToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

/* ── Register (Mocked) ── */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required.' });

    // MOCK MONGODB BYPASS
    const fakeId = 'mock_user_' + Date.now();
    res.status(201).json({
      token: genToken(fakeId),
      user:  { id: fakeId, name, email },
    });
  } catch (err) {
    console.error('[Auth Register Mock]', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

/* ── Login (Mocked) ── */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    // MOCK MONGODB BYPASS
    const fakeId = 'mock_user_' + Date.now();
    res.json({
      token: genToken(fakeId),
      user:  { id: fakeId, name: email.split('@')[0], email },
    });
  } catch (err) {
    console.error('[Auth Login Mock]', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
