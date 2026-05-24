const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri.trim() === '' || mongoUri.includes('your_mongodb_connection')) {
    console.log('⚠️  No MONGO_URI provided in environment variables.');
    console.log('⚡  AI Interview & Resume Analyzer will run in LOCAL OFFLINE-FALLBACK mode.');
    console.log('📂  All data (users, resumes, interviews) will be safely persisted in: server/data/local_db.json');
    global.useLocalDB = true;
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected successfully to host: ${conn.connection.host}`);
    global.useLocalDB = false;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.log('⚡ Falling back to LOCAL OFFLINE-FALLBACK mode (server/data/local_db.json)...');
    global.useLocalDB = true;
  }
};

module.exports = connectDB;
