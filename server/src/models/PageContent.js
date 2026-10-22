import mongoose from 'mongoose'

const pageContentSchema = new mongoose.Schema(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    sections: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    visibilitySettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

export const PageContent = mongoose.model('PageContent', pageContentSchema)
