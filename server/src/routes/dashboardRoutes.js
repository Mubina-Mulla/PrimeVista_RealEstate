import { Router } from 'express'
import { getLiveStats } from '../controllers/dashboardController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

// All authorized staff (Super Admin, Admin, Agent) can view dashboard stats
router.get('/stats', authenticate, authorize('super_admin', 'admin', 'agent'), getLiveStats)

export default router
