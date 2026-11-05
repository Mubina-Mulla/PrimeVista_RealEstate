import React, { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react'
import { api } from '../../api/client.js'
import { useToast } from '../../context/ToastContext.jsx'
import {
  validateName,
  validatePhone,
  validateEmail,
  validateMessage,
} from '../../utils/validators.js'

export function Contact() {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validateField = (field, value) => {
    if (field === 'customerName') return validateName(value, 'Full name')
    if (field === 'phone') return validatePhone(value, 'Phone number')
    if (field === 'email') return validateEmail(value, 'Email address')
    if (field === 'message') return validateMessage(value, 10, 'Inquiry message')
    return null
  }

  const handleBlur = (field) => {
    const errorMsg = validateField(field, formData[field])
    setErrors((prev) => ({ ...prev, [field]: errorMsg }))
  }

  const validate = () => {
    const errs = {
      customerName: validateName(formData.customerName, 'Full name'),
      phone: validatePhone(formData.phone, 'Phone number'),
      email: validateEmail(formData.email, 'Email address'),
      message: validateMessage(formData.message, 10, 'Inquiry message'),
    }

    // Clean nulls
    Object.keys(errs).forEach((key) => {
      if (!errs[key]) delete errs[key]
    })

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      showToast('Please fix the highlighted validation errors', 'error')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/inquiries', {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        inquiryType: 'general',
      })

      if (res.success) {
        setSubmitted(true)
        setErrors({})
        showToast('Thank you! Your message has been received.', 'success')
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit form', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7F5] py-8 sm:py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C3A]">
            Get In Touch
          </span>
          <h1 className="mt-2 text-3xl sm:text-5xl font-black text-[#1F2937] font-['Poppins']">
            Contact PrimeVista
          </h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
            Have a question about a listed property or wish to list your luxury residence? Reach out to our executive advisory desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Office Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-xl font-bold text-[#1F2937] font-['Poppins']">
                Corporate Headquarters
              </h3>

              <div className="space-y-5 text-sm text-gray-600">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F4C3A] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Address</h4>
                    <p className="mt-1 leading-snug">
                      PrimeVista Executive Tower, Level 8, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F4C3A] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Direct Phone & WhatsApp</h4>
                    <p className="mt-1">
                      <a href="tel:+919175514916" className="text-[#0F4C3A] font-semibold hover:underline">
                        +91 91755 14916
                      </a>
                    </p>
                    <p className="text-xs text-emerald-700 font-medium mt-1">
                      <a
                        href="https://wa.me/919175514916?text=Hello%20PrimeVista%20Real%20Estate,%20I%20would%20like%20to%20inquire%20about%20your%20properties."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#25D366] inline-block animate-pulse"></span>
                        Chat on WhatsApp: +91 91755 14916
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F4C3A] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Email Inquiry</h4>
                    <p className="mt-1">
                      <a href="mailto:contact@primevista.com" className="text-[#0F4C3A] font-semibold hover:underline">
                        contact@primevista.com
                      </a>
                    </p>
                    <p className="text-xs text-gray-400">support@primevista.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F4C3A] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Office Hours</h4>
                    <p className="mt-1 leading-snug">
                      Monday – Saturday: 9:30 AM – 7:30 PM <br />
                      Sunday: By appointment only
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-56 bg-emerald-950/10 flex items-center justify-center text-center p-6">
              <div>
                <MapPin size={32} className="text-[#0F4C3A] mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-800">PrimeVista Executive Tower</p>
                <p className="text-xs text-gray-500">100 Feet Road, Indiranagar, Bengaluru</p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-[#1F2937] font-['Poppins']">
              Send an Inquiry Message
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-8">
              Fill out this form and our relationship manager will call you back within 2 business hours.
            </p>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0F4C3A] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 font-['Poppins']">Message Delivered!</h4>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Thank you, <strong>{formData.customerName}</strong>. Your message has been logged in our secure database. Our team will contact you shortly on <strong>{formData.phone}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ customerName: '', phone: '', email: '', message: '' })
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-[#0F4C3A] text-white text-xs font-bold shadow-md hover:bg-[#0A3629]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram Malhotra"
                    value={formData.customerName}
                    onChange={(e) => {
                      const val = e.target.value
                      setFormData((prev) => ({ ...prev, customerName: val }))
                      if (errors.customerName) {
                        setErrors((prev) => ({ ...prev, customerName: validateField('customerName', val) }))
                      }
                    }}
                    onBlur={() => handleBlur('customerName')}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors bg-white ${
                      errors.customerName
                        ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/20'
                        : 'border-gray-200 focus:border-[#0F4C3A]'
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle size={13} /> {errors.customerName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 91755 14916"
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value
                        setFormData((prev) => ({ ...prev, phone: val }))
                        if (errors.phone) {
                          setErrors((prev) => ({ ...prev, phone: validateField('phone', val) }))
                        }
                      }}
                      onBlur={() => handleBlur('phone')}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors bg-white ${
                        errors.phone
                          ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/20'
                          : 'border-gray-200 focus:border-[#0F4C3A]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle size={13} /> {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="vikram@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        const val = e.target.value
                        setFormData((prev) => ({ ...prev, email: val }))
                        if (errors.email) {
                          setErrors((prev) => ({ ...prev, email: validateField('email', val) }))
                        }
                      }}
                      onBlur={() => handleBlur('email')}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors bg-white ${
                        errors.email
                          ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/20'
                          : 'border-gray-200 focus:border-[#0F4C3A]'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle size={13} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    How Can We Assist You? *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide details about your preferred location, budget, property type, or specific question..."
                    value={formData.message}
                    onChange={(e) => {
                      const val = e.target.value
                      setFormData((prev) => ({ ...prev, message: val }))
                      if (errors.message) {
                        setErrors((prev) => ({ ...prev, message: validateField('message', val) }))
                      }
                    }}
                    onBlur={() => handleBlur('message')}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors bg-white ${
                      errors.message
                        ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/20'
                        : 'border-gray-200 focus:border-[#0F4C3A]'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle size={13} /> {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={16} className="text-[#0F4C3A] shrink-0" />
                  <span>We adhere strictly to client privacy. No spam or third-party sharing.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0F4C3A] hover:bg-[#0A3629] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0F4C3A]/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Submitting inquiry...</span>
                  ) : (
                    <>
                      <Send size={16} className="text-[#F4B740]" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
