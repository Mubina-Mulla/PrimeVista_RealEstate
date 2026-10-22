import { Property } from '../models/Property.js'
import { Inquiry } from '../models/Inquiry.js'
import { Agent } from '../models/Agent.js'

export async function getLiveStats(req, res, next) {
  try {
    const [
      totalProperties,
      publishedProperties,
      draftProperties,
      soldProperties,
      rentedProperties,
      totalInquiries,
      newInquiries,
      pendingFollowups,
      scheduledVisits,
      totalAgents,
    ] = await Promise.all([
      Property.countDocuments({ status: { $ne: 'archived' } }),
      Property.countDocuments({ status: 'published' }),
      Property.countDocuments({ status: 'draft' }),
      Property.countDocuments({ status: 'sold' }),
      Property.countDocuments({ status: 'rented' }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'New' }),
      Inquiry.countDocuments({
        followUpDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        status: { $nin: ['Converted', 'Closed-Lost'] },
      }),
      Inquiry.countDocuments({ status: 'Site Visit Scheduled' }),
      Agent.countDocuments({ active: true }),
    ])

    // Recent 5 inquiries
    const recentInquiries = await Inquiry.find()
      .populate('assignedAgent', 'name photo')
      .sort({ createdAt: -1 })
      .limit(5)

    // Recent 5 properties
    const recentProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title propertyId price locality city status coverImage purpose')

    return res.json({
      success: true,
      stats: {
        totalProperties,
        publishedProperties,
        draftProperties,
        soldAndRentedProperties: soldProperties + rentedProperties,
        soldProperties,
        rentedProperties,
        totalInquiries,
        newInquiries,
        pendingFollowups,
        scheduledVisits,
        totalAgents,
      },
      recentInquiries,
      recentProperties,
    })
  } catch (error) {
    next(error)
  }
}
