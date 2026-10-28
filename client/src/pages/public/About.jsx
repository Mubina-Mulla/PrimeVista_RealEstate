import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Award, Heart, CheckCircle2, ArrowRight, Building2, Users } from 'lucide-react'
import { api } from '../../api/client.js'

export function About() {
  const [content, setContent] = useState(null)

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await api.get('/content/about')
        if (res.success && res.data) {
          setContent(res.data.sections)
        }
      } catch (err) {
        // Fallback default content
      }
    }
    fetchAbout()
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F7F5] py-8 sm:py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-16">
        {/* Header Hero */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C3A]">
            About PrimeVista
          </span>
          <h1 className="mt-2 text-3xl sm:text-5xl font-black text-[#1F2937] font-['Poppins'] leading-tight">
            Redefining Real Estate with <br />
            <span className="text-[#0F4C3A]">Integrity & Sophistication</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-gray-600 leading-relaxed font-normal">
            {content?.story ||
              'Founded with a mission to bring complete transparency and architectural prestige to the Indian real estate landscape, PrimeVista represents the standard of excellence in property advisory. We don’t just showcase listings; we curate homes where memories are built and spaces that power business dreams.'}
          </p>
        </div>

        {/* 2-Column Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85"
              alt="PrimeVista luxury headquarters"
              className="w-full h-[260px] sm:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white shadow-xs border border-gray-100">
              <h3 className="text-lg font-bold text-[#0F4C3A] font-['Poppins'] flex items-center gap-2">
                <Award size={20} className="text-[#F4B740]" />
                Our Mission
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {content?.mission ||
                  'To empower property seekers and corporate clients with verified, high-yield, aesthetically brilliant real estate choices backed by complete legal clarity.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white shadow-xs border border-gray-100">
              <h3 className="text-lg font-bold text-[#0F4C3A] font-['Poppins'] flex items-center gap-2">
                <Heart size={20} className="text-[#F4B740]" />
                Our Vision
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {content?.vision ||
                  'To become India’s most trusted real estate consultancy known for integrity, customer-first service, and technological innovation.'}
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] font-['Poppins']">
              Our Guiding Principles
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Every interaction and listing is held to these non-negotiable standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {[
              {
                title: 'Zero Compromise Transparency',
                desc: '100% verified documentation and clear title deeds for all listings without hidden charges.',
              },
              {
                title: 'Curated Elegance',
                desc: 'Every property is hand-inspected for build quality, ventilation, and premium design.',
              },
              {
                title: 'End-to-End Concierge',
                desc: 'From the first site inspection to key handover and registry, we stand beside you.',
              },
            ].map((val) => (
              <div key={val.title} className="p-5 sm:p-8 rounded-2xl bg-white shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0F4C3A] flex items-center justify-center mb-4">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-base font-bold text-gray-900 font-['Poppins']">{val.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-[#0F4C3A] rounded-3xl p-6 sm:p-12 text-white text-center flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-black font-['Poppins']">
            Meet the Specialists Behind PrimeVista
          </h2>
          <p className="text-sm text-emerald-100 max-w-lg mt-2">
            Our certified property advisors bring decades of collective experience in luxury residential, commercial leases, and land acquisition.
          </p>
          <Link
            to="/agents"
            className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#F4B740] text-[#0F4C3A] font-bold text-sm shadow-lg hover:bg-[#e2a630] transition-all"
          >
            <span>View Our Team Profiles</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
