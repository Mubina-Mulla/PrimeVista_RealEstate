import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search,
  Filter,
  Building2,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  MapPin,
  IndianRupee,
} from 'lucide-react'
import { api } from '../../api/client.js'
import { PropertyCard } from '../../components/public/PropertyCard.jsx'

export function Properties() {
  const [searchParams, setSearchParams] = useSearchParams()

  // State from URL query or defaults
  const [searchTerm, setSearchTerm] = useState(searchParams.get('location') || searchParams.get('search') || '')
  const [purpose, setPurpose] = useState(searchParams.get('purpose') || 'all')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'Any')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10))

  const [properties, setProperties] = useState([])
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 })
  const [loading, setLoading] = useState(true)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Fetch properties from live MongoDB API
  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true)
        const query = new URLSearchParams()
        if (searchTerm.trim()) query.set('location', searchTerm.trim())
        if (purpose && purpose !== 'all') query.set('purpose', purpose)
        if (category && category !== 'all') query.set('category', category)
        if (bedrooms && bedrooms !== 'Any') query.set('bedrooms', bedrooms)
        if (minPrice) query.set('minPrice', minPrice)
        if (maxPrice) query.set('maxPrice', maxPrice)
        if (sort) query.set('sort', sort)
        query.set('page', page.toString())
        query.set('limit', '9')

        const res = await api.get(`/properties?${query.toString()}`)
        if (res.success) {
          setProperties(res.data || [])
          setPagination(res.pagination || { total: 0, totalPages: 1, page: 1 })
        }
      } catch (err) {
        console.error('Failed to fetch properties', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [searchTerm, purpose, category, bedrooms, minPrice, maxPrice, sort, page])

  const handleResetFilters = () => {
    setSearchTerm('')
    setPurpose('all')
    setCategory('all')
    setBedrooms('Any')
    setMinPrice('')
    setMaxPrice('')
    setSort('newest')
    setPage(1)
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-[#F5F7F5] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#0F4C3A]">
            Live Verified Database
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-[#1F2937] font-['Poppins']">
            Browse Properties
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Showing {pagination.total} published properties available across prime locations.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(1)
                }}
                placeholder="Search by title, locality, city, or ID (e.g. PV-101)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F4C3A] bg-white"
              />
            </div>

            {/* Purpose & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Purpose Pill Filter */}
              <div className="inline-flex rounded-xl bg-[#F5F7F5] p-1">
                {[
                  { label: 'All', value: 'all' },
                  { label: 'Buy', value: 'Buy' },
                  { label: 'Rent', value: 'Rent' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setPurpose(item.value)
                      setPage(1)
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      purpose === item.value
                        ? 'bg-[#0F4C3A] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 hidden sm:inline">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value)
                    setPage(1)
                  }}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {/* Mobile Filter toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white"
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>
            </div>
          </div>

          {/* Secondary Filters (Desktop + Expandable Mobile) */}
          <div className={`${mobileFilterOpen ? 'block' : 'hidden'} md:block pt-4 border-t border-gray-100`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
              {/* Category */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value)
                    setPage(1)
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Office">Commercial Office</option>
                  <option value="Shop">Retail Shop</option>
                  <option value="Plot">Villa Plot</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Bedrooms
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => {
                    setBedrooms(e.target.value)
                    setPage(1)
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none bg-white"
                >
                  <option value="Any">Any Bedrooms</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5000000"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value)
                    setPage(1)
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none bg-white"
                />
              </div>

              {/* Max Price & Reset */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Max Price (₹)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="e.g. 30000000"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value)
                      setPage(1)
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none bg-white"
                  />
                  <button
                    onClick={handleResetFilters}
                    title="Reset all filters"
                    className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-[#0F4C3A] transition-colors shrink-0"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300 max-w-xl mx-auto my-12">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 font-['Poppins']">
              No matching properties found
            </h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              We couldn't find any listings matching your search criteria. Try loosening your price filters or searching a different locality.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#0F4C3A] text-white text-xs font-bold shadow-md hover:bg-[#0A3629]"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-4 py-2 text-xs font-bold text-gray-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
