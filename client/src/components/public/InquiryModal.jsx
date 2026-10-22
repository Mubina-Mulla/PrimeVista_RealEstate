import React, { useState } from 'react'
import { X, Calendar, Clock, Send, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { api } from '../../api/client.js'
import { useToast } from '../../context/ToastContext.jsx'

export function InquiryModal({ isOpen, onClose, property }) {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    message: property ? `I am interested in scheduling a viewing for ${property.title} (Ref: ${property.propertyId}).` : '',
    inquiryType: 'site_visit',
    preferredDate: '',
    preferredTime: 'Morning (10:00 AM - 1:00 PM)',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        propertyId: property?._id || null,
        inquiryType: formData.inquiryType,
        preferredDate: formData.preferredDate || null,
        preferredTime: formData.preferredTime || '',
      }

      const res = await api.post('/inquiries', payload)
      if (res.success) {
        setSubmitted(true)
        showToast('Inquiry submitted! Our property specialist will contact you shortly.', 'success')
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit inquiry. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#0F4C3A] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={18} />
          </button>

          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F4B740] text-[#0F4C3A] text-xs font-bold uppercase tracking-wider mb-2">
            {formData.inquiryType === 'site_visit' ? 'Schedule a Site Visit' : 'Inquire on Property'}
          </span>
          <h3 className="text-xl font-bold font-['Poppins']">
            {property ? property.title : 'Schedule Property Consultation'}
          </h3>
          {property && (
            <p className="text-xs text-emerald-200 mt-1">
              Ref ID: <span className="font-mono font-bold text-white">{property.propertyId}</span> • {property.locality}, {property.city}
            </p>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0F4C3A] flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="text-xl font-bold text-[#1F2937]">Request Confirmed!</h4>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                Thank you, <strong>{formData.customerName}</strong>. Our assigned property specialist has received your request and will call you on <strong>{formData.phone}</strong> to confirm the appointment.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#0F4C3A] text-white text-sm font-bold shadow-md hover:bg-[#0A3629]"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Inquiry Type Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-[#F5F7F5] p-1.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, inquiryType: 'site_visit' })}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    formData.inquiryType === 'site_visit'
                      ? 'bg-white text-[#0F4C3A] shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Schedule Site Visit
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, inquiryType: 'property_inquiry' })}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    formData.inquiryType === 'property_inquiry'
                      ? 'bg-white text-[#0F4C3A] shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Ask a Question
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F4C3A]"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F4C3A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F4C3A]"
                  />
                </div>
              </div>

              {/* Visit Date & Time (for site visits) */}
              {formData.inquiryType === 'site_visit' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <div>
                    <label className="block text-xs font-bold text-[#0F4C3A] mb-1 flex items-center gap-1">
                      <Calendar size={14} /> Preferred Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-emerald-200 bg-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F4C3A] mb-1 flex items-center gap-1">
                      <Clock size={14} /> Preferred Slot
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-emerald-200 bg-white text-xs focus:outline-none"
                    >
                      <option>Morning (10:00 AM - 1:00 PM)</option>
                      <option>Afternoon (1:00 PM - 4:00 PM)</option>
                      <option>Evening (4:00 PM - 7:00 PM)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Message / Special Requests
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your requirements or questions..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F4C3A]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                <ShieldCheck size={16} className="text-[#0F4C3A] shrink-0" />
                <span>Your contact information is strictly protected and never shared.</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-[#0F4C3A] hover:bg-[#0A3629] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0F4C3A]/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Submitting request...</span>
                ) : (
                  <>
                    <Send size={16} className="text-[#F4B740]" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
