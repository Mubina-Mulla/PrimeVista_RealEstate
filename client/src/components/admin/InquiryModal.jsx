import React, { useState } from 'react'
import { X, Calendar, Clock, Phone, Mail, Building2, User, Send, CheckCircle2 } from 'lucide-react'
import { api } from '../../api/client.js'
import { useToast } from '../../context/ToastContext.jsx'
import { formatDate, INQUIRY_STATUS_COLORS } from '../../utils/formatters.js'

export function AdminInquiryModal({ isOpen, onClose, inquiry, onUpdated, agents = [] }) {
  const { showToast } = useToast()
  if (!isOpen || !inquiry) return null

  const [status, setStatus] = useState(inquiry.status || 'New')
  const [assignedAgent, setAssignedAgent] = useState(inquiry.assignedAgent?._id || '')
  const [followUpDate, setFollowUpDate] = useState(
    inquiry.followUpDate ? new Date(inquiry.followUpDate).toISOString().split('T')[0] : ''
  )
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (e) => {
    const newStat = e.target.value
    setStatus(newStat)
    try {
      const res = await api.patch(`/inquiries/${inquiry._id}/status`, {
        status: newStat,
      })
      if (res.success) {
        showToast(`Inquiry status updated to ${newStat}`, 'success')
        onUpdated()
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error')
    }
  }

  const handleAgentChange = async (e) => {
    const agentId = e.target.value
    setAssignedAgent(agentId)
    try {
      const res = await api.patch(`/inquiries/${inquiry._id}/assign`, {
        agentId,
      })
      if (res.success) {
        showToast('Agent assigned successfully', 'success')
        onUpdated()
      }
    } catch (err) {
      showToast(err.message || 'Failed to assign agent', 'error')
    }
  }

  const handleSaveFollowUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.patch(`/inquiries/${inquiry._id}/follow-up`, {
        followUpDate: followUpDate || null,
        notes: newNote.trim() || undefined,
      })
      if (res.success) {
        showToast('Follow-up and notes updated', 'success')
        setNewNote('')
        onUpdated()
      }
    } catch (err) {
      showToast(err.message || 'Failed to update follow-up', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0F4C3A] text-white p-6 relative flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F4B740]">
              Inquiry Dossier
            </span>
            <h3 className="text-xl font-bold font-['Poppins']">
              {inquiry.customerName}
            </h3>
            <p className="text-xs text-emerald-200 mt-0.5">
              Source: {inquiry.source || 'Website'} • Created on {formatDate(inquiry.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Top Status & Assignment Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F5F7F5] border border-gray-200">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Pipeline Status
              </label>
              <select
                value={status}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 font-bold text-[#0F4C3A] bg-white focus:outline-none"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Converted">Converted (Closed Won)</option>
                <option value="Closed-Lost">Closed-Lost</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Assigned Specialist
              </label>
              <select
                value={assignedAgent}
                onChange={handleAgentChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 font-semibold text-gray-800 bg-white focus:outline-none"
              >
                <option value="">Unassigned</option>
                {agents.map((ag) => (
                  <option key={ag._id} value={ag._id}>
                    {ag.name} ({ag.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer & Inquiry Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Contact Information
              </span>
              <div className="flex items-center gap-2 text-gray-800 font-semibold">
                <Phone size={14} className="text-[#0F4C3A]" />
                <a href={`tel:${inquiry.phone}`} className="hover:underline">
                  {inquiry.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-800 font-semibold">
                <Mail size={14} className="text-[#0F4C3A]" />
                <a href={`mailto:${inquiry.email}`} className="hover:underline">
                  {inquiry.email}
                </a>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Linked Property
              </span>
              {inquiry.property ? (
                <div>
                  <p className="font-bold text-gray-900 leading-snug">{inquiry.propertyTitle}</p>
                  <p className="text-gray-500 font-mono mt-0.5">{inquiry.propertyId}</p>
                </div>
              ) : (
                <p className="text-gray-500 font-medium">{inquiry.propertyTitle || 'General Inquiry'}</p>
              )}
            </div>
          </div>

          {/* Preferred Site Visit Slot if any */}
          {inquiry.preferredDate && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar size={18} className="text-amber-700" />
                <div>
                  <p className="font-bold text-amber-900">Requested Site Visit Slot</p>
                  <p className="text-amber-700">
                    {formatDate(inquiry.preferredDate)} • {inquiry.preferredTime || 'Flexible'}
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-200/60 text-amber-900 font-bold">
                Tour Booking
              </span>
            </div>
          )}

          {/* Customer Message */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Customer Message
            </span>
            <p className="text-gray-800 leading-relaxed font-normal whitespace-pre-line text-xs sm:text-sm">
              "{inquiry.message}"
            </p>
          </div>

          {/* Follow-up Scheduler & Internal Notes Form */}
          <form onSubmit={handleSaveFollowUp} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3">
            <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider block">
              Schedule Follow-up & Add Internal Note
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 font-bold mb-1">Next Follow-up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Add Activity Note</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="e.g. Spoke with client, requested loan docs..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-[#0F4C3A] hover:bg-[#0A3629] text-white font-bold shrink-0 disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            {inquiry.internalNotes && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Previous Notes:</span>
                <p className="text-gray-600 text-xs whitespace-pre-line bg-[#F5F7F5] p-2.5 rounded-lg">
                  {inquiry.internalNotes}
                </p>
              </div>
            )}
          </form>

          {/* Activity History Timeline */}
          {inquiry.activityLog && inquiry.activityLog.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-3">
                Audit & Activity Timeline
              </span>
              <div className="space-y-2 border-l-2 border-emerald-100 pl-4 ml-2">
                {inquiry.activityLog.map((log, i) => (
                  <div key={i} className="text-xs relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#0F4C3A]" />
                    <p className="font-bold text-gray-900">
                      {log.action}{' '}
                      <span className="font-normal text-gray-500">by {log.performedBy}</span>
                    </p>
                    <p className="text-gray-500 text-[11px]">{log.details}</p>
                    <span className="text-[10px] text-gray-400">{formatDate(log.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
