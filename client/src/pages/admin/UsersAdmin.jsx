import React, { useState, useEffect } from 'react'
import { UserCheck, Plus, Shield, UserX, CheckCircle2, X } from 'lucide-react'
import { api } from '../../api/client.js'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { formatDate } from '../../utils/formatters.js'
import { FALLBACK_STAFF_USERS } from '../../data/fallbackData.js'

export function UsersAdmin() {
  const { showToast } = useToast()
  const [users, setUsers] = useState(FALLBACK_STAFF_USERS)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  })

  const loadUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/auth/users')
      if (res.success && Array.isArray(res.users) && res.users.length > 0) {
        setUsers(res.users)
      } else {
        setUsers(FALLBACK_STAFF_USERS)
      }
    } catch (err) {
      console.warn('Backend not reached, showing default staff users', err)
      setUsers(FALLBACK_STAFF_USERS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/users', formData)
      if (res.success) {
        showToast('New staff user created!', 'success')
        setModalOpen(false)
        setFormData({ name: '', email: '', password: '', role: 'admin' })
        loadUsers()
      }
    } catch (err) {
      // Local fallback for preview
      const newUser = {
        _id: 'usr-' + Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        active: true,
        createdAt: new Date().toISOString(),
      }
      setUsers((prev) => [newUser, ...prev])
      showToast('Staff user created (Preview mode)', 'success')
      setModalOpen(false)
      setFormData({ name: '', email: '', password: '', role: 'admin' })
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/auth/users/${id}/toggle-status`)
      if (res.success) {
        showToast(res.message, 'success')
        loadUsers()
      }
    } catch (err) {
      // Local toggle fallback for preview
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, active: !u.active } : u))
      )
      showToast('Staff status updated (Preview mode)', 'success')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                Super Admin Clearance
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937] font-['Poppins'] mt-1">
              Staff & User Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Create and manage administrative staff, grant role privileges, and toggle active logins.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0A3629] text-white text-xs font-bold shadow-lg shadow-[#0F4C3A]/20 transition-all shrink-0 cursor-pointer"
          >
            <Plus size={18} className="text-[#F4B740]" />
            <span>Create Staff Account</span>
          </button>
        </div>

        {/* Mobile Staff Cards (< 768px / md:hidden) */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            users.map((usr) => (
              <div
                key={usr._id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-gray-900 font-['Poppins'] text-sm">
                      {usr.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">{usr.email}</p>
                  </div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      usr.role === 'super_admin'
                        ? 'bg-emerald-100 text-[#0F4C3A]'
                        : usr.role === 'admin'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {usr.role.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        usr.active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {usr.active ? 'Active' : 'Deactivated'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Added: {formatDate(usr.createdAt)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(usr._id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      usr.active
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {usr.active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Users Table (>= 768px / hidden md:block) */}
        <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-[#F5F7F5] border-b border-gray-100 text-gray-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-5">Staff Name</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4">Role & Scope</th>
                  <th className="py-4 px-4">Account Status</th>
                  <th className="py-4 px-4">Created Date</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-400">
                      Loading staff database...
                    </td>
                  </tr>
                ) : (
                  users.map((usr) => (
                    <tr key={usr._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-gray-900 font-['Poppins']">
                        {usr.name}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">
                        {usr.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            usr.role === 'super_admin'
                              ? 'bg-emerald-100 text-[#0F4C3A]'
                              : usr.role === 'admin'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {usr.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            usr.active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {usr.active ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {formatDate(usr.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(usr._id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            usr.active
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {usr.active ? 'Deactivate' : 'Activate'}
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

      {/* Create User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100">
            <div className="bg-[#0F4C3A] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold font-['Poppins']">Create Staff Account</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-600 mb-1">Staff Member Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="staff@primevista.com"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Temporary Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Assigned Access Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none bg-white"
                >
                  <option value="admin">Admin (Properties, Inquiries, CMS)</option>
                  <option value="agent">Agent (Assigned Inquiries only)</option>
                  <option value="super_admin">Super Admin (Full System & User Control)</option>
                </select>
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
