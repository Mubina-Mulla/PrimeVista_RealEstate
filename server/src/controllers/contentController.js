import { PageContent } from '../models/PageContent.js'

// Public: Get Page Content by pageKey
export async function getPageContent(req, res, next) {
  try {
    const { pageKey } = req.params
    let content = await PageContent.findOne({ pageKey })

    if (!content) {
      return res.status(404).json({
        success: false,
        message: `Content for page '${pageKey}' not found.`,
      })
    }

    return res.json({ success: true, data: content })
  } catch (error) {
    next(error)
  }
}

// Admin: Update Page Content
export async function updatePageContent(req, res, next) {
  try {
    const { pageKey } = req.params
    const { title, sections, visibilitySettings, seoTitle, seoDescription } = req.body

    const updated = await PageContent.findOneAndUpdate(
      { pageKey },
      {
        $set: {
          title,
          sections,
          visibilitySettings,
          seoTitle,
          seoDescription,
          updatedBy: req.user.id,
        },
      },
      { new: true, upsert: true }
    )

    return res.json({
      success: true,
      message: `Content for '${pageKey}' saved successfully`,
      data: updated,
    })
  } catch (error) {
    next(error)
  }
}
