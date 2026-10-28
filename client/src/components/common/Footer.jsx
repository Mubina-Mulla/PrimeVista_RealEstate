import React from 'react'
import { Link } from 'react-router-dom'
import { House, MapPin, Phone, Mail, Clock, ShieldCheck, ArrowRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#1F2937] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-10 h-10 rounded-xl bg-[#0F4C3A] flex items-center justify-center text-white shadow-md">
                <House size={22} className="text-[#F4B740]" />
              </div>
              <div>
                <span className="block text-2xl font-bold tracking-tight text-white leading-none font-['Poppins']">
                  PrimeVista
                </span>
                <span className="block text-[10px] font-semibold tracking-[0.25em] text-[#F4B740] uppercase mt-0.5">
                  Real Estate
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Better Spaces. Brighter Futures. PrimeVista connects property seekers with verified, architectural excellence across India's premier residential and commercial destinations.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
              <ShieldCheck size={18} className="text-[#F4B740]" />
              <span>100% Verified Legal Titles & Clear Ownership</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white font-['Poppins'] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F4B740]"></span>
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-[#F4B740]" /> Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-[#F4B740]" /> Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-[#F4B740]" /> About PrimeVista
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-[#F4B740]" /> Advisory & Services
                </Link>
              </li>
              <li>
                <Link to="/agents" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-[#F4B740]" /> Our Property Specialists
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-[#F4B740]" /> Client Testimonials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-[#F4B740]" /> Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white font-['Poppins'] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F4B740]"></span>
              Property Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/properties?category=Villa" className="hover:text-white transition-colors">
                  Luxury Gated Villas
                </Link>
              </li>
              <li>
                <Link to="/properties?category=Penthouse" className="hover:text-white transition-colors">
                  Sky Deck Penthouses
                </Link>
              </li>
              <li>
                <Link to="/properties?category=Apartment" className="hover:text-white transition-colors">
                  Premium Residential Flats
                </Link>
              </li>
              <li>
                <Link to="/properties?category=Office" className="hover:text-white transition-colors">
                  Grade-A Commercial Offices
                </Link>
              </li>
              <li>
                <Link to="/properties?category=Shop" className="hover:text-white transition-colors">
                  High Street Retail Shops
                </Link>
              </li>
              <li>
                <Link to="/properties?category=Plot" className="hover:text-white transition-colors">
                  Plotted Developments
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office Info */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white font-['Poppins'] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F4B740]"></span>
              Headquarters
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#F4B740] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  PrimeVista Executive Tower, Level 8, 100 Feet Road, Indiranagar, Bengaluru, 560038
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#F4B740] shrink-0" />
                <a href="tel:+918045678900" className="hover:text-white transition-colors">
                  +91 (080) 4567 8900
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#F4B740] shrink-0" />
                <a href="mailto:contact@primevista.com" className="hover:text-white transition-colors">
                  contact@primevista.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-[#F4B740] shrink-0 mt-0.5" />
                <span>Mon – Sat: 9:30 AM – 7:30 PM (Sun by appointment)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} PrimeVista Real Estate. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/faq" className="hover:text-gray-300 transition-colors">
              FAQ
            </Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">
              Contact
            </Link>
            <Link to="/login" className="hover:text-gray-300 transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
