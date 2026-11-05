import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  X,
  Send,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Phone,
  Home,
  Calendar,
  ShieldCheck,
  Building2,
  ChevronDown,
  Compass,
} from 'lucide-react'

// Cute Robot SVG Avatar component
function RoboAvatar({ size = 28, isPulsing = false }) {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Antenna pulse dot */}
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#F4B740] animate-ping" />
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F4B740]" />

      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Antenna stalk */}
        <line x1="18" y1="2" x2="18" y2="8" stroke="#F4B740" strokeWidth="2.2" strokeLinecap="round" />
        
        {/* Ears / Headphone bolts */}
        <rect x="2" y="14" width="3" height="8" rx="1.5" fill="#F4B740" />
        <rect x="31" y="14" width="3" height="8" rx="1.5" fill="#F4B740" />

        {/* Head Base */}
        <rect x="5" y="8" width="26" height="20" rx="6" fill="#0F4C3A" stroke="#F4B740" strokeWidth="1.6" />

        {/* Screen / Visor */}
        <rect x="8" y="11" width="20" height="13" rx="3.5" fill="#082A20" />

        {/* Eyes (Glowing emerald-gold) */}
        <circle cx="13" cy="17" r="2.2" fill="#F4B740" />
        <circle cx="23" cy="17" r="2.2" fill="#F4B740" />
        <circle cx="13.7" cy="16.3" r="0.8" fill="#FFFFFF" />
        <circle cx="23.7" cy="16.3" r="0.8" fill="#FFFFFF" />

        {/* Friendly smile */}
        <path d="M15 21C16 22 20 22 21 21" stroke="#F4B740" strokeWidth="1.4" strokeLinecap="round" />

        {/* Cute blush cheeks */}
        <circle cx="10" cy="19" r="1.2" fill="#F4B740" opacity="0.4" />
        <circle cx="26" cy="19" r="1.2" fill="#F4B740" opacity="0.4" />
      </svg>
    </div>
  )
}

// Preset Quick Question Chips
const QUICK_SUGGESTIONS = [
  { label: '🔍 How to search properties?', key: 'search' },
  { label: '📅 How to book a site visit?', key: 'site-visit' },
  { label: '🛡️ Are properties verified?', key: 'verified' },
  { label: '💰 Budget & EMI options', key: 'budget' },
  { label: '💬 Chat on WhatsApp', key: 'whatsapp' },
]

