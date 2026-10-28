import React from 'react'
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react'

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F5F7F5] py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0F4C3A]/10 text-[#0F4C3A] mb-3">
            <ShieldCheck size={14} /> Legal & Privacy Assurance
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1F2937] font-['Poppins']">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Last Updated: October 2026 • PrimeVista Real Estate Consultancy
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 space-y-8 text-gray-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 font-['Poppins'] flex items-center gap-2">
              <Lock size={18} className="text-[#0F4C3A]" /> 1. Commitment to Client Confidentiality
            </h2>
            <p>
              At PrimeVista Real Estate, we recognize that high-value property acquisitions and inquiries involve sensitive personal, financial, and contact information. We are committed to safeguarding the privacy and security of property seekers, sellers, and corporate tenants who interact with our portal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 font-['Poppins'] flex items-center gap-2">
              <Eye size={18} className="text-[#0F4C3A]" /> 2. Information We Collect
            </h2>
            <p>
              We collect information strictly necessary to provide property advisory, schedule physical site inspections, and coordinate with assigned licensed property specialists:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-600">
              <li><strong>Contact Information:</strong> Full name, verified mobile phone number, and email address.</li>
              <li><strong>Property Requirements:</strong> Preferred locality, budget range, property category (Villa, Penthouse, Apartment, Commercial), and visit scheduling slots.</li>
              <li><strong>Transaction & Advisory Data:</strong> Communication records, internal follow-up logs, and inquiry preferences.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 font-['Poppins'] flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#0F4C3A]" /> 3. Strict No-Spam & Zero-Third-Party Sharing Guarantee
            </h2>
            <p>
              Your personal information is <strong>never sold, leased, rented, or distributed</strong> to third-party telemarketers, lead aggregators, or unauthorized financial advertisers. Inquiry information is solely utilized by your dedicated PrimeVista property specialist to coordinate inspections and verify title deeds.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 font-['Poppins'] flex items-center gap-2">
              <FileText size={18} className="text-[#0F4C3A]" /> 4. Data Protection & Security
            </h2>
            <p>
              Our backend APIs are fortified with industry-standard cryptographic encryption, Helmet security headers, rate limiting to protect against automated scraping, and strict role-based access control. All authentication credentials stored on our servers utilize one-way salt hashing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 font-['Poppins']">
              5. Contacting Our Data Protection Officer
            </h2>
            <p>
              If you have any questions about our privacy practices, wish to review the information associated with your inquiries, or request data deletion, contact us at:
            </p>
            <div className="p-4 rounded-2xl bg-[#F5F7F5] text-xs space-y-1">
              <p><strong>PrimeVista Compliance Desk</strong></p>
              <p>Email: <a href="mailto:privacy@primevista.com" className="text-[#0F4C3A] font-bold underline">privacy@primevista.com</a></p>
              <p>Address: Level 8, PrimeVista Tower, 100 Feet Road, Indiranagar, Bengaluru, 560038</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
