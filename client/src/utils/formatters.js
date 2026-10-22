// Format price into Indian Numbering / Lakhs / Crores
export function formatPrice(price, purpose = 'Buy', rentalPeriod = 'month') {
  if (price === undefined || price === null || isNaN(price)) return '₹ --'

  const num = Number(price)

  // For rent: e.g. ₹65,000 / month
  if (purpose === 'Rent' || purpose === 'For Rent') {
    return `₹${num.toLocaleString('en-IN')}${rentalPeriod ? ` / ${rentalPeriod}` : ''}`
  }

  // For buy: format in Crores or Lakhs
  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2).replace(/\.00$/, '')
    return `₹${cr} Crore`
  } else if (num >= 100000) {
    const lk = (num / 100000).toFixed(2).replace(/\.00$/, '')
    return `₹${lk} Lakh`
  }

  return `₹${num.toLocaleString('en-IN')}`
}

// Format full currency string: e.g. ₹ 1,25,00,000
export function formatFullCurrency(price) {
  if (!price && price !== 0) return '₹0'
  return `₹${Number(price).toLocaleString('en-IN')}`
}

// Format Date nicely
export function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Status Badges Colors for Properties
export const PROPERTY_STATUS_COLORS = {
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft: 'bg-amber-50 text-amber-700 border-amber-200',
  sold: 'bg-rose-50 text-rose-700 border-rose-200',
  rented: 'bg-blue-50 text-blue-700 border-blue-200',
  archived: 'bg-gray-100 text-gray-600 border-gray-200',
}

// Status Badges Colors for Inquiries
export const INQUIRY_STATUS_COLORS = {
  New: 'bg-blue-50 text-blue-700 border-blue-200',
  Contacted: 'bg-purple-50 text-purple-700 border-purple-200',
  Qualified: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Site Visit Scheduled': 'bg-amber-50 text-amber-700 border-amber-200',
  Negotiation: 'bg-orange-50 text-orange-700 border-orange-200',
  Converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Closed-Lost': 'bg-gray-100 text-gray-500 border-gray-200',
}
