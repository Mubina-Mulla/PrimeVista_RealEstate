import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { User } from '../models/User.js'

// Validation Schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['super_admin', 'admin', 'agent']).default('admin'),
})

function generateToken(user) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET must be configured in environment variables.')
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    },
    secret,
    { algorithm: 'HS256', expiresIn }
  )
}

// User Login Controller
export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials provided.',
      })
    }

    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Contact Super Admin.',
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials provided.',
      })
    }

    const token = generateToken(user)

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get Current Logged-in User Profile
export async function getCurrentUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    return res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

// Super Admin: List All Users
export async function getAllUsers(req, res, next) {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 })
    return res.json({ success: true, users, data: users })
  } catch (error) {
    next(error)
  }
}

// Super Admin: Create New Staff User
export async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'admin',
      active: true,
    })

    return res.status(201).json({
      success: true,
      message: 'Staff user created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        active: newUser.active,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Super Admin: Toggle Active Status
export async function toggleUserStatus(req, res, next) {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Prevent deactivating oneself
    if (req.user.id === user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot deactivate your own account.' })
    }

    user.active = !user.active
    await user.save()

    return res.json({
      success: true,
      message: `User ${user.active ? 'activated' : 'deactivated'} successfully`,
      user: { id: user._id, active: user.active },
    })
  } catch (error) {
    next(error)
  }
}
