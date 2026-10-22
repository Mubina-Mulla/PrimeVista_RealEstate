import { Agent } from '../models/Agent.js'
import { Property } from '../models/Property.js'
import { z } from 'zod'

export const agentSchema = z.object({
  name: z.string().min(2, 'Agent name is required'),
  role: z.string().min(2, 'Role/Designation is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Phone number is required'),
  photo: z.string().url('Photo must be a valid URL').optional(),
  description: z.string().optional(),
  experience: z.string().optional(),
  active: z.boolean().default(true),
})

// Public: Get Active Agents
export async function getPublicAgents(req, res, next) {
  try {
    const agents = await Agent.find({ active: true }).sort({ createdAt: 1 })
    
    // Attach current count of published properties for each agent
    const enrichedAgents = await Promise.all(
      agents.map(async (agent) => {
        const count = await Property.countDocuments({
          assignedAgent: agent._id,
          status: 'published',
        })
        return {
          ...agent.toObject(),
          propertiesListed: count,
        }
      })
    )

    return res.json({ success: true, data: enrichedAgents })
  } catch (error) {
    next(error)
  }
}

// Admin: Get All Agents
export async function adminGetAllAgents(req, res, next) {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 })
    return res.json({ success: true, data: agents })
  } catch (error) {
    next(error)
  }
}

// Admin: Create Agent
export async function createAgent(req, res, next) {
  try {
    const newAgent = await Agent.create(req.body)
    return res.status(201).json({
      success: true,
      message: 'Agent created successfully',
      data: newAgent,
    })
  } catch (error) {
    next(error)
  }
}

// Admin: Update Agent
export async function updateAgent(req, res, next) {
  try {
    const { id } = req.params
    const updated = await Agent.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Agent not found' })
    }
    return res.json({
      success: true,
      message: 'Agent updated successfully',
      data: updated,
    })
  } catch (error) {
    next(error)
  }
}

// Admin: Delete Agent
export async function deleteAgent(req, res, next) {
  try {
    const { id } = req.params
    const agent = await Agent.findByIdAndDelete(id)
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' })
    }
    return res.json({
      success: true,
      message: 'Agent deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
