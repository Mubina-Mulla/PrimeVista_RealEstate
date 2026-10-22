import React, { useState, useEffect } from 'react'
import { FileText, Save, CheckCircle2, Globe, Sparkles, Building2 } from 'lucide-react'
import { api } from '../../api/client.js'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export function CMSAdmin() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('home')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [homeSections, setHomeSections] = useState({
    heroBadge: 'Find a place to call home',
    heroTitle: 'Your Dream Home',
    heroHighlight: 'Is Just a Step Away',
    heroDescription:
      'Discover hand-picked residential, luxury villa, and commercial properties tailored to your ambition, lifestyle, and financial future with PrimeVista.',
    heroImage:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    ctaTitle: 'Ready to Find Your Dream Property?',
    ctaSubtitle:
      'Our seasoned property advisors are here to guide you with verified legal titles, seamless visits, and end-to-end documentation.',
  })

  const [contactSections, setContactSections] = useState({
    address: 'PrimeVista Executive Tower, Level 8, 100 Feet Road, Indiranagar, Bengaluru, 560038',
    phone: '+91 (080) 4567 8900',
    email: 'contact@primevista.com',
    officeHours: 'Monday – Saturday: 9:30 AM – 7:30 PM',
  })

  const [seoFields, setSeoFields] = useState({
    seoTitle: 'PrimeVista Real Estate | Better Spaces. Brighter Futures.',
    seoDescription: 'Discover verified luxury residential & commercial properties across India.',
  })

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true)
        const res = await api.get(`/content/${activeTab}`)
        if (res.success && res.data) {
          if (activeTab === 'home' && res.data.sections) {
            setHomeSections((prev) => ({ ...prev, ...res.data.sections }))
          }
          if (activeTab === 'contact' && res.data.sections) {
            setContactSections((prev) => ({ ...prev, ...res.data.sections }))
          }
          if (res.data.seoTitle) {
            setSeoFields({
              seoTitle: res.data.seoTitle,
              seoDescription: res.data.seoDescription || '',
            })
          }
        }
      } catch (err) {
        // Keep current state
      } finally {
        setLoading(false)
      }
    }
    loadPage()
  }, [activeTab])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        title: activeTab === 'home' ? 'Homepage Content' : 'Contact Us Page',
        sections: activeTab === 'home' ? homeSections : contactSections,
        seoTitle: seoFields.seoTitle,
        seoDescription: seoFields.seoDescription,
      }

      const res = await api.put(`/content/${activeTab}`, payload)
      if (res.success) {
        showToast(`Changes for '${activeTab}' saved to database live!`, 'success')
      }
    } catch (err) {
      showToast(err.message || 'Failed to update page content', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937] font-['Poppins']">
              Website Content Manager (CMS)
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Edit hero headings, banner text, contact info, and SEO meta tags without editing source code.
            </p>
          </div>
        </div>

        {/* Page Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'home'
                ? 'border-[#0F4C3A] text-[#0F4C3A]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Homepage Content
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'contact'
                ? 'border-[#0F4C3A] text-[#0F4C3A]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Contact & Office Details
          </button>
        </div>

        {/* Content Edit Form */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6 text-xs">
          {activeTab === 'home' ? (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-sm font-['Poppins'] flex items-center gap-2">
                <Sparkles size={16} className="text-[#F4B740]" />
                Homepage Hero Section
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Hero Pill Badge</label>
                  <input
                    type="text"
                    value={homeSections.heroBadge}
                    onChange={(e) => setHomeSections({ ...homeSections, heroBadge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1">Hero Title (Primary)</label>
                  <input
                    type="text"
                    value={homeSections.heroTitle}
                    onChange={(e) => setHomeSections({ ...homeSections, heroTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-600 mb-1">
                    Hero Title (Gold Highlighted Line)
                  </label>
                  <input
                    type="text"
                    value={homeSections.heroHighlight}
                    onChange={(e) => setHomeSections({ ...homeSections, heroHighlight: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-600 mb-1">Hero Subtitle / Description</label>
                  <textarea
                    rows={3}
                    value={homeSections.heroDescription}
                    onChange={(e) => setHomeSections({ ...homeSections, heroDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-600 mb-1">Hero Image URL</label>
                  <input
                    type="url"
                    value={homeSections.heroImage}
                    onChange={(e) => setHomeSections({ ...homeSections, heroImage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-sm font-['Poppins'] flex items-center gap-2">
                <Building2 size={16} className="text-[#0F4C3A]" />
                Contact Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Corporate Address</label>
                  <input
                    type="text"
                    value={contactSections.address}
                    onChange={(e) => setContactSections({ ...contactSections, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={contactSections.phone}
                      onChange={(e) => setContactSections({ ...contactSections, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Inquiry Email</label>
                    <input
                      type="email"
                      value={contactSections.email}
                      onChange={(e) => setContactSections({ ...contactSections, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1">Office Hours</label>
                  <input
                    type="text"
                    value={contactSections.officeHours}
                    onChange={(e) => setContactSections({ ...contactSections, officeHours: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO Meta Tags */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Globe size={14} className="text-[#0F4C3A]" />
              Search Engine Optimization (SEO)
            </h4>

            <div>
              <label className="block font-bold text-gray-600 mb-1">Page Meta Title</label>
              <input
                type="text"
                value={seoFields.seoTitle}
                onChange={(e) => setSeoFields({ ...seoFields, seoTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-600 mb-1">Page Meta Description</label>
              <textarea
                rows={2}
                value={seoFields.seoDescription}
                onChange={(e) => setSeoFields({ ...seoFields, seoDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0A3629] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#0F4C3A]/20 disabled:opacity-50 cursor-pointer"
            >
              <Save size={16} className="text-[#F4B740]" />
              <span>{saving ? 'Publishing Updates...' : 'Publish Content Updates'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
