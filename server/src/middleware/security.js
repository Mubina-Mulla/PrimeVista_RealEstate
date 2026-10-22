import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

// Security headers with Helmet
export const securityHeaders = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
})

// CORS origin handler
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())

export const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, server-to-server) or listed origins
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      return callback(null, true)
    }
    return callback(new Error('Origin not allowed by CORS security policy'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

// General API Rate Limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 500, // Limit each IP to 500 requests per 15 min
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again shortly.',
  },
})

// Rate limiter for Login endpoint (brute-force defense)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15, // Limit 15 login attempts per window
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 15 minutes before trying again.',
  },
})

// Rate limiter for Customer Inquiry submissions (anti-spam defense)
export const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20, // 20 inquiries per 15 min per IP
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many inquiry submissions. Please contact us directly or wait a few minutes.',
  },
})
