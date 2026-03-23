/**
 * server.js — EDITED
 * Path: backend/server.js
 * Added: MongoDB connection, auth routes, progress routes, youtube routes
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

/* ── Existing routes (no change) ── */
const wisdomRouter = require('./routes/wisdom');
const personaRouter = require('./routes/persona');
const chatRouter = require('./routes/chat');
const quizRouter = require('./routes/quiz');

/* ── New routes ── */
const authRouter = require('./routes/auth');
const progressRouter = require('./routes/progress');
const youtubeRouter = require('./routes/youtube');

const app = express();
const PORT = process.env.PORT || 3001;

/* ── MongoDB (Commented out for mock login) ── */
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => {
//     console.error('❌ MongoDB failed:', err.message);
//     console.error('   Check MONGODB_URI in .env and Network Access in Atlas');
//     // Don't exit — let server run so frontend can still load
//   });

/* ── Middleware ── */
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000, max: 60,
  message: { error: 'Too many requests. Please wait.' }
});
app.use('/api', limiter);

/* ── Routes ── */
app.use('/api/wisdom', wisdomRouter);
app.use('/api/persona', personaRouter);
app.use('/api/chat', chatRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/auth', authRouter);
app.use('/api/progress', progressRouter);
app.use('/api/youtube', youtubeRouter);

/* ── Health check ── */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Gurukul Backend',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time: new Date(),
  });
});

/* ── Error handler ── */
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🪔 AI Gurukul Backend running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health\n`);
});