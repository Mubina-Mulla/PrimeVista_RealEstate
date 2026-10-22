import { Router } from 'express'
import {
  getPublicAgents,
  adminGetAllAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  agentSchema,
} from '../controllers/agentController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'

const router = Router()

// Public endpoint
router.get('/', getPublicAgents)

// Admin management endpoints
router.get('/admin/all', authenticate, authorize('super_admin', 'admin'), adminGetAllAgents)
router.post('/', authenticate, authorize('super_admin', 'admin'), validateBody(agentSchema), createAgent)
router.put('/:id', authenticate, authorize('super_admin', 'admin'), validateBody(agentSchema), updateAgent)
router.delete('/:id', authenticate, authorize('super_admin', 'admin'), deleteAgent)

export default router
