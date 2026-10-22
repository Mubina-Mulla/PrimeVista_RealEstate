import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Bed, Bath, Maximize2, Sparkles, ArrowRight } from 'lucide-react'
import { formatPrice } from '../../utils/formatters.js'

export function PropertyCard({ property }) {
  if (!property) return null

  const {
    slug,
    propertyId,
    title,
    purpose,
    category,
    price,
    rentalPeriod,
    locality,
    city,
    bedrooms,
    bathrooms,
    area,
    coverImage,
    featured,
    status,
    assignedAgent,
  } = property

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col property-card-shadow">
      {/* Image Thumbnail with Overlay Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
        <img
          src={coverImage}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 items-center z-10">
          {featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F4B740] text-[#0F4C3A] shadow-xs">
              <Sparkles size={13} className="fill-[#0F4C3A]" />
              Featured
            </span>
          )}

          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs ${
              purpose === 'Buy' || purpose === 'For Sale'
                ? 'bg-[#0F4C3A] text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {purpose === 'Buy' || purpose === 'For Sale' ? 'For Sale' : 'For Rent'}
          </span>

          {status === 'sold' && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs">
              SOLD
            </span>
          )}
          {status === 'rented' && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs">
              RENTED
            </span>
          )}
        </div>

        {/* Property ID Code */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-white/90 backdrop-blur-sm text-[#1F2937] shadow-xs">
            {propertyId}
          </span>
        </div>

        {/* Price Tag pinned to bottom left of the image */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="text-xl sm:text-2xl font-black text-white drop-shadow-md font-['Poppins']">
            {formatPrice(price, purpose, rentalPeriod)}
          </div>
        </div>

        {/* Category Tag */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs">
            {category}
          </span>
        </div>
      </div>

      {/* Property Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
            <MapPin size={14} className="text-[#0F4C3A] shrink-0" />
            <span className="truncate">
              {locality}, {city}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-['Poppins'] font-bold text-base text-[#1F2937] group-hover:text-[#0F4C3A] transition-colors line-clamp-2 leading-snug">
            <Link to={`/properties/${slug || propertyId}`}>
              {title}
            </Link>
          </h3>
        </div>

        {/* Specs Row */}
        <div className="pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-xs text-gray-600">
          {bedrooms > 0 ? (
            <div className="flex items-center gap-1.5" title={`${bedrooms} Bedrooms`}>
              <Bed size={16} className="text-gray-400 shrink-0" />
              <span>{bedrooms} Beds</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="text-[11px] uppercase font-semibold">{category}</span>
            </div>
          )}

          {bathrooms > 0 && (
            <div className="flex items-center gap-1.5" title={`${bathrooms} Bathrooms`}>
              <Bath size={16} className="text-gray-400 shrink-0" />
              <span>{bathrooms} Baths</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 justify-end" title={`${area} Sq. Ft. Built-up Area`}>
            <Maximize2 size={15} className="text-gray-400 shrink-0" />
            <span>{area} sq.ft</span>
          </div>
        </div>

        {/* Footer with Agent & Action Link */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
          {assignedAgent ? (
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={assignedAgent.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80'}
                alt={assignedAgent.name}
                className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
              />
              <span className="text-xs font-medium text-gray-600 truncate">
                {assignedAgent.name}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">PrimeVista Verified</span>
          )}

          <Link
            to={`/properties/${slug || propertyId}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0F4C3A] hover:text-[#0A3629] group/btn transition-colors shrink-0"
          >
            <span>View Details</span>
            <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-0.5 text-[#F4B740]" />
          </Link>
        </div>
      </div>
    </article>
  )
}
