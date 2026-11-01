/**
 * Form Validation Utilities for PrimeVista Real Estate
 */

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false
  return EMAIL_REGEX.test(email.trim())
}

export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false
  // Strip non-digits
  const digitsOnly = phone.replace(/\D/g, '')
  // Standard phone numbers require at least 10 digits
  return digitsOnly.length >= 10 && digitsOnly.length <= 15
}

export function isValidPositiveNumber(val) {
  if (val === '' || val === null || val === undefined) return false
  const num = Number(val)
  return !isNaN(num) && num > 0
}

export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false
  try {
    const parsed = new URL(url.trim())
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' || url.startsWith('data:image/')
  } catch {
    return url.startsWith('data:image/') || url.startsWith('/')
  }
}
