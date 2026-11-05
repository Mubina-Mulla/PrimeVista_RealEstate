import React from 'react'
import { motion } from 'motion/react'

export function WhatsAppButton() {
  return (
    <motion.aside
      aria-label="Contact options"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2"
    >
      {/* Tooltip on hover */}
      <span className="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Chat with Property Advisor
      </span>

      {/* Button with WhatsApp SVG */}
      <motion.a
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        href="https://wa.me/919876543210?text=Hello%20PrimeVista%20Real%20Estate,%20I%20am%20interested%20in%20learning%20more%20about%20your%20properties."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with PrimeVista on WhatsApp"
        className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl shadow-[#25D366]/40 cursor-pointer overflow-visible"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />

        {/* Official WhatsApp SVG Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7 relative z-10"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.87-.38-4.12-1.11l-.3-.17-3.12.82.83-3.04-.19-.31a8.16 8.16 0 0 1-1.25-4.43c0-4.54 3.69-8.24 8.24-8.24m4.52 11.58c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.12-.23-.19-.48-.31" />
        </svg>
      </motion.a>
    </motion.aside>
  )
}
