import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Layers,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Clock,
  Send,
  Building2,
} from 'lucide-react'
import { api } from '../../api/client.js'
import { formatPrice } from '../../utils/formatters.js'
import { useToast } from '../../context/ToastContext.jsx'

import { FALLBACK_PROPERTIES } from '../../data/fallbackData.js'

export function PropertyDetail() {
  const { slug } = useParams()
  const { showToast } = useToast()

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState('')
  const [inquiryData, setInquiryData] = useState({
    customerName: '',
    phone: '',
    email: '',
    message: '',
    preferredDate: '',
    preferredTime: 'Morning (10:00 AM - 1:00 PM)',
  })
  const [submittingInquiry, setSubmittingInquiry] = useState(false)
  const [inquirySuccess, setInquirySuccess] = useState(false)

  useEffect(() => {
    async function loadProperty() {
      try {
        setLoading(true)
        const res = await api.get(`/properties/detail/${slug}`)
        if (res?.success && res.data) {
          setProperty(res.data)
          setSelectedImage(res.data.coverImage)
          setInquiryData((prev) => ({
            ...prev,
            message: `Hello, I am interested in ${res.data.title} (Property ID: ${res.data.propertyId}). Please contact me with further details or a viewing appointment.`,
          }))
          return
        }
      } catch (err) {
        const fallback = FALLBACK_PROPERTIES.find(
          (p) => p.slug === slug || p.propertyId === slug?.toUpperCase()
        )
        if (fallback) {
          setProperty(fallback)
          setSelectedImage(fallback.coverImage)
          setInquiryData((prev) => ({
            ...prev,
            message: `Hello, I am interested in ${fallback.title} (Property ID: ${fallback.propertyId}). Please contact me with further details or a viewing appointment.`,
          }))
          return
        }
        showToast(err.message || 'Property not found', 'error')
      } finally {
        setLoading(false)
      }
    }

    if (slug) loadProperty()
  }, [slug])

  const handleInquirySubmit = async (e) => {
    e.preventDefault()
    setSubmittingInquiry(true)

    try {
      const payload = {
        customerName: inquiryData.customerName.trim(),
        phone: inquiryData.phone.trim(),
        email: inquiryData.email.trim(),
        message: inquiryData.message.trim(),
        propertyId: property?._id,
        inquiryType: inquiryData.preferredDate ? 'site_visit' : 'property_inquiry',
        preferredDate: inquiryData.preferredDate || null,
        preferredTime: inquiryData.preferredTime || '',
      }

      const res = await api.post('/inquiries', payload)
      if (res.success) {
        setInquirySuccess(true)
        showToast('Your inquiry has been submitted! Our assigned agent will reach out shortly.', 'success')
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit inquiry', 'error')
    } finally {
      setSubmittingInquiry(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Check out ${property?.title} on PrimeVista Real Estate`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showToast('Property link copied to clipboard!', 'info')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7F5] py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#0F4C3A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-[70vh] bg-[#F5F7F5] flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl text-center max-w-md shadow-xl border border-gray-100">
          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Property Not Found</h2>
          <p className="text-sm text-gray-500 mt-2">
            This property listing may have been sold or archived.
          </p>
          <Link
            to="/properties"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F4C3A] text-white text-xs font-bold shadow-md hover:bg-[#0A3629]"
          >
            <ArrowLeft size={16} />
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

  const allImages = [property.coverImage, ...(property.images || [])].filter(Boolean)

  return (
    <div className="min-h-screen bg-[#F5F7F5] py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Link to="/properties" className="hover:text-[#0F4C3A] flex items-center gap-1 font-semibold">
              <ArrowLeft size={14} /> All Properties
            </Link>
            <span>/</span>
            <span className="text-gray-400">{property.city}</span>
            <span>/</span>
            <span className="font-mono text-[#0F4C3A] font-bold">{property.propertyId}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold"
          >
            <Share2 size={13} />
            <span>Share</span>
          </button>
        </div>

        {/* Property Header Banner */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm border border-gray-100 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-[#0F4C3A] border border-emerald-200">
                  {property.propertyId}
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0F4C3A] text-white">
                  {property.purpose === 'Buy' || property.purpose === 'For Sale' ? 'For Sale' : 'For Rent'}
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                  {property.category}
                </span>

                {property.featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#F4B740] text-[#0F4C3A]">
                    <Sparkles size={12} className="fill-[#0F4C3A]" /> Featured Listing
                  </span>
                )}

                {property.status === 'sold' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white">
                    SOLD
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2937] font-['Poppins'] leading-tight">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <MapPin size={16} className="text-[#0F4C3A] shrink-0" />
                <span>
                  {property.address ? `${property.address}, ` : ''}{property.locality}, {property.city}
                </span>
              </div>
            </div>

            {/* Price Showcase */}
            <div className="lg:text-right shrink-0">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                {property.purpose === 'Rent' || property.purpose === 'For Rent' ? 'Monthly Lease' : 'Investment Price'}
              </span>
              <div className="text-2xl sm:text-4xl font-black text-[#0F4C3A] font-['Poppins']">
                {formatPrice(property.price, property.purpose, property.rentalPeriod)}
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-white rounded-3xl p-3.5 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <div className="aspect-4/3 sm:aspect-16/9 w-full max-h-[500px] rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
            <img
              src={selectedImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails row */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#0F4C3A] ring-2 ring-[#0F4C3A]/20 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Content Layout: Left Details, Right Sticky Inquiry Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Key Specifications Grid */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-[#1F2937] font-['Poppins'] mb-4 sm:mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F4C3A]" />
                Key Specifications
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                <div className="p-3 sm:p-4 rounded-2xl bg-[#F5F7F5] border border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <Bed size={16} className="text-[#0F4C3A]" />
                    <span>Bedrooms</span>
                  </div>
                  <p className="text-lg font-black text-gray-900 font-['Poppins']">
                    {property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'N/A'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F7F5] border border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <Bath size={16} className="text-[#0F4C3A]" />
                    <span>Bathrooms</span>
                  </div>
                  <p className="text-lg font-black text-gray-900 font-['Poppins']">
                    {property.bathrooms > 0 ? property.bathrooms : 'N/A'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F7F5] border border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <Maximize2 size={16} className="text-[#0F4C3A]" />
                    <span>Super Area</span>
                  </div>
                  <p className="text-lg font-black text-gray-900 font-['Poppins']">
                    {property.area} sq.ft
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F7F5] border border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <Layers size={16} className="text-[#0F4C3A]" />
                    <span>Floor Level</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 truncate font-['Poppins']">
                    {property.floor || 'Ground'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[#1F2937] font-['Poppins'] mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F4C3A]" />
                Property Overview
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line font-normal">
                {property.description}
              </p>
            </div>

            {/* Amenities Checklist */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#1F2937] font-['Poppins'] mb-6 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F4C3A]" />
                  Amenities & Facilities
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F5F7F5] text-xs font-semibold text-gray-800"
                    >
                      <CheckCircle2 size={16} className="text-[#0F4C3A] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Neighborhood */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[#1F2937] font-['Poppins'] mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F4C3A]" />
                Location & Accessibility
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Situated in prime <strong>{property.locality}, {property.city}</strong> with direct access to arterial highways, top international schools, business hubs, and healthcare facilities.
              </p>

              {/* Map Placeholder Card */}
              <div className="h-64 rounded-2xl bg-emerald-950/10 border border-emerald-900/10 flex flex-col items-center justify-center p-6 text-center">
                <MapPin size={36} className="text-[#0F4C3A] mb-2" />
                <h4 className="text-sm font-bold text-gray-800">{property.locality}, {property.city}</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-1">
                  GPS coordinates and guided driving directions are provided upon confirmed viewing appointment.
                </p>
              </div>
            </div>
          </div>

          {/* Right Sticky Sidebar: Agent Card & Inquiry Form (4 cols) */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            {/* Assigned Specialist Card */}
            {property.assignedAgent && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Dedicated Property Specialist
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={property.assignedAgent.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'}
                    alt={property.assignedAgent.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-100 shadow-xs shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 font-['Poppins']">{property.assignedAgent.name}</h4>
                    <p className="text-xs text-[#0F4C3A] font-semibold">{property.assignedAgent.role}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{property.assignedAgent.experience || 'PrimeVista Verified'}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-2 pt-4 border-t border-gray-100 text-xs">
                  <a
                    href={`tel:${property.assignedAgent.phone}`}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F5F7F5] hover:bg-emerald-50 text-gray-700 hover:text-[#0F4C3A] transition-colors font-medium"
                  >
                    <Phone size={15} className="text-[#0F4C3A]" />
                    <span>{property.assignedAgent.phone}</span>
                  </a>
                  <a
                    href={`mailto:${property.assignedAgent.email}`}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F5F7F5] hover:bg-emerald-50 text-gray-700 hover:text-[#0F4C3A] transition-colors font-medium"
                  >
                    <Mail size={15} className="text-[#0F4C3A]" />
                    <span className="truncate">{property.assignedAgent.email}</span>
                  </a>
                </div>
              </div>
            )}

            {/* Direct Inquiry & Site Visit Form */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-lg font-bold text-[#1F2937] font-['Poppins'] mb-1">
                Schedule a Visit / Inquire
              </h3>
              <p className="text-xs text-gray-500 mb-5">
                Lock in your private viewing appointment with our advisor.
              </p>

              {inquirySuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 size={32} className="text-[#0F4C3A] mx-auto" />
                  <h4 className="text-sm font-bold text-[#0F4C3A]">Inquiry Registered!</h4>
                  <p className="text-xs text-gray-600">
                    Thank you! Our specialist will call you shortly to confirm your inspection.
                  </p>
                  <button
                    onClick={() => setInquirySuccess(false)}
                    className="text-xs font-bold text-[#0F4C3A] underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={inquiryData.customerName}
                      onChange={(e) => setInquiryData({ ...inquiryData, customerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0F4C3A] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0F4C3A] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="priya@example.com"
                      value={inquiryData.email}
                      onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0F4C3A] bg-white"
                    />
                  </div>

                  {/* Visit Date & Time */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F4C3A] mb-1 flex items-center gap-1">
                        <Calendar size={13} /> Visit Date
                      </label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={inquiryData.preferredDate}
                        onChange={(e) => setInquiryData({ ...inquiryData, preferredDate: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F4C3A] mb-1 flex items-center gap-1">
                        <Clock size={13} /> Time Slot
                      </label>
                      <select
                        value={inquiryData.preferredTime}
                        onChange={(e) => setInquiryData({ ...inquiryData, preferredTime: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none bg-white"
                      >
                        <option>Morning (10am-1pm)</option>
                        <option>Afternoon (1pm-4pm)</option>
                        <option>Evening (4pm-7pm)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Message
                    </label>
                    <textarea
                      rows={2}
                      value={inquiryData.message}
                      onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0F4C3A] bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <ShieldCheck size={14} className="text-[#0F4C3A] shrink-0" />
                    <span>Safe & confidential. No spam guaranteed.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="w-full py-3 px-6 rounded-xl bg-[#0F4C3A] hover:bg-[#0A3629] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0F4C3A]/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {submittingInquiry ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send size={15} className="text-[#F4B740]" />
                        <span>Send Booking Request</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
