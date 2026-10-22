import { Router } from 'express'
import {
  login,
  getCurrentUser,
  getAllUsers,
  createUser,
  toggleUserStatus,
  loginSchema,
  createUserSchema,
} from '../controllers/authController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { loginLimiter } from '../middleware/security.js'

const router = Router()

// Public login with rate limiter & schema validation
router.post('/login', loginLimiter, validateBody(loginSchema), login)

// Authenticated current user
router.get('/me', authenticate, getCurrentUser)

// Super Admin user management routes
router.get('/users', authenticate, authorize('super_admin'), getAllUsers)
router.post('/users', authenticate, authorize('super_admin'), validateBody(createUserSchema), createUser)
router.patch('/users/:id/toggle-status', authenticate, authorize('super_admin'), toggleUserStatus)

export default router
