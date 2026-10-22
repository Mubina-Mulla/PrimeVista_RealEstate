import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, HelpCircle, Phone, ArrowRight } from 'lucide-react'
import { api } from '../../api/client.js'

export function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [openIndex, setOpenIndex] = useState(0)

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await api.get('/content/faq')
        if (res.success && res.data?.sections?.faqs) {
          setFaqs(res.data.sections.faqs)
        } else {
          // Fallback defaults
          setFaqs([
            {
              question: 'Are all properties listed on PrimeVista legally verified?',
              answer: 'Yes. Every residential and commercial listing undergoes strict title due diligence, municipal clearance checks, and encumbrance verification before publication.',
            },
            {
              question: 'How do I schedule a physical site visit for a property?',
              answer: 'Simply click "Schedule a Site Visit" on any property details page, pick your preferred date and time, and our assigned property specialist will confirm and escort you.',
            },
            {
              question: 'Do you charge a brokerage fee for buying a property?',
              answer: 'For primary developer sales (pre-launches and new projects), there is 0% brokerage charge to buyers. For secondary resale and rental transactions, standard institutional advisory fees apply.',
            },
            {
              question: 'Can you assist with home loans and legal documentation?',
              answer: 'PrimeVista has partnered with leading banking institutions (HDFC, SBI, ICICI, Axis) to offer swift loan pre-approvals and lower interest rates, as well as on-ground registration support.',
            },
            {
              question: 'How does PrimeVista protect my contact information?',
              answer: 'We strictly protect customer privacy. Your phone and email are never sold or shared with third-party advertisers. Only your assigned PrimeVista advisor will contact you.',
            },
          ])
        }
      } catch (err) {
        // Keep fallback
      }
    }
    loadFaqs()
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F7F5] py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C3A]">
            Answers & Clarity
          </span>
          <h1 className="mt-2 text-4xl sm:text-5xl font-black text-[#1F2937] font-['Poppins']">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Got questions about purchasing, site visits, legal checks, or home loans? Find comprehensive answers below.
          </p>
        </div>

        {/* Accordion FAQ list */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-gray-900 font-['Poppins'] text-sm sm:text-base hover:text-[#0F4C3A] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0F4C3A] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      0{index + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-[#0F4C3A] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-gray-600 leading-relaxed font-normal border-t border-gray-50 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Help Banner */}
        <div className="p-8 rounded-3xl bg-white shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="text-lg font-bold text-gray-900 font-['Poppins']">
              Still have questions?
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Our property relationship managers are always available to guide you.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl bg-[#0F4C3A] text-white text-xs font-bold hover:bg-[#0A3629] transition-all flex items-center gap-2 shrink-0 shadow-md"
          >
            <Phone size={14} className="text-[#F4B740]" />
            <span>Contact Support Desk</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
