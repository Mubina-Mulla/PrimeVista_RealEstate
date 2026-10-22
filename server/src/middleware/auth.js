import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token required.',
    })
  }

  const token = authHeader.split(' ')[1]
  const secret = process.env.JWT_SECRET || 'primevista_super_secure_jwt_secret_key_2026_luxury_real_estate'

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] })
    
    // Validate user still exists and is active
    const user = await User.findById(decoded.id).select('-passwordHash')
    if (!user || !user.active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated or no longer exists.',
      })
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    }

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.',
    })
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before accessing this resource.',
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user.role}' lacks sufficient privileges for this action.`,
      })
    }

    next()
  }
}
