import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { House, Lock, Mail, ShieldCheck, ArrowRight, UserCheck, KeyRound } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await login(email.trim(), password)
      showToast(`Welcome back, ${res.user.name}!`, 'success')
      navigate('/admin')
    } catch (err) {
      showToast(err.message || 'Invalid email or password', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Quick 1-click test credentials handler
  const setDemoRole = (role) => {
    if (role === 'admin') {
      setEmail('priya@primevista.com')
      setPassword('Password@123')
    } else if (role === 'agent') {
      setEmail('agent@primevista.com')
      setPassword('Password@123')
    }
  }

  return (
    <div className="min-h-[85vh] bg-[#F5F7F5] flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-100 space-y-8">
        {/* Brand header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#0F4C3A] flex items-center justify-center text-white shadow-md">
              <House size={22} className="text-[#F4B740]" />
            </div>
            <div className="text-left">
              <span className="block text-2xl font-bold tracking-tight text-[#0F4C3A] leading-none font-['Poppins']">
                PrimeVista
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mt-0.5">
                Staff Portal
              </span>
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-[#1F2937] font-['Poppins']">
            Management Login
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Enter your credentials to access properties, inquiries, and dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@primevista.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F4C3A] bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F4C3A] bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl bg-[#0F4C3A] hover:bg-[#0A3629] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0F4C3A]/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Secure Sign In</span>
                <ArrowRight size={16} className="text-[#F4B740]" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Accounts (Exclusively in Development Mode) */}
        {import.meta.env.DEV && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Dev Environment Only
              </span>
              <span className="text-[10px] text-gray-400">Not enabled in production</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoRole('admin')}
                className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-center transition-colors cursor-pointer"
              >
                <span className="block text-xs font-bold text-blue-800">Admin</span>
                <span className="block text-[10px] text-gray-500 truncate">Properties & CMS</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoRole('agent')}
                className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-center transition-colors cursor-pointer"
              >
                <span className="block text-xs font-bold text-purple-800">Agent</span>
                <span className="block text-[10px] text-gray-500 truncate">Inquiries & Leads</span>
              </button>
            </div>
          </div>
        )}

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-gray-500 hover:text-[#0F4C3A]">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  )
}
