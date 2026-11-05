/**
 * Comprehensive Form Validation Utilities for PrimeVista Real Estate
 */

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Validates a person's name (letters, spaces, hyphens, periods, apostrophes; NO numbers)
export const NAME_REGEX = /^[a-zA-Z\s.'’-]+$/

/**
 * Validates full name and returns specific user-friendly error message, or null if valid.
 */
export function validateName(name, fieldLabel = 'Full name') {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return `${fieldLabel} is required`
  }
  const trimmed = name.trim()
  if (/\d/.test(trimmed)) {
    return `${fieldLabel} cannot contain numbers`
  }
  if (!NAME_REGEX.test(trimmed)) {
    return `${fieldLabel} can only contain letters, spaces, and hyphens`
  }
  const letterCount = (trimmed.match(/[a-zA-Z]/g) || []).length
  if (letterCount < 2) {
    return `${fieldLabel} must contain at least 2 letters`
  }
  if (trimmed.length > 60) {
    return `${fieldLabel} cannot exceed 60 characters`
  }
  return null
}

export function isValidName(name) {
  return validateName(name) === null
}

/**
 * Validates phone number and returns specific error message, or null if valid.
 */
export function validatePhone(phone, fieldLabel = 'Phone number') {
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return `${fieldLabel} is required`
  }
  const trimmed = phone.trim()
  if (/[a-zA-Z]/.test(trimmed)) {
    return `${fieldLabel} cannot contain letters`
  }
  const digitsOnly = trimmed.replace(/\D/g, '')
  if (digitsOnly.length < 10) {
    return `${fieldLabel} must be at least 10 digits`
  }
  if (digitsOnly.length > 15) {
    return `${fieldLabel} cannot exceed 15 digits`
  }
  return null
}

export function isValidPhone(phone) {
  return validatePhone(phone) === null
}

/**
 * Validates email address and returns specific error message, or null if valid.
 */
export function validateEmail(email, fieldLabel = 'Email address') {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return `${fieldLabel} is required`
  }
  const trimmed = email.trim()
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a valid email address (e.g. name@example.com)'
  }
  return null
}

export function isValidEmail(email) {
  return validateEmail(email) === null
}

/**
 * Validates message length and content
 */
export function validateMessage(message, minLength = 10, fieldLabel = 'Message') {
  if (!message || typeof message !== 'string' || !message.trim()) {
    return `${fieldLabel} is required`
  }
  const trimmed = message.trim()
  if (trimmed.length < minLength) {
    return `${fieldLabel} must be at least ${minLength} characters`
  }
  return null
}

/**
 * Validates positive number
 */
export function validatePositiveNumber(val, fieldLabel = 'Value') {
  if (val === '' || val === null || val === undefined) {
    return `${fieldLabel} is required`
  }
  const num = Number(val)
  if (isNaN(num)) {
    return `${fieldLabel} must be a valid number`
  }
  if (num <= 0) {
    return `${fieldLabel} must be greater than 0`
  }
  return null
}

export function isValidPositiveNumber(val) {
  return validatePositiveNumber(val) === null
}

/**
 * Validates date is not in the past
 */
export function validateFutureOrTodayDate(dateStr, fieldLabel = 'Date') {
  if (!dateStr) {
    return `${fieldLabel} is required`
  }
  const chosen = new Date(dateStr)
  if (isNaN(chosen.getTime())) {
    return `Please enter a valid ${fieldLabel.toLowerCase()}`
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (chosen < today) {
    return `${fieldLabel} cannot be in the past`
  }
  return null
}

/**
 * Validates URL
 */
export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false
  try {
    const parsed = new URL(url.trim())
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' || url.startsWith('data:image/')
  } catch {
    return url.startsWith('data:image/') || url.startsWith('/')
  }
}
