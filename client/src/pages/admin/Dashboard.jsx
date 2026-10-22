import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  CheckCircle2,
  FileEdit,
  BadgePercent,
  Inbox,
  Clock,
  Calendar,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { api } from '../../api/client.js'
import { StatsCard } from '../../components/admin/StatsCard.jsx'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { AdminInquiryModal } from '../../components/admin/InquiryModal.jsx'
import { formatDate, INQUIRY_STATUS_COLORS, formatPrice } from '../../utils/formatters.js'

export function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentInquiries, setRecentInquiries] = useState([])
  const [recentProperties, setRecentProperties] = useState([])
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState(null)

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const [dashRes, agentsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/agents'),
      ])

      if (dashRes.success) {
        setStats(dashRes.stats)
        setRecentInquiries(dashRes.recentInquiries || [])
        setRecentProperties(dashRes.recentProperties || [])
      }
      if (agentsRes.success) {
        setAgents(agentsRes.data || [])
      }
    } catch (err) {
      console.error('Failed to load dashboard', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937] font-['Poppins']">
              Live Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Real-time database statistics, customer pipeline, and property inventory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/properties"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0A3629] text-white text-xs font-bold shadow-md shadow-[#0F4C3A]/20 transition-all"
            >
              <Building2 size={16} />
              <span>Manage Properties</span>
            </Link>
            <Link
              to="/admin/inquiries"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-all"
            >
              <Inbox size={16} />
              <span>View All Leads</span>
            </Link>
          </div>
        </div>

        {/* 8 Stats KPI Cards directly from live DB */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            title="Total Properties"
            value={stats?.totalProperties || 0}
            subtitle="Active in database"
            icon={Building2}
            badgeColor="emerald"
          />

          <StatsCard
            title="Published"
            value={stats?.publishedProperties || 0}
            subtitle="Visible on public website"
            icon={CheckCircle2}
            badgeColor="emerald"
            badgeText="Live"
          />

          <StatsCard
            title="Draft / Unpublished"
            value={stats?.draftProperties || 0}
            subtitle="Hidden from public site"
            icon={FileEdit}
            badgeColor="amber"
            badgeText="Private"
          />

          <StatsCard
            title="Sold & Rented"
            value={stats?.soldAndRentedProperties || 0}
            subtitle="Completed transactions"
            icon={BadgePercent}
            badgeColor="blue"
          />

          <StatsCard
            title="Total Inquiries"
            value={stats?.totalInquiries || 0}
            subtitle="All captured buyer leads"
            icon={Inbox}
            badgeColor="purple"
          />

          <StatsCard
            title="New Leads"
            value={stats?.newInquiries || 0}
            subtitle="Require immediate response"
            icon={Sparkles}
            badgeColor="rose"
            badgeText="Urgent"
          />

          <StatsCard
            title="Pending Follow-ups"
            value={stats?.pendingFollowups || 0}
            subtitle="Scheduled in next 48h"
            icon={Clock}
            badgeColor="amber"
          />

          <StatsCard
            title="Site Visits Booked"
            value={stats?.scheduledVisits || 0}
            subtitle="Escorted property inspections"
            icon={Calendar}
            badgeColor="emerald"
          />
        </div>

        {/* 2-Column Split: Recent Inquiries & Recent Properties */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Recent Customer Inquiries (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 font-['Poppins']">
                  Recent Customer Inquiries
                </h3>
                <p className="text-xs text-gray-400">Leads captured across the platform</p>
              </div>
              <Link
                to="/admin/inquiries"
                className="text-xs font-bold text-[#0F4C3A] hover:underline flex items-center gap-1"
              >
                <span>Pipeline View</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No inquiries logged yet.</p>
            ) : (
              <div className="space-y-3">
                {recentInquiries.map((inq) => (
                  <div
                    key={inq._id}
                    onClick={() => setSelectedInquiry(inq)}
                    className="p-4 rounded-2xl bg-[#F5F7F5] hover:bg-emerald-50/50 border border-gray-200/60 transition-all cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-gray-900 truncate font-['Poppins']">
                          {inq.customerName}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            INQUIRY_STATUS_COLORS[inq.status] || 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {inq.propertyTitle} {inq.propertyId ? `(${inq.propertyId})` : ''}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {inq.phone} • {formatDate(inq.createdAt)}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold text-[#0F4C3A] hover:underline">
                        Review →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Property Additions (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 font-['Poppins']">
                  Recent Properties
                </h3>
                <p className="text-xs text-gray-400">Inventory status & pricing</p>
              </div>
              <Link
                to="/admin/properties"
                className="text-xs font-bold text-[#0F4C3A] hover:underline flex items-center gap-1"
              >
                <span>All Listings</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {recentProperties.map((prop) => (
                <div
                  key={prop._id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#F5F7F5] border border-gray-200/60"
                >
                  <img
                    src={prop.coverImage}
                    alt={prop.title}
                    className="w-14 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-[#0F4C3A]">
                        {prop.propertyId}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                          prop.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {prop.status}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-gray-900 truncate mt-0.5">
                      {prop.title}
                    </h5>
                    <p className="text-[11px] text-gray-500 font-semibold">
                      {formatPrice(prop.price, prop.purpose)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Inquiry Detail Modal */}
      <AdminInquiryModal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        inquiry={selectedInquiry}
        onUpdated={() => {
          loadDashboard()
          setSelectedInquiry(null)
        }}
        agents={agents}
      />
    </AdminLayout>
  )
}
