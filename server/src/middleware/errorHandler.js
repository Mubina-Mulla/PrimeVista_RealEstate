export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.method} ${req.originalUrl}`,
  })
}

export function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.stack || err.message)

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
    })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message)
    return res.status(400).json({
      success: false,
      message: 'Database Validation Error',
      errors: messages,
    })
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Resource not found with invalid identifier format: ${err.value}`,
    })
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error occurred.',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}
