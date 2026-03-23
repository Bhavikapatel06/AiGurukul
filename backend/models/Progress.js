/**
 * models/Progress.js — NEW FILE
 * Path: backend/models/Progress.js
 * Stores which Gita chapters user has watched
 */
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic:           { type: String, default: 'gita', enum: ['gita','panchatantra','ayurveda','arthashastra'] },
  watchedChapters: { type: [Number], default: [] },   // e.g. [1, 3, 5, 7]
  lastUpdated:     { type: Date, default: Date.now },
}, { timestamps: true });

progressSchema.index({ userId: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
