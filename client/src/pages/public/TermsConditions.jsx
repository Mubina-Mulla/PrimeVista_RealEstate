import React from 'react'
import { FileCheck, Shield, AlertCircle, Building2 } from 'lucide-react'

export function TermsConditions() {
  return (
    <div className="min-h-screen bg-[#F5F7F5] py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0F4C3A]/10 text-[#0F4C3A] mb-3">
            <FileCheck size={14} /> Service Terms & Listing Standards
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1F2937] font-['Poppins']">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Effective as of October 2026 • PrimeVista Real Estate Consultancy
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 space-y-8 text-gray-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 font-['Poppins'] flex items-center gap-2">
              <Shield size={18} className="text-[#0F4C3A]" /> 1. Acceptance of Terms
            </h2>
            <p>
              By accessing the PrimeVista website, browsing property listings, scheduling physical site visits, or submitting inquiries, you acknowledge and agree to be bound by these Terms and Conditions. If you do not agree with any provision, please refrain from using the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 font-['Poppins'] flex items-center gap-2">
              <Building2 size={18} className="text-[#0F4C3A]" /> 2. Property Listings & Accuracy of Information
            </h2>
            <p>
              PrimeVista exercises diligent care to ensure that property prices, built-up areas, amenities, and floor plans displayed on the website accurately reflect on-ground specifications. However:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-600">
              <li>Prices and availability for primary and secondary properties are subject to change without prior notice.</li>
              <li>Architectural renderings and virtual walkthroughs serve illustrative purposes; buyers are encouraged to inspect properties in person during scheduled site visits.</li>
              <li>Government taxes, registration duties, maintenance deposits, and stamp duties are calculated per prevailing municipal regulations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 font-['Poppins'] flex items-center gap-2">
              <FileCheck size={18} className="text-[#0F4C3A]" /> 3. Site Visit Appointments & Advisory
            </h2>
            <p>
              Scheduling a site visit through the PrimeVista portal connects you with a dedicated property specialist. Site visits are escorted and scheduled based on mutually confirmed appointments between the client, owner/developer, and PrimeVista advisor.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 font-['Poppins'] flex items-center gap-2">
              <AlertCircle size={18} className="text-[#0F4C3A]" /> 4. Intellectual Property
            </h2>
            <p>
              All trademarks, logos, high-resolution photography, property descriptions, design layouts, and software source code comprising the PrimeVista platform are the exclusive intellectual property of PrimeVista Real Estate and may not be reproduced without prior written authorization.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 font-['Poppins']">
              5. Governing Law & Jurisdiction
            </h2>
            <p>
              These terms are governed by the laws of India. Any disputes arising out of the use of our services or property advisory transactions are subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
