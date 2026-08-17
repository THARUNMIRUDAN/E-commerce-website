import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows / Node.js querySrv ECONNREFUSED issue with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore if not permitted
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/revibe');
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
