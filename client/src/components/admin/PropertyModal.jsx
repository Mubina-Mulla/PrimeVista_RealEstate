import React, { useState, useEffect } from 'react'
import {
  X,
  Upload,
  Trash2,
  Star,
  ArrowLeft,
  ArrowRight,
  Plus,
  Image as ImageIcon,
} from 'lucide-react'
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
    featured: false,
    status: 'published',
    seoTitle: '',
    metaDescription: '',
    assignedAgent: '',
  }

  const [formData, setFormData] = useState(initialForm)
  const [galleryImages, setGalleryImages] = useState([])
  const [newImageUrl, setNewImageUrl] = useState('')
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
        featured: property.featured || false,
        status: property.status || 'published',
        seoTitle: property.seoTitle || '',
        metaDescription: property.metaDescription || '',
        assignedAgent: property.assignedAgent?._id || property.assignedAgent || '',
      })
      setGalleryImages(Array.isArray(property.images) ? property.images : [])
    } else {
      setFormData(initialForm)
      setGalleryImages([
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
      ])
    }
    setNewImageUrl('')
  }, [property, isOpen])

  if (!isOpen) return null

  // Local file upload handler
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        showToast(`Skipped ${file.name}: Not an image`, 'error')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target.result
        setGalleryImages((prev) => [...prev, dataUrl])
        setFormData((prev) => (!prev.coverImage ? { ...prev, coverImage: dataUrl } : prev))
      }
      reader.readAsDataURL(file)
    })
    showToast(`Added ${files.length} image(s)`, 'success')
    e.target.value = ''
  }

  // Add image by URL
  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim()
    if (!trimmed) return
    setGalleryImages((prev) => [...prev, trimmed])
    if (!formData.coverImage) {
      setFormData((prev) => ({ ...prev, coverImage: trimmed }))
    }
    setNewImageUrl('')
  }

  // Remove image
  const handleRemoveImage = (indexToRemove) => {
    const removedUrl = galleryImages[indexToRemove]
    const updated = galleryImages.filter((_, idx) => idx !== indexToRemove)
    setGalleryImages(updated)
    if (formData.coverImage === removedUrl) {
      setFormData((prev) => ({ ...prev, coverImage: updated[0] || '' }))
    }
  }

  // Reorder images
  const handleMoveImage = (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= galleryImages.length) return
    const updated = [...galleryImages]
    const [moved] = updated.splice(index, 1)
    updated.splice(targetIndex, 0, moved)
    setGalleryImages(updated)
  }

  // Set as Cover
  const handleSetAsCover = (url) => {
    setFormData((prev) => ({ ...prev, coverImage: url }))
    showToast('Cover image updated', 'success')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const amenitiesArray = formData.amenities
        .split(',')
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
        coverImage: formData.coverImage.trim() || galleryImages[0] || '',
        images: galleryImages,
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
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[92vh]">
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

          {/* Section 4: Visual Imagery & Gallery Management */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-gray-900 text-sm font-['Poppins']">
                  4. Media & Gallery Management
                </h4>
                <p className="text-gray-500 text-[11px]">
                  Upload high-res photos, reorder images, set cover thumbnail, or remove unwanted frames.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-[#0F4C3A] hover:bg-emerald-100 font-bold border border-emerald-200 transition-colors">
                  <Upload size={14} />
                  <span>Upload Local Photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* URL Input & Cover display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#F5F7F5] border border-gray-200">
              <div className="sm:col-span-2 space-y-2">
                <label className="block font-bold text-gray-700">Add Image from Web URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:border-[#0F4C3A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 rounded-xl bg-[#0F4C3A] hover:bg-[#0A3629] text-white font-bold inline-flex items-center gap-1 shrink-0"
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>

                <div className="pt-2">
                  <label className="block font-bold text-gray-700 mb-1">Primary Cover Image URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:border-[#0F4C3A]"
                  />
                </div>
              </div>

              {/* Cover Image Preview Card */}
              <div>
                <span className="block font-bold text-gray-700 mb-1">Cover Preview</span>
                <div className="h-28 rounded-xl overflow-hidden border-2 border-[#0F4C3A] relative group bg-gray-100">
                  {formData.coverImage ? (
                    <img
                      src={formData.coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1">
                      <ImageIcon size={24} />
                      <span className="text-[10px]">No cover selected</span>
                    </div>
                  )}
                  <span className="absolute bottom-1.5 left-1.5 bg-[#0F4C3A] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                    <Star size={10} className="fill-[#F4B740] text-[#F4B740]" /> Cover
                  </span>
                </div>
              </div>
            </div>

            {/* Gallery Image Thumbnails Reorder Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-700">
                  Gallery Images ({galleryImages.length})
                </span>
                <span className="text-[10px] text-gray-400">
                  Use arrows to reorder • Star to set as cover
                </span>
              </div>

              {galleryImages.length === 0 ? (
                <div className="p-8 rounded-2xl border-2 border-dashed border-gray-200 text-center text-gray-400 space-y-2">
                  <ImageIcon size={32} className="mx-auto text-gray-300" />
                  <p className="font-semibold text-xs">No gallery images added yet</p>
                  <p className="text-[10px]">Upload photos from your computer or paste image URLs above</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
                  {galleryImages.map((imgUrl, idx) => {
                    const isCover = formData.coverImage === imgUrl
                    return (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border group bg-gray-50 flex flex-col ${
                          isCover ? 'ring-2 ring-[#0F4C3A] border-transparent' : 'border-gray-200'
                        }`}
                      >
                        <div className="h-24 w-full overflow-hidden bg-gray-100 relative">
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          {isCover && (
                            <span className="absolute top-1.5 left-1.5 bg-[#0F4C3A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1">
                              <Star size={9} className="fill-[#F4B740] text-[#F4B740]" /> Cover
                            </span>
                          )}
                        </div>

                        {/* Controls Toolbar */}
                        <div className="p-1.5 bg-white flex items-center justify-between border-t border-gray-100">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, -1)}
                              title="Move left"
                              className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                            >
                              <ArrowLeft size={12} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === galleryImages.length - 1}
                              onClick={() => handleMoveImage(idx, 1)}
                              title="Move right"
                              className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                            >
                              <ArrowRight size={12} />
                            </button>
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetAsCover(imgUrl)}
                                title="Set as Cover Image"
                                className="p-1 rounded text-amber-600 hover:bg-amber-50"
                              >
                                <Star size={12} />
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            title="Remove photo"
                            className="p-1 rounded text-rose-500 hover:bg-rose-50"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Assigned Agent & Featured Listing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
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
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                  />
                  <span className="font-bold text-gray-700">
                    Mark as Featured Listing (Displays on Homepage)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
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
