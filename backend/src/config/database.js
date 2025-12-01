const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/bioptrics-lms-local';
    
    console.log('🔌 Connecting to MongoDB...');
    console.log(`📍 URL: ${mongoUrl.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs
    
    const conn = await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Safety check - ensure we're using LMS database
    const dbName = conn.connection.name;
    if (dbName.includes('bioptrics-demo') || (dbName.includes('bioptrics') && !dbName.includes('lms'))) {
      console.error('❌ ERROR: Connected to survey database! Expected LMS database.');
      console.error(`❌ Current database: ${dbName}`);
      console.error(`✅ Expected database: bioptrics-lms or bioptrics-lms-local`);
      await mongoose.disconnect();
      process.exit(1);
    }
    
    console.log(`✅ Confirmed: Connected to LMS database (${dbName})`);
    
    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('📴 MongoDB disconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📴 MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
