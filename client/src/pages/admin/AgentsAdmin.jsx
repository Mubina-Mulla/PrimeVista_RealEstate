import React, { useState, useEffect } from 'react'
import { Users, Plus, Edit, Trash2, Phone, Mail, Award, X, AlertCircle } from 'lucide-react'
import { api } from '../../api/client.js'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { FALLBACK_AGENTS } from '../../data/fallbackData.js'
import { validateName, validatePhone, validateEmail } from '../../utils/validators.js'

export function AgentsAdmin() {
  const { showToast } = useToast()

  const [agents, setAgents] = useState(FALLBACK_AGENTS)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState(null)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    role: 'Senior Property Advisor',
    email: '',
    phone: '',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    description: '',
    experience: '5+ Years',
    active: true,
  })

  const loadAgents = async () => {
    try {
      setLoading(true)
      const res = await api.get('/agents/admin/all')
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setAgents(res.data)
      } else {
        setAgents(FALLBACK_AGENTS)
      }
    } catch (err) {
      console.warn('Backend not reached, showing default agents', err)
      setAgents(FALLBACK_AGENTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAgents()
  }, [])

  const handleOpenModal = (agent = null) => {
    setErrors({})
    if (agent) {
      setEditingAgent(agent)
      setFormData({
        name: agent.name || '',
        role: agent.role || '',
        email: agent.email || '',
        phone: agent.phone || '',
        photo: agent.photo || '',
        description: agent.description || '',
        experience: agent.experience || '',
        active: agent.active ?? true,
      })
    } else {
      setEditingAgent(null)
      setFormData({
        name: '',
        role: 'Senior Property Advisor',
        email: '',
        phone: '',
        photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
        description: '',
        experience: '5+ Years',
        active: true,
      })
    }
    setModalOpen(true)
  }

  const validateField = (field, value) => {
    if (field === 'name') return validateName(value, 'Full name')
    if (field === 'role') {
      if (!value?.trim()) return 'Role / Designation is required'
      if (value.trim().length < 2) return 'Role must be at least 2 characters'
      return null
    }
    if (field === 'phone') return validatePhone(value, 'Phone number')
    if (field === 'email') return validateEmail(value, 'Email address')
    return null
  }

  const handleBlur = (field) => {
    const errorMsg = validateField(field, formData[field])
    setErrors((prev) => ({ ...prev, [field]: errorMsg }))
  }

  const validate = () => {
    const errs = {
      name: validateName(formData.name, 'Full name'),
      role: !formData.role?.trim() ? 'Role / Designation is required' : null,
      phone: validatePhone(formData.phone, 'Phone number'),
      email: validateEmail(formData.email, 'Email address'),
    }

    Object.keys(errs).forEach((key) => {
      if (!errs[key]) delete errs[key]
    })

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      showToast('Please fix highlighted errors', 'error')
      return
    }

    try {
      if (editingAgent) {
        await api.put(`/agents/${editingAgent._id}`, formData)
        showToast('Agent profile updated', 'success')
      } else {
        await api.post('/agents', formData)
        showToast('New agent added to team', 'success')
      }
      setModalOpen(false)
      loadAgents()
    } catch (err) {
      // Local fallback for preview
      if (editingAgent) {
        setAgents((prev) =>
          prev.map((a) => (a._id === editingAgent._id ? { ...a, ...formData } : a))
        )
        showToast('Agent profile updated (Preview mode)', 'success')
      } else {
        const newAgent = {
          _id: 'agent-' + Date.now(),
          ...formData,
          propertiesListed: 0,
        }
        setAgents((prev) => [newAgent, ...prev])
        showToast('New agent added to team (Preview mode)', 'success')
      }
      setModalOpen(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return
    try {
      await api.del(`/agents/${id}`)
      showToast('Agent deleted', 'success')
      loadAgents()
    } catch (err) {
      setAgents((prev) => prev.filter((a) => a._id !== id))
      showToast('Agent removed (Preview mode)', 'success')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937] font-['Poppins']">
              Agent & Specialist Roster
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage licensed advisors assigned to customer inquiries and properties.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0A3629] text-white text-xs font-bold shadow-lg shadow-[#0F4C3A]/20 transition-all shrink-0 cursor-pointer"
          >
            <Plus size={18} className="text-[#F4B740]" />
            <span>Add New Agent</span>
          </button>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {loading ? (
            <p className="text-xs text-gray-400">Loading agents...</p>
          ) : (
            agents.map((ag) => (
              <div
                key={ag._id}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <img
                      src={ag.photo}
                      alt={ag.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 font-['Poppins'] truncate">{ag.name}</h4>
                      <p className="text-xs font-semibold text-[#0F4C3A]">{ag.role}</p>
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 mt-1">
                        {ag.experience}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-gray-600 line-clamp-2">
                    {ag.description || 'Specialist in luxury residential properties.'}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-[#0F4C3A]" />
                      <span>{ag.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-[#0F4C3A]" />
                      <span className="truncate">{ag.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ag.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {ag.active ? 'Active Status' : 'Inactive'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(ag)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#0F4C3A] hover:bg-emerald-50"
                      title="Edit Agent"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(ag._id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Agent"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Agent Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100">
            <div className="bg-[#0F4C3A] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold font-['Poppins']">
                {editingAgent ? 'Edit Agent Profile' : 'Add New Agent'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const val = e.target.value
                    setFormData((prev) => ({ ...prev, name: val }))
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: validateField('name', val) }))
                    }
                  }}
                  onBlur={() => handleBlur('name')}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition-colors ${
                    errors.name ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle size={11} /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Role / Designation *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => {
                    const val = e.target.value
                    setFormData((prev) => ({ ...prev, role: val }))
                    if (errors.role) {
                      setErrors((prev) => ({ ...prev, role: validateField('role', val) }))
                    }
                  }}
                  onBlur={() => handleBlur('role')}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition-colors ${
                    errors.role ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200'
                  }`}
                />
                {errors.role && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle size={11} /> {errors.role}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value
                      setFormData((prev) => ({ ...prev, phone: val }))
                      if (errors.phone) {
                        setErrors((prev) => ({ ...prev, phone: validateField('phone', val) }))
                      }
                    }}
                    onBlur={() => handleBlur('phone')}
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition-colors ${
                      errors.phone ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle size={11} /> {errors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Experience</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    const val = e.target.value
                    setFormData((prev) => ({ ...prev, email: val }))
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: validateField('email', val) }))
                    }
                  }}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition-colors ${
                    errors.email ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle size={11} /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Bio / Expertise</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="agentActive"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0F4C3A]"
                />
                <label htmlFor="agentActive" className="font-bold text-gray-700">
                  Active (Available for inquiry assignments)
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F4C3A] text-white font-bold"
                >
                  Save Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
