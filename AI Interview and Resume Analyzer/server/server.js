require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Initialize express application
const app = express();

// Database dynamic connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve parsed uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/interview', require('./routes/interviewRoutes'));

// Server heartbeat root route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'AI Interview & Resume Analyzer Platform API is active',
    mode: global.useLocalDB ? 'Local Offline Fallback Mode' : 'MERN Database Mode'
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Server Error Captured:', err.stack || err.message);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Boot listening server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server successfully booted and listening on port: ${PORT}`);
  console.log(`📡 Base API address: http://localhost:${PORT}`);
});
