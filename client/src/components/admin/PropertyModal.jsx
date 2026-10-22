import React, { useState, useEffect } from 'react'
import { X, Sparkles, Building2, UploadCloud, CheckCircle2 } from 'lucide-react'
import { api } from '../../api/client.js'
import { useToast } from '../../context/ToastContext.jsx'

export function PropertyModal({ isOpen, onClose, property, onSaved, agents = [] }) {
  const { showToast } = useToast()
  const isEditing = !!property

  const initialForm = {
    title: '',
    purpose: 'Buy',
    category: 'Apartment',
    price: '',
    rentalPeriod: 'month',
    address: '',
    locality: '',
    city: 'Bengaluru',
    bedrooms: '3',
    bathrooms: '3',
    floor: '2nd of 14',
    area: '1850',
    amenities: '24/7 Security, Covered Parking, Power Backup, Swimming Pool, Gym',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    images: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    featured: false,
    status: 'published',
    seoTitle: '',
    metaDescription: '',
    assignedAgent: '',
  }

  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        purpose: property.purpose || 'Buy',
        category: property.category || 'Apartment',
        price: property.price || '',
        rentalPeriod: property.rentalPeriod || 'month',
        address: property.address || '',
        locality: property.locality || '',
        city: property.city || 'Bengaluru',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        floor: property.floor || '',
        area: property.area || '',
        amenities: Array.isArray(property.amenities) ? property.amenities.join(', ') : '',
        description: property.description || '',
        coverImage: property.coverImage || '',
        images: Array.isArray(property.images) ? property.images.join('\n') : '',
        featured: property.featured || false,
        status: property.status || 'published',
        seoTitle: property.seoTitle || '',
        metaDescription: property.metaDescription || '',
        assignedAgent: property.assignedAgent?._id || property.assignedAgent || '',
      })
    } else {
      setFormData(initialForm)
    }
  }, [property, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const amenitiesArray = formData.amenities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const imagesArray = formData.images
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)

      const payload = {
        title: formData.title.trim(),
        purpose: formData.purpose,
        category: formData.category,
        price: Number(formData.price),
        rentalPeriod: formData.rentalPeriod,
        address: formData.address.trim(),
        locality: formData.locality.trim(),
        city: formData.city.trim(),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        floor: formData.floor.trim(),
        area: Number(formData.area),
        amenities: amenitiesArray,
        description: formData.description.trim(),
        coverImage: formData.coverImage.trim(),
        images: imagesArray,
        featured: Boolean(formData.featured),
        status: formData.status,
        seoTitle: formData.seoTitle.trim(),
        metaDescription: formData.metaDescription.trim(),
        assignedAgent: formData.assignedAgent || null,
      }

      let res
      if (isEditing) {
        res = await api.put(`/properties/${property._id}`, payload)
        showToast('Property updated successfully!', 'success')
      } else {
        res = await api.post('/properties', payload)
        showToast('New property listing created!', 'success')
      }

      if (res.success) {
        onSaved()
        onClose()
      }
    } catch (err) {
      showToast(err.message || 'Failed to save property', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0F4C3A] text-white p-6 relative flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F4B740]">
              {isEditing ? `Edit Listing (${property.propertyId})` : 'New Property Entry'}
            </span>
            <h3 className="text-xl font-bold font-['Poppins']">
              {isEditing ? property.title : 'Add Property to Database'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Section 1: Core Info */}
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-3 font-['Poppins']">
              1. Basic Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-600 mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The Imperial Crest — Luxury 4BHK Sky Villa"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0F4C3A]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Listing Purpose *</label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0F4C3A]"
                >
                  <option value="Buy">For Sale (Buy)</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0F4C3A]"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Office">Commercial Office</option>
                  <option value="Shop">Retail Shop</option>
                  <option value="Plot">Villa Plot</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 25000000"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0F4C3A]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Publication Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#0F4C3A] focus:outline-none"
                >
                  <option value="published">Published (Live on Website)</option>
                  <option value="draft">Draft (Private, Not Visible)</option>
                  <option value="sold">Marked as SOLD</option>
                  <option value="rented">Marked as RENTED</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-bold text-gray-900 text-sm mb-3 font-['Poppins']">
              2. Location Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-600 mb-1">Locality *</label>
                <input
                  type="text"
                  required
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  placeholder="e.g. Indiranagar, Worli"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0F4C3A]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Bengaluru, Mumbai"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0F4C3A]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 100 Feet Road, HAL Stage 2"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0F4C3A]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Specs */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-bold text-gray-900 text-sm mb-3 font-['Poppins']">
              3. Architectural Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-bold text-gray-600 mb-1">Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Bathrooms</label>
                <input
                  type="number"
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Area (Sq. Ft.) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Floor Level</label>
                <input
                  type="text"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  placeholder="e.g. 12th of 24"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-bold text-gray-600 mb-1">
                Amenities (Comma separated)
              </label>
              <input
                type="text"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="Swimming Pool, 24/7 Security, Gymnasium, Clubhouse, Private Garden"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none"
              />
            </div>

            <div className="mt-4">
              <label className="block font-bold text-gray-600 mb-1">Detailed Description *</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive description of the architecture, layout, lighting, and community..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Section 4: Imagery & Assigned Agent */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-bold text-gray-900 text-sm mb-3 font-['Poppins']">
              4. Media & Assignment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-600 mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none"
                />
                {formData.coverImage && (
                  <div className="mt-2 h-20 w-32 rounded-lg overflow-hidden border border-gray-200">
                    <img src={formData.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Assigned Agent</label>
                <select
                  value={formData.assignedAgent}
                  onChange={(e) => setFormData({ ...formData, assignedAgent: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none"
                >
                  <option value="">Select an Agent...</option>
                  {agents.map((ag) => (
                    <option key={ag._id} value={ag._id}>
                      {ag.name} ({ag.role})
                    </option>
                  ))}
                </select>

                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                  />
                  <label htmlFor="featuredCheckbox" className="font-bold text-gray-700 cursor-pointer">
                    Mark as Featured Listing (Displays on Homepage)
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-600 mb-1">
                  Additional Gallery Images (1 URL per line)
                </label>
                <textarea
                  rows={2}
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0A3629] text-white font-bold shadow-md disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
