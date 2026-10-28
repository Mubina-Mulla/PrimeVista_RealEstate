import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Quote, Building2, Award, CheckCircle2, ArrowRight } from 'lucide-react'

export function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: 'Rajesh & Malini Iyer',
      designation: 'Senior Vice President, Cloud Solutions',
      property: 'The Palm Heights, Indiranagar',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      headline: 'Flawless legal verification and bespoke penthouse luxury.',
      feedback:
        'Purchasing our top-floor sky deck residence was the biggest milestone of our lives. The legal diligence team at PrimeVista gave us absolute confidence with title checks going back 30 years. Vikram handled our site visits effortlessly and negotiated transparent terms with zero ambiguity. A truly world-class experience.',
      year: 'Purchased 2026',
    },
    {
      id: 2,
      name: 'Kavita Menon',
      designation: 'Managing Director, Horizon FinTech',
      property: 'Prime Corporate Plaza, BKC Mumbai',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      headline: 'Secured 65-seat Grade-A office in BKC in record time.',
      feedback:
        'Expanding our Mumbai engineering headquarters was critical. Ananya Sen presented three verified options within 48 hours and helped finalize our lease within 2 weeks. The space was plug-and-play and perfectly sized. Their commercial leasing desk is unmatched in speed and professionalism.',
      year: 'Leased 2026',
    },
    {
      id: 3,
      name: 'Dr. Siddharth & Dr. Sunita Verma',
      designation: 'Consultant Surgeons, Manipal Hospital',
      property: 'Greenwood Meadows 3BHK Villa, Whitefield',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      headline: 'Found peaceful tranquility for our family.',
      feedback:
        'PrimeVista’s curated property collection saved us endless hours of scrolling through misleading aggregator portals. Everything is accurately photographed, verified on-ground, and matched to reality. Our children love the landscaped gardens and private pool.',
      year: 'Purchased 2025',
    },
    {
      id: 4,
      name: 'Arjun Deshmukh',
      designation: 'Founder & CEO, Apex Retail Brands',
      property: 'Grand Galleria Retail Corner, Golf Course Road',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      headline: 'High-footfall commercial investment yielding 8.2% ROI.',
      feedback:
        'Pooja Hegde helped us model projected foot traffic and retail lease yields with complete precision. The property was bank-approved and registration was completed smoothly in 10 days.',
      year: 'Purchased 2026',
    },
    {
      id: 5,
      name: 'Suresh & Preeti Nambiar',
      designation: 'Expatriate Director, Singapore Tech Hub',
      property: 'Skyline Horizon Sea-Facing Flat, Worli Mumbai',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      headline: 'Seamless remote purchase while relocating to India.',
      feedback:
        'Relocating to Mumbai from abroad seemed daunting until we connected with PrimeVista. They provided 360-degree virtual inspections, coordinated documentation via courier, and welcomed us at the airport with the keys ready.',
      year: 'Purchased 2026',
    },
    {
      id: 6,
      name: 'Vikram Malhotra',
      designation: 'Managing Partner, Zenith Legal Associates',
      property: 'Serene Woods Estate, Jubilee Hills Hyderabad',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      headline: 'Top-tier executive guest house lease for our partners.',
      feedback:
        'The Jubilee Hills villa has set a benchmark for our international corporate visitors. Beautifully maintained colonial architecture with impeccable privacy and prompt property management.',
      year: 'Leased 2026',
    },
  ]

  return (
    <div className="min-h-screen bg-[#F5F7F5] py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C3A]">
            Client Success & Stories
          </span>
          <h1 className="mt-2 text-4xl sm:text-5xl font-black text-[#1F2937] font-['Poppins']">
            What Our Clients Say
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Read authentic feedback from high-net-worth families, expatriates, and corporate enterprises who discovered their prime spaces through PrimeVista.
          </p>

          <div className="mt-6 inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-white shadow-xs border border-gray-200 text-xs font-bold text-gray-800">
            <div className="flex items-center gap-1 text-[#F4B740]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="fill-[#F4B740]" />
              ))}
            </div>
            <span>4.9 / 5.0 Rating from 450+ Verified Transactions</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Rating Stars & Year */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#F4B740]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-[#F4B740]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    {rev.year}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 font-['Poppins'] text-base leading-snug mb-3">
                  "{rev.headline}"
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {rev.feedback}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <Building2 size={14} className="text-[#0F4C3A]" />
                  <span className="truncate">{rev.property}</span>
                </div>
              </div>

              {/* Client Profile */}
              <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-gray-100">
                <img
                  src={rev.image}
                  alt={rev.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 text-xs truncate font-['Poppins']">
                    {rev.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 truncate">{rev.designation}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Call To Action */}
        <div className="bg-[#0F4C3A] rounded-3xl p-8 sm:p-12 text-white text-center flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-black font-['Poppins']">
            Experience the PrimeVista Difference
          </h2>
          <p className="text-sm text-emerald-100 max-w-xl mt-2">
            Schedule your personalized property inspection or consultation with one of our senior specialists.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/properties"
              className="px-6 py-3 rounded-xl bg-[#F4B740] text-[#0F4C3A] font-bold text-xs shadow-md hover:bg-[#e2a630] transition-all"
            >
              Browse Signature Listings
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-xs transition-all"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
