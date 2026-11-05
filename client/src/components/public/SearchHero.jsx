import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Search,
  MapPin,
  Building2,
  IndianRupee,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BadgePercent,
  CheckCircle2,
} from 'lucide-react'

export function SearchHero({ heroData }) {
  const navigate = useNavigate()
  const [purpose, setPurpose] = useState('Buy')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [budget, setBudget] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (purpose && purpose !== 'all') params.set('purpose', purpose)
    if (location.trim()) {
      params.set('location', location.trim())
      params.set('search', location.trim())
    }
    if (category && category !== 'all' && category !== 'Any property' && category !== '') {
      params.set('category', category)
    }
    if (budget && budget !== 'Any budget') {
      if (budget === 'under-50l') params.set('maxPrice', '5000000')
      if (budget === '50l-1.5cr') {
        params.set('minPrice', '5000000')
        params.set('maxPrice', '15000000')
      }
      if (budget === '1.5cr-3cr') {
        params.set('minPrice', '15000000')
        params.set('maxPrice', '30000000')
      }
      if (budget === 'above-3cr') params.set('minPrice', '30000000')
    }

    const queryString = params.toString()
    navigate(queryString ? `/properties?${queryString}` : '/properties')
  }

  const badgeText = heroData?.heroBadge || 'Find a place to call home'
  const titleText = heroData?.heroTitle || 'Your Dream Home'
  const highlightText = heroData?.heroHighlight || 'Is Just a Step Away'
  const descriptionText =
    heroData?.heroDescription ||
    'Discover properties that fit your lifestyle, your plans, and your future with PrimeVista Real Estate.'
  const heroImage =
    heroData?.heroImage ||
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85'

  const titleWords = titleText.split(' ')
  const highlightWords = highlightText.split(' ')

  return (
    <div className="relative">
      {/* Dark Green Brand Hero Section */}
      <section className="relative overflow-hidden bg-[#0F4C3A] text-white pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-10 md:pb-20">
        {/* Animated subtle ambient glow circles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.2, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#F4B740]/10 blur-3xl pointer-events-none"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10 lg:space-y-12">
          {/* 1. Interactive Search Filter Box: Staggers in right after Navbar on Banner */}
          <motion.div
            id="search-bar"
            initial={{ opacity: 0, y: -25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-2xl border border-white/20 text-[#1F2937]">
              <form onSubmit={handleSearch} className="space-y-4 sm:space-y-5">
                {/* Purpose Tabs: Buy vs Rent */}
                <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                  {['Buy', 'Rent'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setPurpose(tab)}
                      className={`flex-1 sm:flex-initial px-6 py-2 rounded-xl text-sm font-bold transition-all text-center cursor-pointer ${
                        purpose === tab
                          ? 'bg-[#0F4C3A] text-white shadow-md shadow-[#0F4C3A]/20'
                          : 'bg-[#F5F7F5] text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                  <span className="text-xs text-gray-400 ml-2 hidden sm:inline">
                    {purpose === 'Buy' ? 'Browse homes, penthouses & villas for purchase' : 'Browse premium rental residences & offices'}
                  </span>
                </div>

                {/* Form Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  {/* Location */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Location / Locality
                    </label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0F4C3A]" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Indiranagar, Worli, BKC..."
                        className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 bg-white text-gray-800 placeholder-gray-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Property Type
                    </label>
                    <div className="relative">
                      <Building2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0F4C3A]" />
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 bg-white text-gray-800 appearance-none cursor-pointer"
                      >
                        <option value="">Any property type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Penthouse">Penthouse</option>
                        <option value="Office">Commercial Office</option>
                        <option value="Shop">Retail Shop</option>
                        <option value="Plot">Villa Plot</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Budget Range
                    </label>
                    <div className="relative">
                      <IndianRupee size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0F4C3A]" />
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 bg-white text-gray-800 appearance-none cursor-pointer"
                      >
                        <option value="">Any budget</option>
                        <option value="under-50l">Under ₹50 Lakhs</option>
                        <option value="50l-1.5cr">₹50 Lakhs – ₹1.5 Crore</option>
                        <option value="1.5cr-3cr">₹1.5 Crore – ₹3 Crore</option>
                        <option value="above-3cr">Above ₹3 Crore</option>
                      </select>
                    </div>
                  </div>

                  {/* Search Submit Button */}
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl bg-[#0F4C3A] hover:bg-[#0A3629] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0F4C3A]/20 transition-all cursor-pointer"
                    >
                      <Search size={18} className="text-[#F4B740]" />
                      <span>Search Properties</span>
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

          {/* 2. Main Hero Content Grid with Staggered Reveals */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Pill badge: Staggers in at 0.3s */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-medium backdrop-blur-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#F4B740] animate-pulse" />
                <span>{badgeText}</span>
              </motion.div>

              {/* Main Headline: 3D Staggered Word Flip at 0.45s */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Poppins'] tracking-tight leading-[1.15] [perspective:600px]">
                <span className="inline-block">
                  {titleWords.map((word, idx) => (
                    <motion.span
                      key={idx}
                      className="inline-block mr-2.5 sm:mr-3.5 last:mr-0"
                      initial={{ opacity: 0, y: 40, rotateX: 70 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.4 + idx * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>{' '}
                <span className="block text-[#F4B740] mt-1 drop-shadow-sm">
                  {highlightWords.map((word, idx) => (
                    <motion.span
                      key={idx}
                      className="inline-block mr-2.5 sm:mr-3.5 last:mr-0"
                      initial={{ opacity: 0, y: 40, rotateX: 70 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.6 + idx * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </h1>

              {/* Description: Staggers in at 0.8s */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-xl text-sm sm:text-base lg:text-lg text-emerald-100/90 leading-relaxed font-normal"
              >
                {descriptionText}
              </motion.p>

              {/* Quick Action buttons: Staggers in at 0.95s */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
                className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => navigate('/properties')}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#F4B740] text-[#0F4C3A] font-bold text-sm sm:text-base shadow-lg shadow-[#F4B740]/20 hover:bg-[#e2a630] transition-all text-center cursor-pointer"
                >
                  <span>Explore Properties</span>
                  <ArrowRight size={18} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm sm:text-base backdrop-blur-sm transition-all text-center cursor-pointer"
                >
                  Contact Our Team
                </motion.button>
              </motion.div>

              {/* 3. Two Trust Cards (Verified Property & No Hidden Charges): Staggers in at 1.1s & 1.25s */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {/* Trust Card 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-white/25 transition-all duration-300 shadow-lg group/trust"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#F4B740]/20 border border-[#F4B740]/40 flex items-center justify-center text-[#F4B740] shrink-0 mt-0.5 group-hover/trust:bg-[#F4B740]/30 transition-colors">
                    <ShieldCheck size={22} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-sm tracking-wide">
                      Verified Property
                    </h4>
                    <ul className="mt-1.5 space-y-1 text-xs text-emerald-100/85">
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F4B740] shrink-0" />
                        Personally Inspected by Our Team
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F4B740] shrink-0" />
                        Owner Identity & Title Verified
                      </li>
                    </ul>
                  </div>
                </motion.div>

                {/* Trust Card 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-white/25 transition-all duration-300 shadow-lg group/trust"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#F4B740]/20 border border-[#F4B740]/40 flex items-center justify-center text-[#F4B740] shrink-0 mt-0.5 group-hover/trust:bg-[#F4B740]/30 transition-colors">
                    <BadgePercent size={22} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-sm tracking-wide">
                      No Hidden Charges
                    </h4>
                    <ul className="mt-1.5 space-y-1 text-xs text-emerald-100/85">
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F4B740] shrink-0" />
                        Transparent Pricing Guaranteed
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F4B740] shrink-0" />
                        Commission Clearly Mentioned
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Hero Image Card: Scales in with floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative mt-6 lg:mt-0"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="overflow-hidden rounded-3xl border-4 border-white/15 shadow-2xl bg-emerald-950/40">
                  <motion.img
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.6, ease: 'easeOut' }}
                    src={heroImage}
                    alt="Luxury architectural residence by PrimeVista"
                    className="w-full h-[280px] sm:h-[360px] lg:h-[420px] object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Floating card indicator: Staggers in at 1.35s */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs p-3.5 sm:p-4 rounded-2xl bg-white text-[#1F2937] shadow-xl border border-gray-100 flex items-center gap-3"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-[#0F4C3A] shrink-0">
                    <Building2 size={22} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      Verified Portfolio
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-[#0F4C3A] leading-tight">
                      Better Spaces for Your Future
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
