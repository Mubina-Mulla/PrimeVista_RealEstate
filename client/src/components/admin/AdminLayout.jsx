import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  House,
  LayoutDashboard,
  Building2,
  Inbox,
  Users,
  FileText,
  UserCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, hasRole } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Properties', path: '/admin/properties', icon: Building2 },
    { name: 'Customer Inquiries', path: '/admin/inquiries', icon: Inbox },
    { name: 'Agent Team', path: '/admin/agents', icon: Users },
    { name: 'Website Content (CMS)', path: '/admin/cms', icon: FileText },
  ]

  // Super Admin only routes
  if (hasRole('super_admin')) {
    navItems.push({ name: 'User Management', path: '/admin/users', icon: UserCheck })
  }

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#F5F7F5] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#0F4C3A] text-white shrink-0 shadow-xl z-20">
        {/* Brand */}
        <div className="p-6 border-b border-emerald-800/60">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white text-[#0F4C3A] flex items-center justify-center shadow-md">
              <House size={22} className="text-[#0F4C3A]" />
            </div>
            <div>
              <span className="block text-xl font-bold tracking-tight text-white leading-none font-['Poppins']">
                PrimeVista
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.25em] text-[#F4B740] uppercase mt-0.5">
                Admin Panel
              </span>
            </div>
          </Link>

          {/* User Role Badge */}
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F4B740] text-[#0F4C3A] font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Staff'}</p>
              <span className="inline-block text-[10px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-700 text-emerald-100">
                {user?.role === 'super_admin' ? 'Super Admin' : user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#F4B740] text-[#0F4C3A] shadow-md shadow-black/10'
                    : 'text-emerald-100 hover:bg-emerald-800/40 hover:text-white'
                }`}
              >
                <Icon size={18} className={active ? 'text-[#0F4C3A]' : 'text-[#F4B740]'} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-emerald-800/60 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-200 hover:bg-emerald-800/40 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={15} />
              View Public Website
            </span>
            <ChevronRight size={14} />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex flex-col w-72 max-w-xs bg-[#0F4C3A] text-white z-10 shadow-2xl">
            <div className="p-5 border-b border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white text-[#0F4C3A] flex items-center justify-center">
                  <House size={18} />
                </div>
                <span className="font-bold font-['Poppins']">PrimeVista Admin</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-emerald-800 text-white"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold ${
                      active ? 'bg-[#F4B740] text-[#0F4C3A]' : 'text-emerald-100 hover:bg-emerald-800'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-emerald-800 space-y-2">
              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-2 text-xs font-semibold text-emerald-200 p-2"
              >
                <ExternalLink size={16} /> View Public Website
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-bold text-rose-300 p-2 w-full text-left"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
            >
              <Menu size={22} />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-[#1F2937] font-['Poppins'] truncate">
              PrimeVista Control Center
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:text-[#0F4C3A] hover:bg-gray-50 transition-colors"
            >
              <ExternalLink size={14} />
              <span>Visit Website</span>
            </Link>

            <div className="h-6 w-px bg-gray-200 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#0F4C3A] font-bold text-xs flex items-center justify-center border border-emerald-200">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-gray-900 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
