import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: ['Buy', 'Rent', 'For Sale', 'For Rent'],
      default: 'Buy',
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Apartment', 'Villa', 'Plot', 'Office', 'Shop', 'Penthouse'],
      default: 'Apartment',
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
      index: true,
    },
    rentalPeriod: {
      type: String,
      enum: ['month', 'year', ''],
      default: 'month',
    },
    address: {
      type: String,
      default: '',
    },
    locality: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    floor: {
      type: String,
      default: '1st Floor',
    },
    area: {
      type: Number, // In Sq. Ft.
      required: [true, 'Area in Sq. Ft. is required'],
      min: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image URL is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'sold', 'rented', 'archived'],
      default: 'published',
      index: true,
    },
    seoTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Compound search index for high-speed queries on title, locality, city, category
propertySchema.index({ title: 'text', locality: 'text', city: 'text' })

export const Property = mongoose.model('Property', propertySchema)
