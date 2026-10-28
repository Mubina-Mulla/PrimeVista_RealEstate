import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { House, Menu, X, User, ArrowRight } from 'lucide-react'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Our Team', path: '/agents' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#0F4C3A] flex items-center justify-center text-white shadow-md shadow-[#0F4C3A]/20 transition-transform group-hover:scale-105">
            <House size={22} className="text-[#F4B740]" />
          </div>
          <div>
            <span className="block text-2xl font-bold tracking-tight text-[#0F4C3A] leading-none font-['Poppins']">
              PrimeVista
            </span>
            <span className="block text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mt-0.5">
              Real Estate
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-[#0F4C3A] relative py-1 ${
                isActive(link.path)
                  ? 'text-[#0F4C3A] font-semibold'
                  : 'text-gray-600'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F4C3A] rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right CTA and Staff Login (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:text-[#0F4C3A] hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
          >
            <User size={15} />
            <span>Staff Login</span>
          </Link>

          <Link
            to="/properties"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F4C3A] text-white text-sm font-semibold shadow-md shadow-[#0F4C3A]/20 hover:bg-[#0A3629] transition-all hover:shadow-lg"
          >
            <span>Explore Properties</span>
            <ArrowRight size={16} className="text-[#F4B740]" />
          </Link>
        </div>

        {/* Mobile & Tablet Action Header Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/login"
            className="p-2 rounded-lg text-gray-600 hover:text-[#0F4C3A] hover:bg-gray-100 transition-colors"
            title="Staff Login"
          >
            <User size={20} />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile & Tablet Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200 max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-[#0F4C3A] bg-emerald-50 font-bold border-l-4 border-[#0F4C3A]'
                    : 'text-gray-700 hover:text-[#0F4C3A] hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 flex-1 p-3 rounded-xl bg-gray-100 text-gray-800 font-semibold text-sm hover:bg-gray-200"
            >
              <User size={18} />
              <span>Staff Login</span>
            </Link>

            <Link
              to="/properties"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 flex-1 p-3.5 rounded-xl bg-[#0F4C3A] text-white font-semibold text-sm shadow-md"
            >
              <span>Explore Properties</span>
              <ArrowRight size={18} className="text-[#F4B740]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
