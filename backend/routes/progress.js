/**
 * routes/progress.js — NEW FILE
 * Path: backend/routes/progress.js
 *
 * GET  /api/progress/gita        → get watched chapters for logged-in user
 * POST /api/progress/gita        → save watched chapters array
 */
const express  = require('express');
const Progress = require('../models/Progress');
const { protect } = require('../middleware/authMiddleware');
const router   = express.Router();

const mockProgressDB = {}; // In-memory fallback

/* ── GET /api/progress/gita ── */
router.get('/gita', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const progress = mockProgressDB[userId];
    res.json({
      topic:           'gita',
      watchedChapters: progress ? progress.watchedChapters : [],
      total:           18,
    });
  } catch (err) {
    console.error('[Progress GET Mock]', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

/* ── POST /api/progress/gita ── saves full watchedChapters array ── */
router.post('/gita', protect, async (req, res) => {
  try {
    const { watchedChapters } = req.body;
    if (!Array.isArray(watchedChapters))
      return res.status(400).json({ message: 'watchedChapters must be an array.' });

    const userId = req.user._id;
    mockProgressDB[userId] = { watchedChapters, lastUpdated: new Date() };

    res.json({
      topic:           'gita',
      watchedChapters: mockProgressDB[userId].watchedChapters,
      total:           18,
    });
  } catch (err) {
    console.error('[Progress POST Mock]', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
