import React from 'react'
import { Link } from 'react-router-dom'
import { House, ArrowLeft, Search } from 'lucide-react'

export function NotFound() {
  return (
    <div className="min-h-[75vh] bg-[#F5F7F5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-gray-100 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#0F4C3A] flex items-center justify-center mx-auto shadow-inner">
          <House size={32} className="text-[#F4B740]" />
        </div>

        <div>
          <span className="text-6xl font-black text-[#0F4C3A] font-['Poppins']">404</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-2 font-['Poppins']">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            The property or page you are looking for may have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F4C3A] text-white text-xs font-bold shadow-md hover:bg-[#0A3629]"
          >
            <House size={16} />
            <span>Go to Homepage</span>
          </Link>

          <Link
            to="/properties"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50"
          >
            <Search size={16} />
            <span>Browse Properties</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
