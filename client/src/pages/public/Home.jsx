import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  House,
  ArrowRight,
  Building2,
  KeyRound,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  Star,
  Users,
  Compass,
} from 'lucide-react'
import { api } from '../../api/client.js'
import { SearchHero } from '../../components/public/SearchHero.jsx'
import { PropertyCard } from '../../components/public/PropertyCard.jsx'
import { InquiryModal } from '../../components/public/InquiryModal.jsx'
import { FALLBACK_PROPERTIES } from '../../data/fallbackData.js'

export function Home() {
  const [featuredProperties, setFeaturedProperties] = useState(() =>
    FALLBACK_PROPERTIES.filter((p) => p.featured)
  )
  const [recentProperties, setRecentProperties] = useState(() =>
    FALLBACK_PROPERTIES.slice(0, 6)
  )
  const [pageContent, setPageContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All')
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false)

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [featuredRes, recentRes, contentRes] = await Promise.all([
          api.get('/properties/featured').catch(() => ({ data: [] })),
          api.get('/properties?limit=6&sort=newest').catch(() => ({ data: [] })),
          api.get('/content/home').catch(() => ({ data: null })),
        ])

        if (featuredRes?.success && Array.isArray(featuredRes.data) && featuredRes.data.length > 0) {
          setFeaturedProperties(featuredRes.data)
        }
        if (recentRes?.success && Array.isArray(recentRes.data) && recentRes.data.length > 0) {
          setRecentProperties(recentRes.data)
        }
        if (contentRes?.success && contentRes.data?.sections) {
          setPageContent(contentRes.data.sections)
        }
      } catch (err) {
        console.warn('Backend not reached, showing default featured properties', err)
      }
    }

    loadHomeData()
  }, [])

  // Filter properties by category tag
  const filteredFeatured =
    activeCategoryFilter === 'All'
      ? featuredProperties
      : featuredProperties.filter((p) => p.category === activeCategoryFilter)

  return (
    <div className="min-h-screen bg-[#F5F7F5] overflow-x-hidden">
      {/* 1. Hero Banner with Staggered Entrance Animations & Trust Cards */}
      <SearchHero heroData={pageContent} />

      {/* 2. Featured Properties Section (Staggers into view on scroll) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F4C3A]">
              <Sparkles size={16} className="text-[#F4B740]" />
              <span>Handpicked Collection</span>
            </div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1F2937] font-['Poppins']">
              Featured Properties
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-xl">
              Discover verified signature residences and commercial investments meeting our highest standards of build and title integrity.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Penthouse', 'Villa', 'Apartment', 'Office'].map((cat, idx) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 * idx }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategoryFilter === cat
                    ? 'bg-[#0F4C3A] text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0F4C3A]'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Property Grid: Staggers one by one */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredFeatured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {filteredFeatured.map((property, idx) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.6,
                  delay: (idx % 3) * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8"
          >
            <Building2 className="mx-auto text-[#0F4C3A]" size={42} />
            <h3 className="mt-4 text-lg font-bold text-gray-800">No properties in this category</h3>
            <p className="mt-1 text-sm text-gray-500">Please choose another category or clear your filter.</p>
            <button
              onClick={() => setActiveCategoryFilter('All')}
              className="mt-4 px-5 py-2 rounded-xl bg-[#0F4C3A] text-white text-xs font-bold cursor-pointer"
            >
              Show All Properties
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white border border-[#0F4C3A] text-[#0F4C3A] font-bold text-sm hover:bg-[#0F4C3A] hover:text-white transition-all shadow-xs group"
          >
            <span>View All Available Properties</span>
            <ArrowRight size={16} className="text-[#F4B740] group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* 3. The PrimeVista Distinction Section */}
      <section className="bg-white py-16 md:py-24 border-y border-gray-100 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F4B740]/20 text-[#0F4C3A]">
                <Award size={14} className="text-[#0F4C3A]" />
                The PrimeVista Distinction
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] font-['Poppins'] leading-tight">
                Find the Perfect Property <br />
                <span className="text-[#0F4C3A]">That Fits Your Lifestyle</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Whether you desire a serene suburban sanctuary surrounded by nature, a high-rise duplex overlooking the Arabian Sea, or a Grade-A corporate office in a financial hub, our tailored consulting matches your aspirations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { title: 'Strict Title Due Diligence', desc: 'Every deed checked by our in-house legal team.' },
                  { title: 'Pre-Approved Mortgages', desc: 'Partnered with top tier banks for low rates.' },
                  { title: 'Dedicated Concierge', desc: 'Personal escort for all private property tours.' },
                  { title: 'Zero Hidden Fees', desc: 'Clear terms and absolute financial transparency.' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * idx }}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F5F7F5] border border-gray-100"
                  >
                    <CheckCircle2 size={18} className="text-[#0F4C3A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInquiryModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0F4C3A] text-white font-bold text-sm shadow-md hover:bg-[#0A3629] transition-all cursor-pointer"
                >
                  <span>Book a Private Tour</span>
                  <ArrowRight size={16} className="text-[#F4B740]" />
                </motion.button>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-[#F5F7F5]">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern architectural living room interior"
                  className="w-full h-[400px] object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute -bottom-6 -left-6 p-5 rounded-2xl bg-[#0F4C3A] text-white shadow-xl max-w-xs hidden sm:block"
              >
                <p className="text-2xl font-black font-['Poppins'] text-[#F4B740]">2,500+</p>
                <p className="text-xs text-emerald-100 mt-1">
                  Families successfully settled in their dream residences across India.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Our Services Section: Staggers into view */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="text-xs font-bold tracking-widest uppercase text-[#0F4C3A]">
            Comprehensive Real Estate Solutions
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1F2937] font-['Poppins']">
            Our Services
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            From premier luxury acquisitions to institutional retail leases, we deliver bespoke advisory across every property segment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <House size={30} />,
              title: 'Residential Buying',
              desc: 'Curated villas, penthouses, and gated apartments matched to your family lifestyle with seamless registration.',
              link: '/properties?purpose=Buy',
            },
            {
              icon: <Building2 size={30} />,
              title: 'Commercial Leasing',
              desc: 'Grade-A tech park offices, flagship retail spaces, and institutional work environments in central business districts.',
              link: '/properties?category=Office',
            },
            {
              icon: <KeyRound size={30} />,
              title: 'Luxury Rentals',
              desc: 'High-end furnished apartments and executive estates for corporate leases and discerning expatriates.',
              link: '/properties?purpose=Rent',
            },
            {
              icon: <Compass size={30} />,
              title: 'Investment Advisory',
              desc: 'Strategic land banking, pre-launch developer allotments, and high-yield real estate portfolio structuring.',
              link: '/contact',
            },
          ].map((srv, idx) => (
            <motion.article
              key={srv.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0F4C3A] flex items-center justify-center group-hover:bg-[#0F4C3A] group-hover:text-[#F4B740] transition-colors">
                  {srv.icon}
                </div>
                <h3 className="mt-6 text-lg font-bold text-gray-900 font-['Poppins']">{srv.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed">{srv.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50">
                <Link
                  to={srv.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F4C3A] group-hover:text-[#0A3629]"
                >
                  <span>Learn more</span>
                  <ArrowRight size={14} className="text-[#F4B740] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 5. What Our Clients Say (Testimonials): Staggers into view */}
      <section className="bg-white py-16 md:py-24 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#0F4C3A]">
              Testimonials
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1F2937] font-['Poppins']">
              What Our Clients Say
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Read authentic feedback from families and business leaders who found their ideal property with PrimeVista.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh & Malini Iyer',
                role: 'Purchased Villa at Greenwood Meadows',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                review:
                  'The legal diligence team at PrimeVista gave us absolute confidence. Vikram handled our site visits effortlessly and negotiated transparent terms with the seller. A truly world-class experience.',
                rating: 5,
              },
              {
                name: 'Kavita Menon',
                role: 'Managing Director, Horizon FinTech',
                avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
                review:
                  'Securing 60+ workstations in BKC was a critical priority for our company expansion. Ananya presented three prime options within 48 hours and helped finalize our lease within 2 weeks.',
                rating: 5,
              },
              {
                name: 'Dr. Siddharth Verma',
                role: 'Investor, Indiranagar Penthouse',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                review:
                  'PrimeVista’s curated property collection saved us endless hours of scrolling misleading listings. Everything is accurately photographed and verified.',
                rating: 5,
              },
            ].map((testi, idx) => (
              <motion.div
                key={testi.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -4 }}
                className="bg-[#F5F7F5] p-8 rounded-2xl border border-gray-200/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#F4B740] mb-4">
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-[#F4B740]" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    "{testi.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                  <img
                    src={testi.avatar}
                    alt={testi.name}
                    className="w-10 h-10 rounded-full object-cover border border-white"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{testi.name}</h4>
                    <p className="text-xs text-gray-500">{testi.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="bg-[#0F4C3A] text-white py-16 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#F4B740] text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
            Start Your Journey
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-['Poppins'] tracking-tight max-w-2xl mx-auto">
            Ready to Find Your Dream Property?
          </h2>
          <p className="mt-4 text-emerald-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Our expert property specialists are available for physical site visits, virtual tours, and mortgage consultation.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setInquiryModalOpen(true)}
              className="px-8 py-3.5 rounded-xl bg-[#F4B740] text-[#0F4C3A] font-bold text-sm shadow-xl hover:bg-[#e2a630] transition-all cursor-pointer"
            >
              Request Free Consultation
            </motion.button>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/properties"
                className="inline-block px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm transition-all"
              >
                Browse All Listings
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Floating Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        property={null}
      />
    </div>
  )
}
