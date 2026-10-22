import React from 'react'

export function StatsCard({ title, value, subtitle, icon: Icon, badgeText, badgeColor = 'emerald' }) {
  const colorMap = {
    emerald: 'bg-emerald-50 text-[#0F4C3A] border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-['Poppins']">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[badgeColor] || colorMap.emerald}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <span className="text-3xl font-black text-[#1F2937] font-['Poppins']">
          {value}
        </span>
        {badgeText && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${colorMap[badgeColor] || colorMap.emerald}`}>
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  )
}
