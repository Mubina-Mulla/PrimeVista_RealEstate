import mongoose from 'mongoose'

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Agent name is required'],
      trim: true,
    },
    photo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    },
    role: {
      type: String,
      required: [true, 'Agent role or title is required'],
      default: 'Senior Property Advisor',
    },
    email: {
      type: String,
      required: [true, 'Agent email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Agent phone number is required'],
      trim: true,
    },
    description: {
      type: String,
      default: 'Specializing in residential, luxury villas, and commercial property investments.',
    },
    experience: {
      type: String,
      default: '7+ Years Experience',
    },
    propertiesListed: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    userAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

export const Agent = mongoose.model('Agent', agentSchema)
