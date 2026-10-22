import { z } from 'zod'
import { Inquiry } from '../models/Inquiry.js'
import { Property } from '../models/Property.js'
import { Agent } from '../models/Agent.js'

// Zod validation schema for public inquiry
export const inquirySubmissionSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(7, 'Please provide a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  propertyId: z.string().optional().nullable(),
  inquiryType: z.enum(['general', 'property_inquiry', 'site_visit']).default('property_inquiry'),
  preferredDate: z.string().optional().nullable(),
  preferredTime: z.string().optional().nullable(),
})

// Public: Submit customer inquiry
export async function submitInquiry(req, res, next) {
  try {
    const { customerName, phone, email, message, propertyId, inquiryType, preferredDate, preferredTime } = req.body

    let propertyDoc = null
    let propertyTitle = 'General Website Inquiry'
    let propIdCode = ''
    let autoAgent = null

    if (propertyId) {
      propertyDoc = await Property.findById(propertyId)
      if (propertyDoc) {
        propertyTitle = propertyDoc.title
        propIdCode = propertyDoc.propertyId
        if (propertyDoc.assignedAgent) {
          autoAgent = propertyDoc.assignedAgent
        }
      }
    }

    // Default agent assignment if none assigned to property
    if (!autoAgent) {
      const firstActiveAgent = await Agent.findOne({ active: true })
      if (firstActiveAgent) {
        autoAgent = firstActiveAgent._id
      }
    }

    const newInquiry = await Inquiry.create({
      customerName,
      phone,
      email: email.toLowerCase(),
      message,
      property: propertyDoc ? propertyDoc._id : null,
      propertyTitle,
      propertyId: propIdCode,
      inquiryType: inquiryType || 'property_inquiry',
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      preferredTime: preferredTime || '',
      status: 'New',
      assignedAgent: autoAgent,
      activityLog: [
        {
          action: 'Inquiry Created',
          performedBy: customerName,
          details: `Submitted inquiry from website (${inquiryType || 'general'})`,
          date: new Date(),
        },
      ],
      source: propertyDoc ? `Property Details [${propIdCode}]` : 'General Contact Form',
    })

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your inquiry has been submitted. Our property specialist will contact you shortly.',
      inquiryId: newInquiry._id,
    })
  } catch (error) {
    next(error)
  }
}

// Admin / Agent: Get Inquiries (Enforces Role-Based Visibility)
export async function getInquiries(req, res, next) {
  try {
    const { status, search, page = 1, limit = 20 } = req.query
    const filter = {}

    // Role-based scoping: Agents only see assigned inquiries unless Admin/Super Admin
    if (req.user.role === 'agent') {
      const agentProfile = await Agent.findOne({ userAccount: req.user.id })
      if (agentProfile) {
        filter.assignedAgent = agentProfile._id
      }
    }

    if (status && status !== 'all') {
      filter.status = status
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i')
      filter.$or = [
        { customerName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { propertyTitle: searchRegex },
        { propertyId: searchRegex },
      ]
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
    const skip = (pageNum - 1) * limitNum

    const [inquiries, totalCount] = await Promise.all([
      Inquiry.find(filter)
        .populate('assignedAgent', 'name photo role phone email')
        .populate('property', 'title price locality city propertyId coverImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Inquiry.countDocuments(filter),
    ])

    return res.json({
      success: true,
      data: inquiries,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    })
  } catch (error) {
    next(error)
  }
}

// Admin / Agent: Get Single Inquiry Details
export async function getInquiryById(req, res, next) {
  try {
    const { id } = req.params
    const inquiry = await Inquiry.findById(id)
      .populate('assignedAgent', 'name photo role phone email')
      .populate('property')

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry record not found' })
    }

    // Agent access check
    if (req.user.role === 'agent') {
      const agentProfile = await Agent.findOne({ userAccount: req.user.id })
      if (agentProfile && inquiry.assignedAgent?.toString() !== agentProfile._id.toString()) {
        return res.status(403).json({ success: false, message: 'You are not assigned to this inquiry.' })
      }
    }

    return res.json({ success: true, data: inquiry })
  } catch (error) {
    next(error)
  }
}

// Admin / Agent: Update Inquiry Status
export async function updateInquiryStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status, note } = req.body

    const validStatuses = [
      'New',
      'Contacted',
      'Qualified',
      'Site Visit Scheduled',
      'Negotiation',
      'Converted',
      'Closed-Lost',
    ]

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid inquiry status' })
    }

    const inquiry = await Inquiry.findById(id)
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' })
    }

    const oldStatus = inquiry.status
    inquiry.status = status
    inquiry.activityLog.push({
      action: 'Status Changed',
      performedBy: req.user.name,
      details: `Status updated from '${oldStatus}' to '${status}'${note ? `. Note: ${note}` : ''}`,
      date: new Date(),
    })

    if (note) {
      inquiry.internalNotes = inquiry.internalNotes
        ? `${inquiry.internalNotes}\n[${new Date().toLocaleDateString()}] ${req.user.name}: ${note}`
        : `[${new Date().toLocaleDateString()}] ${req.user.name}: ${note}`
    }

    await inquiry.save()

    return res.json({
      success: true,
      message: `Inquiry status changed to ${status}`,
      data: inquiry,
    })
  } catch (error) {
    next(error)
  }
}

// Admin / Super Admin: Assign Agent to Inquiry
export async function assignAgent(req, res, next) {
  try {
    const { id } = req.params
    const { agentId } = req.body

    const inquiry = await Inquiry.findById(id)
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' })
    }

    const agent = await Agent.findById(agentId)
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' })
    }

    inquiry.assignedAgent = agent._id
    inquiry.activityLog.push({
      action: 'Agent Assigned',
      performedBy: req.user.name,
      details: `Inquiry assigned to ${agent.name}`,
      date: new Date(),
    })

    await inquiry.save()

    return res.json({
      success: true,
      message: `Inquiry assigned to ${agent.name}`,
      data: inquiry,
    })
  } catch (error) {
    next(error)
  }
}

// Admin / Agent: Update Follow-up date or add note
export async function updateFollowUp(req, res, next) {
  try {
    const { id } = req.params
    const { followUpDate, notes } = req.body

    const inquiry = await Inquiry.findById(id)
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' })
    }

    if (followUpDate) {
      inquiry.followUpDate = new Date(followUpDate)
      inquiry.activityLog.push({
        action: 'Follow-up Scheduled',
        performedBy: req.user.name,
        details: `Follow-up set for ${new Date(followUpDate).toLocaleString()}`,
        date: new Date(),
      })
    }

    if (notes) {
      inquiry.internalNotes = inquiry.internalNotes
        ? `${inquiry.internalNotes}\n[${new Date().toLocaleDateString()}] ${req.user.name}: ${notes}`
        : `[${new Date().toLocaleDateString()}] ${req.user.name}: ${notes}`
      
      inquiry.activityLog.push({
        action: 'Internal Note Added',
        performedBy: req.user.name,
        details: notes,
        date: new Date(),
      })
    }

    await inquiry.save()

    return res.json({
      success: true,
      message: 'Follow-up details updated successfully',
      data: inquiry,
    })
  } catch (error) {
    next(error)
  }
}
