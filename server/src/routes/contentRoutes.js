import { Router } from 'express'
import { getPageContent, updatePageContent } from '../controllers/contentController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

// Public: Retrieve page sections and SEO settings
router.get('/:pageKey', getPageContent)

// Admin: Update page content without rebuilding or redeploying code
router.put('/:pageKey', authenticate, authorize('super_admin', 'admin'), updatePageContent)

export default router
