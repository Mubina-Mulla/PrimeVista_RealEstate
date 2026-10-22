import React, { useEffect, useState } from 'react'
import { Phone, Mail, Award, CheckCircle2, Building2 } from 'lucide-react'
import { api } from '../../api/client.js'

export function Agents() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAgents() {
      try {
        setLoading(true)
        const res = await api.get('/agents')
        if (res.success) {
          setAgents(res.data || [])
        }
      } catch (err) {
        console.error('Failed to load agents', err)
      } finally {
        setLoading(false)
      }
    }
    loadAgents()
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F7F5] py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C3A]">
            Expert Property Advisors
          </span>
          <h1 className="mt-2 text-4xl sm:text-5xl font-black text-[#1F2937] font-['Poppins']">
            Meet Our Leadership Team
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Dedicated specialists with hyper-local neighborhood insights, extensive transaction track records, and unwavering client advocacy.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {agents.map((agent) => (
              <div
                key={agent._id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-4/5 w-full overflow-hidden bg-gray-100 relative">
                    <img
                      src={agent.photo}
                      alt={agent.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-bold text-[#0F4C3A]">
                      {agent.experience}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 font-['Poppins']">{agent.name}</h3>
                    <p className="text-xs font-semibold text-[#0F4C3A] mt-0.5">{agent.role}</p>
                    <p className="text-xs text-gray-500 mt-3 line-clamp-3 leading-relaxed">
                      {agent.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>Active Listings:</span>
                      <span className="font-bold text-[#0F4C3A]">
                        {agent.propertiesListed || 0} Properties
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-2">
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#F5F7F5] hover:bg-emerald-50 text-gray-700 hover:text-[#0F4C3A] text-xs font-semibold transition-colors"
                  >
                    <Phone size={14} className="text-[#0F4C3A]" />
                    <span>{agent.phone}</span>
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0A3629] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <Mail size={14} className="text-[#F4B740]" />
                    <span>Email Agent</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
