import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/primevista'
    const conn = await mongoose.connect(mongoUri)
    console.log(`✅ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`)
    return conn
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    // Do not terminate process immediately in development so health check remains responsive
    return null
  }
}
