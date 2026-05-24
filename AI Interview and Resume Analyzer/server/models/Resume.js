const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  resumeText: {
    type: String,
    default: ''
  },
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  missingSkills: {
    type: [String],
    default: []
  },
  suggestions: {
    type: [String],
    default: []
  },
  improvements: {
    type: [String],
    default: []
  },
  bestRoleSuggestions: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
