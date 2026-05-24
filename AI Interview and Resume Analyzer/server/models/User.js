const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  title: {
    type: String,
    default: 'Software Engineer',
    trim: true
  },
  bio: {
    type: String,
    default: 'Passionate developer interested in building modern web applications and optimizing systems.',
    trim: true
  },
  experienceLevel: {
    type: String,
    default: 'Mid-Level',
    enum: ['Entry-Level', 'Mid-Level', 'Senior-Level']
  },
  skills: {
    type: [String],
    default: ['React', 'Node.js', 'JavaScript']
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
