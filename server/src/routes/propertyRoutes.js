import { Router } from 'express'
import {
  getPublicProperties,
  getFeaturedProperties,
  getPropertyBySlugOrId,
  adminGetAllProperties,
  createProperty,
  updateProperty,
  updatePropertyStatus,
  deleteProperty,
  propertySchema,
} from '../controllers/propertyController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'

const router = Router()

// Public endpoints
router.get('/', getPublicProperties)
router.get('/featured', getFeaturedProperties)
router.get('/detail/:identifier', getPropertyBySlugOrId)

// Admin management endpoints
router.get('/admin/all', authenticate, authorize('super_admin', 'admin', 'agent'), adminGetAllProperties)
router.post('/', authenticate, authorize('super_admin', 'admin'), validateBody(propertySchema), createProperty)
router.put('/:id', authenticate, authorize('super_admin', 'admin'), validateBody(propertySchema), updateProperty)
router.patch('/:id/status', authenticate, authorize('super_admin', 'admin'), updatePropertyStatus)
router.delete('/:id', authenticate, authorize('super_admin', 'admin'), deleteProperty)

export default router
