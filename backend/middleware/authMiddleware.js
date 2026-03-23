/**
 * middleware/authMiddleware.js — NEW FILE
 * Path: backend/middleware/authMiddleware.js
 * Verifies JWT token on protected routes
 */
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
      return res.status(401).json({ message: 'Not authorized. Please login.' });

    const token   = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // MOCK LOGIC BYPASS
    req.user = { _id: decoded.id };
    // if (!req.user)
    //   return res.status(401).json({ message: 'User no longer exists.' });

    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired. Please login again.' });
  }
}

module.exports = { protect };
