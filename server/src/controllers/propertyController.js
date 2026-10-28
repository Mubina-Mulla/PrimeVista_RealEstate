import { z } from 'zod'
import { Property } from '../models/Property.js'
import { slugify } from '../utils/slugify.js'
import { generatePropertyId } from '../utils/generateId.js'

// Property validation schema
export const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  purpose: z.enum(['Buy', 'Rent', 'For Sale', 'For Rent']).default('Buy'),
  category: z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Shop', 'Penthouse']),
  price: z.coerce.number().positive('Price must be greater than zero'),
  rentalPeriod: z.string().optional().default('month'),
  address: z.string().optional().default(''),
  locality: z.string().min(2, 'Locality is required'),
  city: z.string().min(2, 'City is required'),
  bedrooms: z.coerce.number().min(0).default(0),
  bathrooms: z.coerce.number().min(0).default(0),
  floor: z.string().optional().default('Ground Floor'),
  area: z.coerce.number().positive('Area in Sq. Ft. is required'),
  amenities: z.array(z.string()).default([]),
  description: z.string().min(10, 'Detailed description is required'),
  coverImage: z.string().url('Cover image must be a valid URL'),
  images: z.array(z.string().url()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'sold', 'rented', 'archived']).default('published'),
  seoTitle: z.string().optional().default(''),
  metaDescription: z.string().optional().default(''),
  assignedAgent: z.string().optional().nullable().default(null),
})

// Public: Get published properties with search, filter, and pagination
export async function getPublicProperties(req, res, next) {
  try {
    const {
      purpose,
      category,
      location,
      minPrice,
      maxPrice,
      bedrooms,
      sort = 'newest',
      page = 1,
      limit = 9,
    } = req.query

    // Only published properties are visible to the public
    const filter = {
      status: { $in: ['published', 'sold', 'rented'] },
    }

    if (purpose && purpose !== 'Any' && purpose !== 'all') {
      if (purpose === 'Buy') {
        filter.purpose = { $in: ['Buy', 'For Sale'] }
      } else if (purpose === 'Rent') {
        filter.purpose = { $in: ['Rent', 'For Rent'] }
      } else {
        filter.purpose = purpose
      }
    }

    if (category && category !== 'Any property' && category !== 'all') {
      filter.category = category
    }

    if (location && location.trim() !== '') {
      const locRegex = new RegExp(location.trim(), 'i')
      filter.$or = [
        { locality: locRegex },
        { city: locRegex },
        { address: locRegex },
        { title: locRegex },
        { propertyId: locRegex },
      ]
    }

    if (bedrooms && bedrooms !== 'Any') {
      const beds = parseInt(bedrooms, 10)
      if (!isNaN(beds)) {
        filter.bedrooms = beds >= 4 ? { $gte: 4 } : beds
      }
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    // Sorting
    let sortOptions = { createdAt: -1 }
    if (sort === 'price-asc') sortOptions = { price: 1 }
    if (sort === 'price-desc') sortOptions = { price: -1 }
    if (sort === 'featured') sortOptions = { featured: -1, createdAt: -1 }

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 9))
    const skip = (pageNum - 1) * limitNum

    const [properties, totalCount] = await Promise.all([
      Property.find(filter)
        .populate('assignedAgent', 'name photo role phone email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Property.countDocuments(filter),
    ])

    return res.json({
      success: true,
      data: properties,
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

// Public: Get Featured Properties for Homepage
export async function getFeaturedProperties(req, res, next) {
  try {
    const featured = await Property.find({
      status: 'published',
      featured: true,
    })
      .populate('assignedAgent', 'name photo role phone email')
      .sort({ createdAt: -1 })
      .limit(6)

    return res.json({ success: true, data: featured })
  } catch (error) {
    next(error)
  }
}

// Public: Get Property by Slug or Unique Property ID (e.g. PV-101)
export async function getPropertyBySlugOrId(req, res, next) {
  try {
    const { identifier } = req.params

    const property = await Property.findOne({
      $or: [{ slug: identifier }, { propertyId: identifier.toUpperCase() }],
      status: { $in: ['published', 'sold', 'rented'] },
    }).populate('assignedAgent', 'name photo role phone email description experience')

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or is no longer listed.',
      })
    }

    return res.json({ success: true, data: property })
  } catch (error) {
    next(error)
  }
}

// Admin: Get all properties including draft and archived
export async function adminGetAllProperties(req, res, next) {
  try {
    const { status, category, purpose, search, page = 1, limit = 20 } = req.query
    const filter = {}

    if (status && status !== 'all') filter.status = status
    if (category && category !== 'all') filter.category = category
    if (purpose && purpose !== 'all') filter.purpose = purpose
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i')
      filter.$or = [
        { title: searchRegex },
        { propertyId: searchRegex },
        { locality: searchRegex },
        { city: searchRegex },
      ]
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
    const skip = (pageNum - 1) * limitNum

    const [properties, totalCount] = await Promise.all([
      Property.find(filter)
        .populate('assignedAgent', 'name')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Property.countDocuments(filter),
    ])

    return res.json({
      success: true,
      data: properties,
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

// Admin: Create New Property
export async function createProperty(req, res, next) {
  try {
    const data = req.body

    // Generate unique property ID if not provided
    let propertyId = data.propertyId
    if (!propertyId) {
      propertyId = generatePropertyId()
      while (await Property.findOne({ propertyId })) {
        propertyId = generatePropertyId()
      }
    }

    // Generate unique slug
    let baseSlug = slugify(data.title)
    let slug = baseSlug
    let counter = 1
    while (await Property.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const newProperty = await Property.create({
      ...data,
      propertyId,
      slug,
      createdBy: req.user.id,
    })

    return res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: newProperty,
    })
  } catch (error) {
    next(error)
  }
}

// Admin: Update Property
export async function updateProperty(req, res, next) {
  try {
    const { id } = req.params
    const property = await Property.findById(id)

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' })
    }

    // If title changed, update slug
    if (req.body.title && req.body.title !== property.title) {
      let baseSlug = slugify(req.body.title)
      let slug = baseSlug
      let counter = 1
      while (await Property.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
      req.body.slug = slug
    }

    const updated = await Property.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true })

    return res.json({
      success: true,
      message: 'Property updated successfully',
      data: updated,
    })
  } catch (error) {
    next(error)
  }
}

// Admin: Update Property Status (publish, unpublish, sold, rented, archive)
export async function updatePropertyStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['draft', 'published', 'sold', 'rented', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status supplied' })
    }

    const property = await Property.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    )

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' })
    }

    return res.json({
      success: true,
      message: `Property status updated to '${status}'`,
      data: property,
    })
  } catch (error) {
    next(error)
  }
}

// Admin: Delete Property (permanently or archive)
export async function deleteProperty(req, res, next) {
  try {
    const { id } = req.params
    const property = await Property.findByIdAndDelete(id)

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' })
    }

    return res.json({
      success: true,
      message: `Property ${property.propertyId} was deleted successfully`,
    })
  } catch (error) {
    next(error)
  }
}
