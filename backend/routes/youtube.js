/**
 * routes/youtube.js — NEW FILE
 * Path: backend/routes/youtube.js
 *
 * GET /api/youtube/:adhyay  → returns videos for that Gita chapter (1-18)
 */
const express = require('express');
const { fetchAdhyayVideos } = require('../utils/youtube');
const router  = express.Router();

router.get('/:adhyay', async (req, res) => {
  try {
    const adhyay = parseInt(req.params.adhyay);
    if (isNaN(adhyay) || adhyay < 1 || adhyay > 18)
      return res.status(400).json({ message: 'Adhyay must be 1–18.' });

    const videos = await fetchAdhyayVideos(adhyay);
    res.json({ adhyay, videos });
  } catch (err) {
    console.error('[YouTube]', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
