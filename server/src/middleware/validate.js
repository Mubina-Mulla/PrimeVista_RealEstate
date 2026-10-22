export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const errorList = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }))
      return res.status(400).json({
        success: false,
        message: 'Validation failed for request parameters',
        errors: errorList,
      })
    }
    req.validatedBody = result.data
    next()
  }
}
