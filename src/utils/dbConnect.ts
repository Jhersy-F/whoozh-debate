// utils/dbConnect.ts
import mongoose from 'mongoose';

const MONGODB_URI = String(process.env.MONGODB_URI) ;

mongoose.set('strictQuery', false);

async function dbConnect() {
  
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(MONGODB_URI, {

  });
}

export default dbConnect;