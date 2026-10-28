import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, Phone, Mail, CheckCircle2 } from 'lucide-react'
import { api } from '../../api/client.js'
import { useToast } from '../../context/ToastContext.jsx'
import { formatDate } from '../../utils/formatters.js'

export function AdminInquiryModal({ isOpen, onClose, inquiry, onUpdated, agents = [] }) {
  const { showToast } = useToast()

  const [status, setStatus] = useState(inquiry?.status || 'New')
  const [assignedAgent, setAssignedAgent] = useState(inquiry?.assignedAgent?._id || '')
  const [followUpDate, setFollowUpDate] = useState(
    inquiry?.followUpDate ? new Date(inquiry.followUpDate).toISOString().split('T')[0] : ''
  )
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status || 'New')
      setAssignedAgent(inquiry.assignedAgent?._id || '')
      setFollowUpDate(
        inquiry.followUpDate ? new Date(inquiry.followUpDate).toISOString().split('T')[0] : ''
      )
      setNewNote('')
    }
  }, [inquiry])

  if (!isOpen || !inquiry) return null

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

  const handleQuickVisitOutcome = async (outcomeStatus, note) => {
    try {
      const res = await api.patch(`/inquiries/${inquiry._id}/status`, {
        status: outcomeStatus,
        note,
      })
      if (res.success) {
        setStatus(outcomeStatus)
        showToast(`Inquiry status updated: ${outcomeStatus}`, 'success')
        onUpdated()
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error')
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

          {/* Site Visit Management & Slot */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar size={18} className="text-amber-800" />
                <div>
                  <p className="font-bold text-amber-950">Site Visit & Property Tour</p>
                  <p className="text-xs text-amber-800">
                    {inquiry.preferredDate
                      ? `${formatDate(inquiry.preferredDate)} • Slot: ${inquiry.preferredTime || 'Flexible'}`
                      : 'No specific date requested by customer'}
                  </p>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                status === 'Site Visit Scheduled'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-200/60 text-amber-900'
              }`}>
                {status === 'Site Visit Scheduled' ? 'Visit Scheduled' : status}
              </span>
            </div>

            {/* Quick Site Visit Action Buttons */}
            <div className="pt-2 border-t border-amber-200/60 flex flex-wrap gap-2">
              {status !== 'Site Visit Scheduled' && (
                <button
                  type="button"
                  onClick={() => handleQuickVisitOutcome('Site Visit Scheduled', 'Site visit confirmed and scheduled with customer.')}
                  className="px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] transition-colors"
                >
                  Schedule Site Visit
                </button>
              )}
              <button
                type="button"
                onClick={() => handleQuickVisitOutcome('Qualified', 'Site visit successfully completed. Client showed high interest.')}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition-colors flex items-center gap-1"
              >
                <CheckCircle2 size={12} />
                <span>Mark Visit Completed</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickVisitOutcome('Contacted', 'Client cancelled / was unable to attend the scheduled site visit.')}
                className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold text-[11px] transition-colors"
              >
                Client No-Show / Cancelled
              </button>
            </div>
          </div>

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
