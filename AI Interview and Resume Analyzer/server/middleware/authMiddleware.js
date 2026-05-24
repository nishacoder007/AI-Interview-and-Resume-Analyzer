const jwt = require('jsonwebtoken');
const User = require('../models/User');
const localDb = require('../utils/localDb');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ai_interview_secret_key_token_2026');

      // Get user from database (MongoDB vs Local fallback)
      if (global.useLocalDB) {
        const localUser = localDb.users.findById(decoded.id);
        if (!localUser) {
          return res.status(401).json({ message: 'Not authorized, local user not found' });
        }
        req.user = {
          id: localUser._id || localUser.id,
          name: localUser.name,
          email: localUser.email,
          role: localUser.role,
          title: localUser.title || 'Software Engineer',
          bio: localUser.bio || 'Passionate developer interested in building modern web applications and optimizing systems.',
          experienceLevel: localUser.experienceLevel || 'Mid-Level',
          skills: localUser.skills || ['React', 'Node.js', 'JavaScript']
        };
      } else {
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        req.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          title: user.title,
          bio: user.bio,
          experienceLevel: user.experienceLevel,
          skills: user.skills
        };
      }

      next();
    } catch (error) {
      console.error('Auth middleware token validation error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