export function AIChatBot() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [showSpeechBubble, setShowSpeechBubble] = useState(true)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Namaste! 🙏 I'm **VistaBot**, your cute AI real estate assistant. I'm here to guide you on **what to do** and **how to find your dream home** on PrimeVista!",
      timestamp: 'Just now',
      action: {
        type: 'chips',
        options: [
          'How do I search for homes?',
          'How to book a site visit?',
          'How to contact on WhatsApp?',
        ],
      },
    },
  ])

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setShowSpeechBubble(false)
    }
  }, [isOpen, messages, isTyping])

  // Auto-hide initial speech bubble after 12 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpeechBubble(false)
    }, 12000)
    return () => clearTimeout(timer)
  }, [])

  // Smart AI response logic
  const generateBotReply = (query) => {
    const q = query.toLowerCase().trim()

    // 1. Search / How to find properties
    if (
      q.includes('search') ||
      q.includes('find') ||
      q.includes('property') ||
      q.includes('filter') ||
      q.includes('dhundna') ||
      q.includes('kya kare') ||
      q.includes('how do i')
    ) {
      return {
        text: `Here is how to search for properties in 3 easy steps:\n\n1. **Use the Search Banner:** Right on the Home page, choose whether you want to **Buy** or **Rent**.\n2. **Filter by Locality & Budget:** Pick your favorite area (like Indiranagar, Worli, BKC) and select your budget range.\n3. **Explore Details:** Click any property card to view high-res photos, floor plans, and verified legal status.`,
        actionButtons: [
          { label: 'Explore Properties Now', to: '/properties', icon: 'home' },
          { label: 'Search on Banner', onClick: () => { setIsOpen(false); navigate('/'); window.scrollTo({ top: 120, behavior: 'smooth' }); }, icon: 'compass' },
        ],
      }
    }

    // 2. Site Visit / Book a Tour / Private viewing
    if (
      q.includes('visit') ||
      q.includes('tour') ||
      q.includes('book') ||
      q.includes('schedule') ||
      q.includes('dekho') ||
      q.includes('appointment')
    ) {
      return {
        text: `Booking a VIP site visit is completely free with PrimeVista:\n\n1. Go to any property detail page.\n2. Fill out the **Schedule a Private Tour** form on the right (Name, Phone, Preferred Date & Time).\n3. Our verified advisor will confirm your private walkthrough within 30 minutes!\n\n💡 **Tip:** You can also connect immediately on WhatsApp at **+91 91755 14916** for instant weekend slots.`,
        actionButtons: [
          { label: 'Browse Properties to Tour', to: '/properties', icon: 'home' },
          { label: 'Instant WhatsApp Booking', href: 'https://wa.me/919175514916?text=Hello%20PrimeVista,%20I%20would%20like%20to%20schedule%20a%20site%20visit.', icon: 'whatsapp' },
        ],
      }
    }

    // 3. WhatsApp / Phone / Contact inquiry
    if (
      q.includes('whatsapp') ||
      q.includes('number') ||
      q.includes('phone') ||
      q.includes('call') ||
      q.includes('contact') ||
      q.includes('agent')
    ) {
      return {
        text: `You can reach our senior property advisory desk directly:\n\n• **WhatsApp Number:** 9175514916 (wa.me/919175514916)\n• **Direct Phone:** +91 91755 14916\n• **Email:** contact@primevista.com\n• **Office:** Indiranagar, Bengaluru\n\nClick below to start a chat right now!`,
        actionButtons: [
          { label: 'Chat on WhatsApp (9175514916)', href: 'https://wa.me/919175514916?text=Hello%20PrimeVista,%20I%20am%20chatting%20via%20VistaBot%20AI.', icon: 'whatsapp' },
          { label: 'View Contact Page', to: '/contact', icon: 'phone' },
        ],
      }
    }

    // 4. Verification / Legal / Trust
    if (
      q.includes('verif') ||
      q.includes('legal') ||
      q.includes('rera') ||
      q.includes('fraud') ||
      q.includes('trust') ||
      q.includes('safe') ||
      q.includes('charges')
    ) {
      return {
        text: `At PrimeVista, 100% peace of mind is guaranteed:\n\n🛡️ **Personally Inspected:** Our structural engineers and experts personally visit every residence.\n📄 **Clear Legal Title:** Ownership documents and RERA approvals are thoroughly audited.\n🏷️ **Zero Hidden Charges:** Transparent pricing with clear commission terms up front.\n\nEvery listing shows the verified badge!`,
        actionButtons: [
          { label: 'Check About Us', to: '/about', icon: 'shield' },
          { label: 'Frequently Asked Questions', to: '/faq', icon: 'compass' },
        ],
      }
    }

    // 5. Budget / EMI / Pricing
    if (
      q.includes('budget') ||
      q.includes('price') ||
      q.includes('cost') ||
      q.includes('emi') ||
      q.includes('loan') ||
      q.includes('crore') ||
      q.includes('lakh')
    ) {
      return {
        text: `PrimeVista offers luxury homes for every tier of investment:\n\n• **Under ₹50 Lakhs:** Designer urban studios & 1BHKs\n• **₹50 Lakhs – ₹1.5 Cr:** Premium 2BHK/3BHK residential apartments\n• **₹1.5 Cr – ₹3 Cr:** Duplexes & signature penthouses\n• **Above ₹3 Cr:** Independent luxury villas & private estates\n\nNeed home loan or EMI assistance? We partner with leading private banks for swift pre-approvals!`,
        actionButtons: [
          { label: 'View Properties Under ₹1.5 Cr', to: '/properties?maxPrice=15000000', icon: 'home' },
          { label: 'View Luxury Villas Above ₹3 Cr', to: '/properties?minPrice=30000000', icon: 'building' },
        ],
      }
    }

    // 6. Buy vs Rent
    if (q.includes('buy') || q.includes('rent') || q.includes('lease')) {
      return {
        text: `Are you looking to **Buy** a permanent luxury asset or **Rent** a premium serviced residence?\n\n• Click **Buy** on our banner for lifetime homeownership and high-yield real estate investments.\n• Click **Rent** for turnkey furnished apartments, corporate executive penthouses, and commercial offices.`,
        actionButtons: [
          { label: 'Browse Homes for Sale', to: '/properties?purpose=Buy', icon: 'home' },
          { label: 'Browse Properties for Rent', to: '/properties?purpose=Rent', icon: 'building' },
        ],
      }
    }

    // 7. Admin / Login
    if (q.includes('login') || q.includes('admin') || q.includes('sign in')) {
      return {
        text: `The administrative and agent management portal is accessible at our secure Login gate. Here, authorized advisors can update listings and review incoming inquiries.`,
        actionButtons: [
          { label: 'Go to Admin Login', to: '/login', icon: 'compass' },
        ],
      }
    }

    // Default friendly AI guidance
    return {
      text: `I'm happy to help you with that! As your PrimeVista AI Guide, I can help you:\n\n• **Find specific homes** (e.g. 3BHK in Bangalore or Penthouse in Mumbai)\n• **Guide you on booking site visits**\n• **Connect with verified agents** on WhatsApp (**+91 91755 14916**)\n• **Check legal title guarantees & pricing**\n\nWhat would you like to explore next?`,
      actionButtons: [
        { label: 'Explore All Properties', to: '/properties', icon: 'home' },
        { label: 'Chat with Agent on WhatsApp', href: 'https://wa.me/919175514916?text=Hello%20PrimeVista,%20I%20need%20help%20finding%20a%20property.', icon: 'whatsapp' },
      ],
    }
  }

  // Handle user sending message
  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputMessage).trim()
    if (!text) return

    const userMsgId = `user-${Date.now()}`
    const newUserMsg = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: 'Just now',
    }

    setMessages((prev) => [...prev, newUserMsg])
    setInputMessage('')
    setIsTyping(true)

    // Simulate smart thinking delay
    setTimeout(() => {
      const reply = generateBotReply(text)
      const botMsgId = `bot-${Date.now()}`
      const newBotMsg = {
        id: botMsgId,
        sender: 'bot',
        text: reply.text,
        timestamp: 'Just now',
        actionButtons: reply.actionButtons,
      }
      setMessages((prev) => [...prev, newBotMsg])
      setIsTyping(false)
    }, 600)
  }

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: "Chat refreshed! 🤖 How can I assist you with PrimeVista today?",
        timestamp: 'Just now',
        action: {
          type: 'chips',
          options: [
            'How do I search for homes?',
            'How to book a site visit?',
            'How to contact on WhatsApp?',
          ],
        },
      },
    ])
  }

  return (
    <>
      {/* 1. Floating AI Robot Assistant Trigger: Pinned directly UPSIDE WhatsApp Logo */}
      <aside
        aria-label="AI Assistant"
        className="fixed bottom-24 right-6 z-50 flex items-center gap-2.5"
      >
        {/* Cute Speech Bubble / Help Prompt */}
        <AnimatePresence>
          {showSpeechBubble && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              transition={{ duration: 0.4 }}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0F4C3A] text-white text-xs font-semibold shadow-xl border border-[#F4B740]/40 backdrop-blur-md cursor-pointer group"
              onClick={() => setIsOpen(true)}
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4B740] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F4B740]"></span>
              </span>
              <span>Need help? Ask **VistaBot** 🤖</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowSpeechBubble(false)
                }}
                className="ml-1 p-0.5 rounded-full hover:bg-white/20 text-white/70 hover:text-white"
                title="Dismiss"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Chota Robo Trigger Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen((prev) => !prev)
            setShowSpeechBubble(false)
          }}
          type="button"
          aria-label="Open AI Assistant"
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#0F4C3A] via-[#165B46] to-[#0A3629] text-white flex items-center justify-center shadow-xl shadow-[#0F4C3A]/40 border-2 border-[#F4B740] cursor-pointer overflow-visible"
        >
          {/* Subtle glowing halo ring */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#F4B740]/30 to-emerald-500/20 blur-sm pointer-events-none animate-pulse" />

          {/* Active online green dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-xs z-20" />

          {/* Robo Icon / Close Icon based on state */}
          {isOpen ? (
            <X size={24} className="text-[#F4B740] relative z-10" />
          ) : (
            <RoboAvatar size={28} />
          )}
        </motion.button>
      </aside>

      {/* 2. Interactive AI Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[560px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden text-[#1F2937]"
          >
            {/* Header: Luxury Emerald with VistaBot Avatar */}
            <div className="bg-[#0F4C3A] text-white p-4 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-[#F4B740]/40 flex items-center justify-center shrink-0">
                  <RoboAvatar size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm tracking-wide font-['Poppins']">VistaBot AI</h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F4B740] text-[#0F4C3A]">
                      Guide
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    Online • Guides what to do & how
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Reset Conversation */}
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Reset Chat"
                  className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw size={16} />
                </button>
                {/* Close */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick Helper Subheader: What to do suggestions */}
            <div className="bg-[#F5F7F5] px-3 py-2 border-b border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
              <Sparkles size={13} className="text-[#F4B740] shrink-0 ml-1" />
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider shrink-0">
                Quick Guide:
              </span>
              {QUICK_SUGGESTIONS.map((sugg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(sugg.label.replace(/^.*? /, ''))}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 hover:border-[#0F4C3A] hover:text-[#0F4C3A] text-[11px] font-medium transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                >
                  {sugg.label}
                </button>
              ))}
            </div>

            {/* Chat Body: Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAFBF9] text-xs sm:text-sm">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot'
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    {isBot && (
                      <div className="w-7 h-7 rounded-xl bg-[#0F4C3A] text-white flex items-center justify-center shrink-0 mt-0.5 border border-[#F4B740]/40">
                        <RoboAvatar size={18} />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-xs ${
                        isBot
                          ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                          : 'bg-[#0F4C3A] text-white rounded-tr-sm'
                      }`}
                    >
                      <div className="whitespace-pre-line text-xs sm:text-sm">
                        {msg.text.split('\n').map((line, lIdx) => {
                          // Support basic markdown bold: **text**
                          const parts = line.split(/(\*\*.*?\*\*)/g)
                          return (
                            <p key={lIdx} className={line.startsWith('•') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') ? 'mt-1 pl-1' : 'mt-1 first:mt-0'}>
                              {parts.map((part, pIdx) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return (
                                    <strong key={pIdx} className={isBot ? 'text-[#0F4C3A] font-bold' : 'text-[#F4B740] font-bold'}>
                                      {part.slice(2, -2)}
                                    </strong>
                                  )
                                }
                                return part
                              })}
                            </p>
                          )
                        })}
                      </div>

                      {/* Interactive Action Buttons inside Bot Message */}
                      {msg.actionButtons && msg.actionButtons.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-1.5">
                          {msg.actionButtons.map((btn, bIdx) => {
                            if (btn.to) {
                              return (
                                <Link
                                  key={bIdx}
                                  to={btn.to}
                                  onClick={() => setIsOpen(false)}
                                  className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-[#F5F7F5] hover:bg-emerald-50 text-[#0F4C3A] text-xs font-bold border border-emerald-100 transition-colors"
                                >
                                  <span>{btn.label}</span>
                                  <ArrowRight size={13} className="text-[#0F4C3A]" />
                                </Link>
                              )
                            }
                            if (btn.href) {
                              return (
                                <a
                                  key={bIdx}
                                  href={btn.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0F4C3A] text-xs font-bold border border-emerald-200 transition-colors"
                                >
                                  <span className="flex items-center gap-1.5">
                                    <MessageCircle size={13} className="text-[#25D366]" />
                                    {btn.label}
                                  </span>
                                  <ExternalLink size={12} className="text-gray-400" />
                                </a>
                              )
                            }
                            if (btn.onClick) {
                              return (
                                <button
                                  key={bIdx}
                                  type="button"
                                  onClick={btn.onClick}
                                  className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-[#F5F7F5] hover:bg-emerald-50 text-[#0F4C3A] text-xs font-bold border border-emerald-100 transition-colors cursor-pointer"
                                >
                                  <span>{btn.label}</span>
                                  <ArrowRight size={13} />
                                </button>
                              )
                            }
                            return null
                          })}
                        </div>
                      )}

                      {/* Initial Suggestion Chips if provided */}
                      {msg.action?.options && (
                        <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-wrap gap-1.5">
                          {msg.action.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => handleSendMessage(opt)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0F4C3A] text-xs font-semibold transition-colors cursor-pointer text-left"
                            >
                              👉 {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#0F4C3A] text-white flex items-center justify-center shrink-0 border border-[#F4B740]/40">
                    <RoboAvatar size={18} />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C3A] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C3A] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C3A] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white border-t border-gray-100 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask VistaBot what to do or how..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 bg-white"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="w-10 h-10 rounded-xl bg-[#0F4C3A] hover:bg-[#0A3629] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-md shadow-[#0F4C3A]/20 transition-all cursor-pointer shrink-0"
                >
                  <Send size={15} className="text-[#F4B740]" />
                </button>
              </form>
              <p className="text-[10px] text-gray-400 text-center mt-1.5">
                AI Assistant • Direct WhatsApp: <strong>9175514916</strong>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
