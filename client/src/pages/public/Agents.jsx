import React, { useEffect, useState } from 'react'
import { Phone, Mail, Award, CheckCircle2, Building2 } from 'lucide-react'
import { api } from '../../api/client.js'

const DEFAULT_AGENTS = [
  {
    _id: 'agent-1',
    name: 'Vikramaditya Roy',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    role: 'Senior Luxury Property Specialist',
    email: 'agent@primevista.com',
    phone: '+91 98765 43210',
    description: 'Specializes in high-net-worth residential acquisitions, penthouses, and heritage estates with 10+ years experience.',
    experience: '10+ Years',
    propertiesListed: 4,
  },
  {
    _id: 'agent-2',
    name: 'Ananya Sen',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    role: 'Commercial & Retail Leasing Head',
    email: 'ananya@primevista.com',
    phone: '+91 98234 56789',
    description: 'Expert in prime tech park office leases, flagship commercial showrooms, and investment yield advisory.',
    experience: '8+ Years',
    propertiesListed: 3,
  },
  {
    _id: 'agent-3',
    name: 'Rohit Malhotra',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    role: 'Residential & Villa Consultant',
    email: 'rohit@primevista.com',
    phone: '+91 97123 45678',
    description: 'Dedicated to helping families discover peaceful gated communities, luxury villas, and smart green homes.',
    experience: '6+ Years',
    propertiesListed: 5,
  },
  {
    _id: 'agent-4',
    name: 'Pooja Hegde',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    role: 'Prime Investment Portfolio Advisor',
    email: 'pooja@primevista.com',
    phone: '+91 99887 76655',
    description: 'Consultant for private real estate investment trusts, high-yield land parcels, and pre-launch luxury developments.',
    experience: '7+ Years',
    propertiesListed: 2,
  },
]

export function Agents() {
  const [agents, setAgents] = useState(DEFAULT_AGENTS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadAgents() {
      try {
        const res = await api.get('/agents')
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setAgents(res.data)
        }
      } catch (err) {
        // Fallback to DEFAULT_AGENTS if API is offline or hosted separately
        console.warn('Backend not reached, showing default leadership team data', err)
      }
    }
    loadAgents()
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F7F5] py-8 sm:py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C3A]">
            Expert Property Advisors
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black text-[#1F2937] font-['Poppins']">
            Meet Our Leadership Team
          </h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
            Dedicated specialists with hyper-local neighborhood insights, extensive transaction track records, and unwavering client advocacy.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
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
