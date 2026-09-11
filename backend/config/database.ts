import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coffee-management'
    );
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
  }
};
