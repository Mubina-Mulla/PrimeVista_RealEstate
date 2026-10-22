import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

// Common Public Layout Components
import { Navbar } from './components/common/Navbar.jsx'
import { Footer } from './components/common/Footer.jsx'

// Public Pages
import { Home } from './pages/public/Home.jsx'
import { Properties } from './pages/public/Properties.jsx'
import { PropertyDetail } from './pages/public/PropertyDetail.jsx'
import { About } from './pages/public/About.jsx'
import { Services } from './pages/public/Services.jsx'
import { Agents } from './pages/public/Agents.jsx'
import { Contact } from './pages/public/Contact.jsx'
import { FAQ } from './pages/public/FAQ.jsx'
import { Login } from './pages/public/Login.jsx'
import { NotFound } from './pages/public/NotFound.jsx'

// Admin Pages
import { Dashboard } from './pages/admin/Dashboard.jsx'
import { PropertiesAdmin } from './pages/admin/PropertiesAdmin.jsx'
import { InquiriesAdmin } from './pages/admin/InquiriesAdmin.jsx'
import { AgentsAdmin } from './pages/admin/AgentsAdmin.jsx'
import { CMSAdmin } from './pages/admin/CMSAdmin.jsx'
import { UsersAdmin } from './pages/admin/UsersAdmin.jsx'

// Public Layout Wrapper
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

// Protected Route Guard
function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7F5]">
        <div className="w-10 h-10 border-4 border-[#0F4C3A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:slug" element={<PropertyDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'admin', 'agent']} />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/properties" element={<PropertiesAdmin />} />
              <Route path="/admin/inquiries" element={<InquiriesAdmin />} />
              <Route path="/admin/agents" element={<AgentsAdmin />} />
              <Route path="/admin/cms" element={<CMSAdmin />} />
            </Route>

            {/* Super Admin Restricted Route */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
              <Route path="/admin/users" element={<UsersAdmin />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
