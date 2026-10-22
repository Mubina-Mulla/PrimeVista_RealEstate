import { Router } from 'express'
import {
  submitInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  assignAgent,
  updateFollowUp,
  inquirySubmissionSchema,
} from '../controllers/inquiryController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { inquiryLimiter } from '../middleware/security.js'

const router = Router()

// Public endpoint for submitting inquiry or scheduling site visit
router.post('/', inquiryLimiter, validateBody(inquirySubmissionSchema), submitInquiry)

// Staff protected endpoints
router.get('/', authenticate, authorize('super_admin', 'admin', 'agent'), getInquiries)
router.get('/:id', authenticate, authorize('super_admin', 'admin', 'agent'), getInquiryById)
router.patch('/:id/status', authenticate, authorize('super_admin', 'admin', 'agent'), updateInquiryStatus)
router.patch('/:id/assign', authenticate, authorize('super_admin', 'admin'), assignAgent)
router.patch('/:id/follow-up', authenticate, authorize('super_admin', 'admin', 'agent'), updateFollowUp)

export default router
