const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const localDb = require('../utils/localDb');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ai_interview_secret_key_token_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    let userExists = false;

    // Check if user already exists
    if (global.useLocalDB) {
      const existing = localDb.users.findOne({ email: email.toLowerCase() });
      if (existing) userExists = true;
    } else {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) userExists = true;
    }

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    let user;
    if (global.useLocalDB) {
      user = localDb.users.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'user',
        title: 'Software Engineer',
        bio: 'Passionate developer interested in building modern web applications and optimizing systems.',
        experienceLevel: 'Mid-Level',
        skills: ['React', 'Node.js', 'JavaScript']
      });
    } else {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'user',
        title: 'Software Engineer',
        bio: 'Passionate developer interested in building modern web applications and optimizing systems.',
        experienceLevel: 'Mid-Level',
        skills: ['React', 'Node.js', 'JavaScript']
      });
    }

    const userId = user._id || user.id;

    res.status(201).json({
      _id: userId,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title,
      bio: user.bio,
      experienceLevel: user.experienceLevel,
      skills: user.skills,
      token: generateToken(userId)
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server registration error', error: error.message });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }

  try {
    let user;

    // Find user
    if (global.useLocalDB) {
      user = localDb.users.findOne({ email: email.toLowerCase() });
    } else {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Incorrect password' });
    }

    const userId = user._id || user.id;

    res.json({
      _id: userId,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title || 'Software Engineer',
      bio: user.bio || 'Passionate developer interested in building modern web applications and optimizing systems.',
      experienceLevel: user.experienceLevel || 'Mid-Level',
      skills: user.skills || ['React', 'Node.js', 'JavaScript'],
      token: generateToken(userId)
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server login error', error: error.message });
  }
};

// @desc    Get user profile details
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Server profile fetch error', error: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const { name, title, bio, experienceLevel, skills } = req.body;

  try {
    let updatedUser;

    if (global.useLocalDB) {
      updatedUser = localDb.users.findByIdAndUpdate(req.user.id, {
        name: name || req.user.name,
        title: title !== undefined ? title : req.user.title,
        bio: bio !== undefined ? bio : req.user.bio,
        experienceLevel: experienceLevel !== undefined ? experienceLevel : req.user.experienceLevel,
        skills: skills !== undefined ? skills : req.user.skills
      });
    } else {
      updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            name: name || req.user.name,
            title: title !== undefined ? title : undefined,
            bio: bio !== undefined ? bio : undefined,
            experienceLevel: experienceLevel !== undefined ? experienceLevel : undefined,
            skills: skills !== undefined ? skills : undefined
          }
        },
        { new: true }
      ).select('-password');
    }

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: updatedUser._id || updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      title: updatedUser.title,
      bio: updatedUser.bio,
      experienceLevel: updatedUser.experienceLevel,
      skills: updatedUser.skills
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server profile update error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
