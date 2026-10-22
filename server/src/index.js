import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import { securityHeaders, corsOptions, generalLimiter } from './middleware/security.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'

// Import route modules
import authRoutes from './routes/authRoutes.js'
import propertyRoutes from './routes/propertyRoutes.js'
import inquiryRoutes from './routes/inquiryRoutes.js'
import agentRoutes from './routes/agentRoutes.js'
import contentRoutes from './routes/contentRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// 1. Security & Hardening Middleware
app.disable('x-powered-by')
app.use(securityHeaders)
app.use(cors(corsOptions))
app.use(generalLimiter)
app.use(express.json({ limit: '50kb' }))
app.use(express.urlencoded({ extended: true, limit: '50kb' }))

// 2. Health Check API
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }

  res.json({
    success: true,
    message: 'PrimeVista Real Estate API is operational',
    timestamp: new Date().toISOString(),
    database: stateMap[dbState] || 'unknown',
    version: '1.0.0',
    brand: 'PrimeVista Real Estate',
  })
})

// 3. Mount API Routes
app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/agents', agentRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/dashboard', dashboardRoutes)

// 4. Centralized Error Handlers
app.use(notFoundHandler)
app.use(errorHandler)

// 5. Connect Database and Start Server
async function startServer() {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`🚀 PrimeVista Server running on http://localhost:${PORT}`)
    console.log(`🛡️  API Security, Helmet & Rate Limiting initialized`)
  })
}

startServer()

export default app
