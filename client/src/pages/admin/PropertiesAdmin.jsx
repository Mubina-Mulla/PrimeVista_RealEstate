import React, { useState, useEffect } from 'react'
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'
import { api } from '../../api/client.js'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { PropertyModal } from '../../components/admin/PropertyModal.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { formatPrice, PROPERTY_STATUS_COLORS } from '../../utils/formatters.js'

export function PropertiesAdmin() {
  const { showToast } = useToast()

  const [properties, setProperties] = useState([])
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [purposeFilter, setPurposeFilter] = useState('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const loadProperties = async () => {
    try {
      setLoading(true)
      const query = new URLSearchParams()
      if (search.trim()) query.set('search', search.trim())
      if (statusFilter !== 'all') query.set('status', statusFilter)
      if (categoryFilter !== 'all') query.set('category', categoryFilter)
      if (purposeFilter !== 'all') query.set('purpose', purposeFilter)

      const [propsRes, agentsRes] = await Promise.all([
        api.get(`/properties/admin/all?${query.toString()}`),
        api.get('/agents'),
      ])

      if (propsRes.success) setProperties(propsRes.data || [])
      if (agentsRes.success) setAgents(agentsRes.data || [])
    } catch (err) {
      showToast(err.message || 'Failed to load properties', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [search, statusFilter, categoryFilter, purposeFilter])

  const handleQuickStatus = async (id, newStatus) => {
    try {
      const res = await api.patch(`/properties/${id}/status`, { status: newStatus })
      if (res.success) {
        showToast(`Status updated to '${newStatus}'`, 'success')
        loadProperties()
      }
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await api.del(`/properties/${id}`)
      if (res.success) {
        showToast('Property deleted successfully', 'success')
        setDeleteConfirmId(null)
        loadProperties()
      }
    } catch (err) {
      showToast(err.message || 'Deletion failed', 'error')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937] font-['Poppins']">
              Property Inventory
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Add, edit, publish, archive and manage luxury property records.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingProperty(null)
              setModalOpen(true)
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0A3629] text-white text-xs font-bold shadow-lg shadow-[#0F4C3A]/20 transition-all cursor-pointer shrink-0"
          >
            <Plus size={18} className="text-[#F4B740]" />
            <span>Add New Property</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, ID, locality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0F4C3A]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft (Unpublished)</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none bg-white"
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

          {/* Purpose Filter */}
          <div className="flex items-center gap-2">
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none bg-white"
            >
              <option value="all">All Purposes (Buy & Rent)</option>
              <option value="Buy">For Sale</option>
              <option value="Rent">For Rent</option>
            </select>

            <button
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
                setCategoryFilter('all')
                setPurposeFilter('all')
              }}
              title="Reset Filters"
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors shrink-0"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7F5] border-b border-gray-100 text-gray-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-5">Property</th>
                  <th className="py-4 px-4">Ref Code</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Locality / City</th>
                  <th className="py-4 px-4">Publication Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-400">
                      Loading property database...
                    </td>
                  </tr>
                ) : properties.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-400">
                      No properties found matching your filter.
                    </td>
                  </tr>
                ) : (
                  properties.map((prop) => (
                    <tr key={prop._id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Image & Title */}
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.coverImage}
                            alt={prop.title}
                            className="w-12 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <span className="font-bold text-gray-900 block truncate font-['Poppins']">
                              {prop.title}
                            </span>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              {prop.purpose === 'Buy' ? 'For Sale' : 'For Rent'} • {prop.area} sq.ft
                              {prop.featured && (
                                <span className="inline-flex items-center text-[#F4B740] font-bold">
                                  ★ Featured
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="py-3 px-4 font-mono font-bold text-[#0F4C3A]">
                        {prop.propertyId}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 font-medium text-gray-700">
                        {prop.category}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-gray-900 font-['Poppins']">
                        {formatPrice(prop.price, prop.purpose, prop.rentalPeriod)}
                      </td>

                      {/* Locality */}
                      <td className="py-3 px-4 text-gray-600">
                        {prop.locality}, {prop.city}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3 px-4">
                        <select
                          value={prop.status}
                          onChange={(e) => handleQuickStatus(prop._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border capitalize cursor-pointer focus:outline-none ${
                            PROPERTY_STATUS_COLORS[prop.status] || 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="sold">Sold</option>
                          <option value="rented">Rented</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProperty(prop)
                              setModalOpen(true)
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-[#0F4C3A] hover:bg-emerald-50 transition-colors"
                            title="Edit Listing"
                          >
                            <Edit size={16} />
                          </button>

                          {deleteConfirmId === prop._id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(prop._id)}
                                className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 rounded bg-gray-200 text-gray-700 text-[10px]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(prop._id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Listing"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <PropertyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        property={editingProperty}
        onSaved={loadProperties}
        agents={agents}
      />
    </AdminLayout>
  )
}
