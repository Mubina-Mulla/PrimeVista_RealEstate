import React from 'react'
import { Link } from 'react-router-dom'
import { House, Building2, KeyRound, Compass, FileCheck, Landmark, ArrowRight, ShieldCheck } from 'lucide-react'

export function Services() {
  const servicesList = [
    {
      icon: <House size={32} />,
      title: 'Residential Property Acquisition',
      tag: 'For Buyers & Families',
      desc: 'Exclusive access to premier gated communities, standalone luxury villas, and sky penthouses across Bangalore, Mumbai, Pune, and Hyderabad. Full support with valuation, price negotiations, and title registration.',
      points: ['Curated shortlisting tailored to your lifestyle', 'Clear title verification by real estate attorneys', 'Bank loan coordination and zero-brokerage on new projects'],
      link: '/properties?purpose=Buy',
      actionText: 'Browse Homes for Sale',
    },
    {
      icon: <Building2 size={32} />,
      title: 'Commercial & Office Leasing',
      tag: 'For Corporate & Startups',
      desc: 'Plug-and-play Grade-A corporate offices, bare shell IT/ITES floor plates, and flagship high-street retail stores in Central Business Districts.',
      points: ['Workplace sizing and seating optimization', 'Lease term negotiation and lock-in advisory', 'Complete compliance and landlord verification'],
      link: '/properties?category=Office',
      actionText: 'Explore Commercial Spaces',
    },
    {
      icon: <KeyRound size={32} />,
      title: 'Luxury Rentals & Expatriate Relocation',
      tag: 'For Tenants & Corporates',
      desc: 'Furnished luxury penthouses and serviced homes for senior corporate executives, consulate members, and relocated families.',
      points: ['Move-in ready residences with premium interiors', 'Automated rental agreements and deposit safekeeping', 'Dedicated tenant onboarding concierge'],
      link: '/properties?purpose=Rent',
      actionText: 'Browse Rental Properties',
    },
    {
      icon: <Compass size={32} />,
      title: 'Strategic Real Estate Advisory',
      tag: 'For High Net-Worth Investors',
      desc: 'Private portfolio construction focusing on high-growth plotted developments, pre-launch institutional pricing, and commercial yield assets.',
      points: ['Projected rental yield and appreciation models', 'Exit strategy planning and resale management', 'Direct developer negotiations'],
      link: '/contact',
      actionText: 'Schedule Consultation',
    },
    {
      icon: <FileCheck size={32} />,
      title: 'Legal Title & Due Diligence',
      tag: 'Risk Mitigation',
      desc: 'Comprehensive 30-year search report, encumbrance certificates, master plan approvals, and mutation documentation verification.',
      points: ['In-depth municipal approval inspection', 'Clear ownership chain verification', 'Protection against disputed parcels'],
      link: '/contact',
      actionText: 'Request Legal Verification',
    },
    {
      icon: <Landmark size={32} />,
      title: 'Home Loan & Mortgage Assistance',
      tag: 'Financial Solutions',
      desc: 'Preferred tie-ups with leading nationalized and private banking institutions for rapid approvals and preferential interest rate brackets.',
      points: ['Pre-approved loan assessment within 24 hours', 'Lowest competitive floating and fixed interest options', 'Doorstep document pickup and processing'],
      link: '/contact',
      actionText: 'Apply for Mortgage Assistance',
    },
  ]

  return (
    <div className="min-h-screen bg-[#F5F7F5] py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C3A]">
            Comprehensive Capabilities
          </span>
          <h1 className="mt-2 text-4xl sm:text-5xl font-black text-[#1F2937] font-['Poppins']">
            Our Real Estate Services
          </h1>
          <p className="mt-4 text-base text-gray-600 leading-relaxed font-normal">
            Whether you are purchasing your flagship family villa or leasing corporate headquarters, PrimeVista provides end-to-end guidance with zero ambiguity.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((srv) => (
            <div
              key={srv.title}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0F4C3A] flex items-center justify-center mb-6">
                  {srv.icon}
                </div>
                <span className="text-[11px] font-bold text-[#F4B740] uppercase tracking-wider block mb-1">
                  {srv.tag}
                </span>
                <h3 className="text-xl font-bold text-[#1F2937] font-['Poppins'] leading-snug">
                  {srv.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {srv.desc}
                </p>

                <ul className="mt-5 space-y-2 text-xs text-gray-600">
                  {srv.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C3A] shrink-0 mt-1.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-gray-100">
                <Link
                  to={srv.link}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0F4C3A] hover:text-[#0A3629]"
                >
                  <span>{srv.actionText}</span>
                  <ArrowRight size={14} className="text-[#F4B740]" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#0F4C3A] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#F4B740] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck size={16} />
              <span>Certified Integrity</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Poppins']">
              Need Custom Real Estate Consulting?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 mt-2 max-w-xl">
              Speak directly with our senior partners regarding private land parcels or institutional pre-leases.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-8 py-3.5 rounded-xl bg-[#F4B740] text-[#0F4C3A] font-bold text-sm shadow-lg hover:bg-[#e2a630] transition-all shrink-0"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </div>
  )
}
