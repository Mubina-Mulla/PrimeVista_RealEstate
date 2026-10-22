import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    performedBy: { type: String, default: 'System' },
    details: { type: String, default: '' },
    date: { type: Date, default: Date.now },
  },
  { _id: true }
)

const inquirySchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: [true, 'Message or inquiry details are required'],
      trim: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      default: null,
    },
    propertyTitle: {
      type: String,
      default: 'General Property Inquiry',
    },
    propertyId: {
      type: String,
      default: '',
    },
    inquiryType: {
      type: String,
      enum: ['general', 'property_inquiry', 'site_visit'],
      default: 'property_inquiry',
    },
    preferredDate: {
      type: Date,
      default: null,
    },
    preferredTime: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'New',
        'Contacted',
        'Qualified',
        'Site Visit Scheduled',
        'Negotiation',
        'Converted',
        'Closed-Lost',
      ],
      default: 'New',
      index: true,
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      default: null,
      index: true,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    internalNotes: {
      type: String,
      default: '',
    },
    activityLog: {
      type: [activityLogSchema],
      default: [],
    },
    source: {
      type: String,
      default: 'Website Direct',
    },
  },
  {
    timestamps: true,
  }
)

export const Inquiry = mongoose.model('Inquiry', inquirySchema)
