import React, { useState, useEffect } from 'react'
import {
  Inbox,
  Search,
  Filter,
  Calendar,
  Phone,
  Mail,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
} from 'lucide-react'
import { api } from '../../api/client.js'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { AdminInquiryModal } from '../../components/admin/InquiryModal.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { formatDate, INQUIRY_STATUS_COLORS } from '../../utils/formatters.js'
import { FALLBACK_INQUIRIES, FALLBACK_AGENTS } from '../../data/fallbackData.js'

export function InquiriesAdmin() {
  const { showToast } = useToast()

  const [inquiries, setInquiries] = useState(FALLBACK_INQUIRIES)
  const [agents, setAgents] = useState(FALLBACK_AGENTS)
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState(null)

  const loadInquiries = async () => {
    try {
      const query = new URLSearchParams()
      if (statusFilter !== 'all') query.set('status', statusFilter)
      if (search.trim()) query.set('search', search.trim())

      const [inqRes, agentsRes] = await Promise.all([
        api.get(`/inquiries?${query.toString()}`).catch(() => null),
        api.get('/agents').catch(() => null),
      ])

      if (inqRes?.success && Array.isArray(inqRes.data) && inqRes.data.length > 0) {
        setInquiries(inqRes.data)
      }
      if (agentsRes?.success && Array.isArray(agentsRes.data) && agentsRes.data.length > 0) {
        setAgents(agentsRes.data)
      }
    } catch (err) {
      console.warn('Backend not reached, showing default customer inquiries', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInquiries()
  }, [statusFilter, search])

  // Quick CSV Export of Leads
  const handleExportCSV = () => {
    if (!inquiries.length) {
      showToast('No inquiries to export', 'info')
      return
    }

    const headers = ['Date', 'Customer Name', 'Phone', 'Email', 'Property Ref', 'Status', 'Assigned Agent', 'Message']
    const rows = inquiries.map((inq) => [
      formatDate(inq.createdAt),
      `"${inq.customerName}"`,
      inq.phone,
      inq.email,
      `"${inq.propertyTitle || 'General'}"`,
      inq.status,
      `"${inq.assignedAgent?.name || 'Unassigned'}"`,
      `"${(inq.message || '').replace(/"/g, '""')}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `primevista_inquiries_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Inquiry records exported to CSV', 'success')
  }

  const pipelineStages = [
    'all',
    'New',
    'Contacted',
    'Qualified',
    'Site Visit Scheduled',
    'Negotiation',
    'Converted',
    'Closed-Lost',
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937] font-['Poppins']">
              Customer Inquiry Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Track customer inquiries, assign agents, schedule follow-ups, and record site visits.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Download size={15} />
            <span>Export Leads CSV</span>
          </button>
        </div>

        {/* Pipeline Stage Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {pipelineStages.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                statusFilter === st
                  ? 'bg-[#0F4C3A] text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0F4C3A]'
              }`}
            >
              {st === 'all' ? 'All Inquiries' : st}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, email, phone, or property..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0F4C3A]"
            />
          </div>

          <span className="text-xs font-semibold text-gray-500 hidden sm:inline">
            Showing {inquiries.length} inquiries
          </span>
        </div>

        {/* Mobile Card View (< 768px / md:hidden) */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : inquiries.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
              <Inbox size={36} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-semibold text-gray-700">No inquiries found</p>
              <p className="text-xs text-gray-400 mt-1">No inquiries match this stage.</p>
            </div>
          ) : (
            inquiries.map((inq) => (
              <div
                key={inq._id}
                onClick={() => setSelectedInquiry(inq)}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-gray-900 font-['Poppins'] text-sm">
                      {inq.customerName}
                    </h4>
                    <span className="text-[10px] text-gray-400">
                      Source: {inq.source || 'Website'}
                    </span>
                  </div>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize shrink-0 ${
                      INQUIRY_STATUS_COLORS[inq.status] || 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>

                {/* Property Interested */}
                <div className="bg-[#F5F7F5] rounded-xl p-2.5 text-xs">
                  <p className="text-[10px] text-gray-400 font-medium">Interested Property</p>
                  <p className="font-bold text-gray-800 line-clamp-1">{inq.propertyTitle}</p>
                  {inq.propertyId && (
                    <span className="font-mono text-[10px] font-bold text-[#0F4C3A]">
                      Ref: {inq.propertyId}
                    </span>
                  )}
                </div>

                {/* Contact row */}
                <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Phone size={13} className="text-[#0F4C3A]" />
                    <span className="font-medium">{inq.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                    <Mail size={13} className="text-[#0F4C3A] shrink-0" />
                    <span className="truncate">{inq.email}</span>
                  </div>
                </div>

                {/* Agent & Review CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {inq.assignedAgent ? (
                      <>
                        <img
                          src={inq.assignedAgent.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&q=80'}
                          alt={inq.assignedAgent.name}
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <span className="text-xs text-gray-700 font-medium truncate max-w-[120px]">
                          {inq.assignedAgent.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-amber-600 font-bold text-[10px]">Unassigned</span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedInquiry(inq)
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0F4C3A] hover:bg-emerald-100 font-bold text-xs cursor-pointer"
                  >
                    Review Lead
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Inquiries Table (>= 768px / hidden md:block) */}
        <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7F5] border-b border-gray-100 text-gray-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-5">Customer</th>
                  <th className="py-4 px-4">Contact Info</th>
                  <th className="py-4 px-4">Interested Property</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Assigned Specialist</th>
                  <th className="py-4 px-4">Date / Follow-up</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-400">
                      Loading customer inquiries...
                    </td>
                  </tr>
                ) : inquiries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-400">
                      No inquiries found in this status stage.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inq) => (
                    <tr
                      key={inq._id}
                      onClick={() => setSelectedInquiry(inq)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-gray-900 block font-['Poppins']">
                          {inq.customerName}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {inq.source || 'Website'}
                        </span>
                      </td>

                      {/* Phone & Email */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-gray-800 block">{inq.phone}</span>
                          <span className="text-gray-400 block">{inq.email}</span>
                        </div>
                      </td>

                      {/* Property */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-semibold text-gray-800 block truncate">
                          {inq.propertyTitle}
                        </span>
                        {inq.propertyId && (
                          <span className="font-mono text-[10px] font-bold text-[#0F4C3A]">
                            Ref: {inq.propertyId}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            INQUIRY_STATUS_COLORS[inq.status] || 'bg-gray-50 text-gray-700'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </td>

                      {/* Assigned Agent */}
                      <td className="py-3.5 px-4">
                        {inq.assignedAgent ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={inq.assignedAgent.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&q=80'}
                              alt={inq.assignedAgent.name}
                              className="w-6 h-6 rounded-full object-cover shrink-0"
                            />
                            <span className="font-medium text-gray-800">{inq.assignedAgent.name}</span>
                          </div>
                        ) : (
                          <span className="text-amber-600 font-bold text-[11px]">Unassigned</span>
                        )}
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 text-gray-500">
                        <div>Created: {formatDate(inq.createdAt)}</div>
                        {inq.followUpDate && (
                          <div className="text-[10px] text-purple-700 font-semibold flex items-center gap-1 mt-0.5">
                            <Clock size={11} /> Follow-up: {formatDate(inq.followUpDate)}
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedInquiry(inq)
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0F4C3A] hover:bg-emerald-100 font-bold text-xs cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      <AdminInquiryModal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        inquiry={selectedInquiry}
        onUpdated={() => {
          loadInquiries()
          setSelectedInquiry(null)
        }}
        agents={agents}
      />
    </AdminLayout>
  )
}
