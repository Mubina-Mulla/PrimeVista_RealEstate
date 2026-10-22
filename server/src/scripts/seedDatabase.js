import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { Property } from '../models/Property.js'
import { Inquiry } from '../models/Inquiry.js'
import { User } from '../models/User.js'
import { Agent } from '../models/Agent.js'
import { PageContent } from '../models/PageContent.js'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/primevista'

async function seed() {
  try {
    console.log('🔄 Connecting to MongoDB for seeding...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // 1. Clear existing records for a fresh clean state
    await Promise.all([
      User.deleteMany({}),
      Agent.deleteMany({}),
      Property.deleteMany({}),
      Inquiry.deleteMany({}),
      PageContent.deleteMany({}),
    ])
    console.log('🧹 Cleaned existing collections')

    // 2. Create Users (Super Admin, Admin, Agent)
    const salt = await bcrypt.genSalt(10)
    const defaultPasswordHash = await bcrypt.hash('Password@123', salt)

    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@primevista.com',
      passwordHash: defaultPasswordHash,
      role: 'super_admin',
      permissions: ['all'],
      active: true,
    })

    const staffAdmin = await User.create({
      name: 'Priya Sharma',
      email: 'priya@primevista.com',
      passwordHash: defaultPasswordHash,
      role: 'admin',
      permissions: ['properties', 'inquiries', 'content'],
      active: true,
    })

    const agentUser = await User.create({
      name: 'Vikram Roy',
      email: 'agent@primevista.com',
      passwordHash: defaultPasswordHash,
      role: 'agent',
      permissions: ['inquiries'],
      active: true,
    })

    console.log('👤 Created default users (admin@primevista.com / Password@123)')

    // 3. Create Agents
    const agents = await Agent.insertMany([
      {
        name: 'Vikramaditya Roy',
        photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
        role: 'Senior Luxury Property Specialist',
        email: 'agent@primevista.com',
        phone: '+91 98765 43210',
        description: 'Specializes in high-net-worth residential acquisitions, penthouses, and heritage estates with 10+ years experience.',
        experience: '10+ Years',
        userAccount: agentUser._id,
        active: true,
      },
      {
        name: 'Ananya Sen',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        role: 'Commercial & Retail Leasing Head',
        email: 'ananya@primevista.com',
        phone: '+91 98234 56789',
        description: 'Expert in prime tech park office leases, flagship commercial showrooms, and investment yield advisory.',
        experience: '8+ Years',
        active: true,
      },
      {
        name: 'Rohit Malhotra',
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
        role: 'Residential & Villa Consultant',
        email: 'rohit@primevista.com',
        phone: '+91 97123 45678',
        description: 'Dedicated to helping families discover peaceful gated communities, luxury villas, and smart green homes.',
        experience: '6+ Years',
        active: true,
      },
      {
        name: 'Pooja Hegde',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
        role: 'Prime Investment Portfolio Advisor',
        email: 'pooja@primevista.com',
        phone: '+91 99887 76655',
        description: 'Consultant for private real estate investment trusts, high-yield land parcels, and pre-launch luxury developments.',
        experience: '7+ Years',
        active: true,
      },
    ])
    console.log(`🤝 Created ${agents.length} Agent profiles`)

    // 4. Create Properties with High-Quality Architecture Imagery
    const propertiesData = [
      {
        propertyId: 'PV-101',
        title: 'The Palm Heights — Ultra Luxury 4BHK Penthouse',
        slug: 'the-palm-heights-ultra-luxury-4bhk-penthouse',
        purpose: 'Buy',
        category: 'Penthouse',
        price: 42000000, // ₹4.20 Crore
        address: '100 Feet Road, HAL 2nd Stage',
        locality: 'Indiranagar',
        city: 'Bengaluru',
        bedrooms: 4,
        bathrooms: 5,
        floor: '24th of 24 (Top Sky Deck)',
        area: 4650,
        amenities: [
          'Private Infinity Pool',
          '360° Panoramic Skyline Views',
          'Automated Smart Home',
          'Private Elevator Access',
          'Italian Marble Flooring',
          '3 Reserved Parking Slots',
          '24/7 Concierge & Security',
          'EV Fast Charging',
        ],
        description:
          'Experience the pinnacle of luxury living in this sprawling 4,650 sq.ft penthouse perched high above Indiranagar. Featuring bespoke European fixtures, automated ambient illumination, expansive wraparound balconies with private plunge pool, and dedicated private elevator foyer.',
        coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
        ],
        featured: true,
        status: 'published',
        seoTitle: 'Luxury 4BHK Penthouse in Indiranagar Bengaluru | PrimeVista',
        metaDescription: 'Discover The Palm Heights, a 4650 sqft ultra luxury penthouse in Indiranagar with private sky deck, infinity pool, and concierge.',
        assignedAgent: agents[0]._id,
        createdBy: superAdmin._id,
      },
      {
        propertyId: 'PV-102',
        title: 'Greenwood Meadows — Contemporary 3BHK Gated Villa',
        slug: 'greenwood-meadows-contemporary-3bhk-villa',
        purpose: 'Buy',
        category: 'Villa',
        price: 28500000, // ₹2.85 Crore
        address: 'ECC Road, Near Hope Farm Junction',
        locality: 'Whitefield',
        city: 'Bengaluru',
        bedrooms: 3,
        bathrooms: 4,
        floor: 'Ground + 2 Floors (Triplex)',
        area: 3200,
        amenities: [
          'Private Landscaped Garden',
          'Solar Power Grid',
          'Clubhouse & Gym',
          'Tennis & Badminton Court',
          '24/7 Security Patrol',
          'Covered Double Garage',
          'Children Play Area',
        ],
        description:
          'Set inside a peaceful 18-acre gated community in Whitefield, this triplex villa blends natural tranquility with modern architectural elegance. Designed with floor-to-ceiling glass facades, double-height living areas, private rooftop terrace garden, and sustainable solar infrastructure.',
        coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85',
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
        ],
        featured: true,
        status: 'published',
        seoTitle: 'Modern 3BHK Triplex Villa in Whitefield | PrimeVista',
        metaDescription: 'Spacious 3200 sq.ft gated villa in Whitefield with private garden and full amenities.',
        assignedAgent: agents[2]._id,
        createdBy: superAdmin._id,
      },
      {
        propertyId: 'PV-103',
        title: 'Skyline Horizon — High-Rise 2BHK Sea-Facing Haven',
        slug: 'skyline-horizon-high-rise-2bhk-sea-facing',
        purpose: 'Buy',
        category: 'Apartment',
        price: 19500000, // ₹1.95 Crore
        address: 'Dr. Annie Besant Road',
        locality: 'Worli',
        city: 'Mumbai',
        bedrooms: 2,
        bathrooms: 2,
        floor: '18th of 35 Floors',
        area: 1280,
        amenities: [
          'Unobstructed Sea View',
          'Infinity Swimming Pool',
          'Modern Fitness Center',
          'High Speed Elevators',
          'Valet Parking',
          'Power Backup',
        ],
        description:
          'A modern haven in the heart of Worli offering breathtaking Arabian Sea vistas. Features soundproof double-glazed windows, modular German kitchen, premium sanitary ware, and round-the-clock five-tier security.',
        coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85',
        ],
        featured: true,
        status: 'published',
        seoTitle: 'Worli Sea Facing 2BHK Apartment | PrimeVista',
        metaDescription: 'Sea-facing 2BHK luxury apartment in Worli Mumbai with clubhouse and modern amenities.',
        assignedAgent: agents[0]._id,
        createdBy: superAdmin._id,
      },
      {
        propertyId: 'PV-104',
        title: 'Prime Corporate Plaza — Grade-A Furnished Office',
        slug: 'prime-corporate-plaza-grade-a-furnished-office',
        purpose: 'Rent',
        category: 'Office',
        price: 350000, // ₹3.5 Lakh / month
        rentalPeriod: 'month',
        address: 'G-Block, Bandra Kurla Complex',
        locality: 'BKC',
        city: 'Mumbai',
        bedrooms: 0,
        bathrooms: 4,
        floor: '7th Floor',
        area: 4200,
        amenities: [
          'Fully Plug & Play Furnished',
          '65 Workstations + 4 Cabins',
          '16-Seater Conference Room',
          'Server Room with Dedicated UPS',
          'Cafeteria & Pantry Area',
          'IGBC Green Certified',
          'Central HVAC Air Conditioning',
        ],
        description:
          'Move-in ready Grade-A corporate workspace in the prestigious BKC financial district. Fully equipped with ergonomic workstations, modern acoustic meeting pods, high-speed fiber connectivity, and dedicated basement parking.',
        coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
        images: [
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
        ],
        featured: true,
        status: 'published',
        seoTitle: 'Commercial Office Space for Rent in BKC Mumbai | PrimeVista',
        metaDescription: 'Plug and play Grade A office space for rent in BKC Mumbai with 65 workstations.',
        assignedAgent: agents[1]._id,
        createdBy: superAdmin._id,
      },
      {
        propertyId: 'PV-105',
        title: 'Serene Woods Estate — Gated 5BHK Royal Villa',
        slug: 'serene-woods-estate-gated-5bhk-royal-villa',
        purpose: 'Rent',
        category: 'Villa',
        price: 250000, // ₹2.5 Lakh / month
        rentalPeriod: 'month',
        address: 'Road No. 36, Extended Enclave',
        locality: 'Jubilee Hills',
        city: 'Hyderabad',
        bedrooms: 5,
        bathrooms: 6,
        floor: 'Independent G+2',
        area: 5800,
        amenities: [
          'Private Swimming Pool',
          'Lush Green Lawn & Patio',
          'Home Theater Room',
          'Servant Quarters with Bath',
          'Solar Water Heating',
          'CCTV Surveillance Network',
        ],
        description:
          'Majestic colonial-inspired 5BHK luxury estate for executive lease in Jubilee Hills. Nestled among mature green trees, it offers exquisite privacy, bespoke wood finishes, and vast entertaining spaces.',
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
        images: [
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
        ],
        featured: true,
        status: 'published',
        seoTitle: 'Luxury 5BHK Villa for Rent in Jubilee Hills | PrimeVista',
        metaDescription: '5BHK luxury villa for rent in Jubilee Hills Hyderabad with swimming pool and private lawn.',
        assignedAgent: agents[2]._id,
        createdBy: superAdmin._id,
      },
      {
        propertyId: 'PV-106',
        title: 'Oasis Serenade — Smart 3BHK River-View Suite',
        slug: 'oasis-serenade-smart-3bhk-river-view-suite',
        purpose: 'Buy',
        category: 'Apartment',
        price: 14500000, // ₹1.45 Crore
        address: 'North Main Road',
        locality: 'Koregaon Park',
        city: 'Pune',
        bedrooms: 3,
        bathrooms: 3,
        floor: '11th of 16',
        area: 1850,
        amenities: [
          'River Promenade View',
          'Heated Infinity Pool',
          'Co-working Lounge',
          'Yoga Deck & Zen Garden',
          'Biometric Lock Access',
          'EV Charging Stations',
        ],
        description:
          'Tranquil urban living in Pune’s most beloved cultural enclave. Designed with cross-ventilation, expansive balconies overlooking tree canopies, and smart automated environmental controls.',
        coverImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85',
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
        ],
        featured: false,
        status: 'published',
        seoTitle: 'Smart 3BHK Riverview Apartment in Koregaon Park Pune',
        metaDescription: '3BHK apartment in Koregaon Park Pune with modern amenities and scenic river view.',
        assignedAgent: agents[3]._id,
        createdBy: superAdmin._id,
      },
      {
        propertyId: 'PV-107',
        title: 'Grand Galleria — High Footfall Corner Retail Shop',
        slug: 'grand-galleria-high-footfall-corner-retail-shop',
        purpose: 'Buy',
        category: 'Shop',
        price: 22000000, // ₹2.20 Crore
        address: 'Sector 54, Main Golf Course Road',
        locality: 'Golf Course Road',
        city: 'Gurgaon',
        bedrooms: 0,
        bathrooms: 1,
        floor: 'Ground Floor Atrium',
        area: 1100,
        amenities: [
          'Direct Double Frontage Glass Display',
          'Central Air Conditioning',
          'Escalator Facing Location',
          'Multi-Level Basement Parking',
          '24/7 Power Backup',
        ],
        description:
          'High ROI premium corner retail unit situated right on Golf Course Road, Gurgaon. Surrounded by luxury high-rise communities, guaranteeing elite residential catchment and steady retail foot traffic.',
        coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
        images: [
          'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&w=1200&q=85',
        ],
        featured: false,
        status: 'published',
        seoTitle: 'Corner Retail Shop for Sale in Golf Course Road Gurgaon',
        metaDescription: 'High footfall retail shop for sale in Golf Course Road Gurgaon with double frontage.',
        assignedAgent: agents[1]._id,
        createdBy: superAdmin._id,
      },
      {
        propertyId: 'PV-108',
        title: 'Hillcrest Premium Villa Plot (60x80)',
        slug: 'hillcrest-premium-villa-plot-60x80',
        purpose: 'Buy',
        category: 'Plot',
        price: 18000000, // ₹1.80 Crore
        address: 'Banjara Enclave, Phase 2',
        locality: 'Devanahalli',
        city: 'Bengaluru',
        bedrooms: 0,
        bathrooms: 0,
        floor: 'Independent Plot',
        area: 4800,
        amenities: [
          'BIAAPA Approved Clear Title',
          'Underground Cabling & Water Supply',
          'Gated Township Security',
          '40-Feet Wide Asphalt Roads',
          'Avenue Plantation & Parks',
        ],
        description:
          'Exclusive 4,800 sq.ft villa plot in a boutique plotted development near Bangalore International Airport. Clear titles, bank-approved, ready for immediate bespoke villa construction.',
        coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85',
        images: [],
        featured: false,
        status: 'published',
        seoTitle: 'BIAAPA Approved Villa Plot in Devanahalli Bengaluru',
        metaDescription: '4800 sqft premium villa plot in Devanahalli Bengaluru near airport.',
        assignedAgent: agents[2]._id,
        createdBy: superAdmin._id,
      },
      {
        propertyId: 'PV-109',
        title: 'The Azure Crest — Seafront 4BHK Duplex (Draft Listing)',
        slug: 'the-azure-crest-seafront-4bhk-duplex',
        purpose: 'Buy',
        category: 'Apartment',
        price: 65000000,
        address: 'Carter Road',
        locality: 'Bandra West',
        city: 'Mumbai',
        bedrooms: 4,
        bathrooms: 4,
        floor: '12th & 13th Duplex',
        area: 3900,
        amenities: ['Sea View', 'Private Jacuzzi', 'Concierge Service'],
        description: 'Under documentation verification. Stunning Bandra duplex facing Carter Road promenade.',
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
        images: [],
        featured: false,
        status: 'draft', // Draft status to verify acceptance criteria 3
        seoTitle: 'Bandra Duplex Seafront Mumbai',
        metaDescription: 'Draft property listing for testing access rules.',
        assignedAgent: agents[0]._id,
        createdBy: superAdmin._id,
      },
      {
        propertyId: 'PV-110',
        title: 'Verdant Gardenia — 3BHK Luxury Flat (Sold Showcase)',
        slug: 'verdant-gardenia-3bhk-luxury-flat',
        purpose: 'Buy',
        category: 'Apartment',
        price: 16500000,
        address: 'Hiranandani Estate',
        locality: 'Thane West',
        city: 'Mumbai',
        bedrooms: 3,
        bathrooms: 3,
        floor: '8th of 22',
        area: 1620,
        amenities: ['Clubhouse', 'Gym', 'Swimming Pool'],
        description: 'Recently closed transaction by PrimeVista. Modern European style community flat.',
        coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
        images: [],
        featured: false,
        status: 'sold', // Sold status to test sold badge
        seoTitle: 'Hiranandani Estate 3BHK Flat',
        metaDescription: 'Sold property record.',
        assignedAgent: agents[0]._id,
        createdBy: superAdmin._id,
      },
    ]

    const properties = await Property.insertMany(propertiesData)
    console.log(`🏡 Seeded ${properties.length} Properties`)

    // 5. Seed Customer Inquiries across various statuses
    const inquiriesData = [
      {
        customerName: 'Rahul Verma',
        phone: '+91 98450 11223',
        email: 'rahul.verma@example.com',
        message: 'I am interested in scheduling a private tour of The Palm Heights penthouse this Saturday morning.',
        property: properties[0]._id,
        propertyTitle: properties[0].title,
        propertyId: properties[0].propertyId,
        inquiryType: 'site_visit',
        preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        preferredTime: '11:00 AM',
        status: 'Site Visit Scheduled',
        assignedAgent: agents[0]._id,
        followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        internalNotes: 'Client is an executive at an MNC. Pre-approved loan with HDFC bank.',
        activityLog: [
          { action: 'Inquiry Created', performedBy: 'Rahul Verma', details: 'Submitted via property details page' },
          { action: 'Agent Assigned', performedBy: 'System', details: `Assigned to ${agents[0].name}` },
          { action: 'Status Changed', performedBy: 'Vikramaditya Roy', details: 'Confirmed visit for Saturday 11am' },
        ],
        source: 'Website - Property Page',
      },
      {
        customerName: 'Meera Nambiar',
        phone: '+91 97412 88990',
        email: 'meera.nambiar@techcorp.in',
        message: 'Looking for a 3BHK villa in Whitefield. Could you please share the floor plan and association dues for Greenwood Meadows?',
        property: properties[1]._id,
        propertyTitle: properties[1].title,
        propertyId: properties[1].propertyId,
        inquiryType: 'property_inquiry',
        status: 'Contacted',
        assignedAgent: agents[2]._id,
        followUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        internalNotes: 'Shared PDF brochure on WhatsApp. Scheduled callback tomorrow 4 PM.',
        activityLog: [
          { action: 'Inquiry Created', performedBy: 'Meera Nambiar', details: 'Direct web lead' },
          { action: 'Contacted', performedBy: 'Rohit Malhotra', details: 'Called client and sent brochure' },
        ],
        source: 'Website - Property Page',
      },
      {
        customerName: 'Kunal Deshmukh',
        phone: '+91 98200 44556',
        email: 'kunal.d@fintechinvest.com',
        message: 'We are expanding our Mumbai office and need 60+ seats in BKC. Is Prime Corporate Plaza available for immediate possession?',
        property: properties[3]._id,
        propertyTitle: properties[3].title,
        propertyId: properties[3].propertyId,
        inquiryType: 'property_inquiry',
        status: 'Negotiation',
        assignedAgent: agents[1]._id,
        followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        internalNotes: 'Offered 5-year lock-in with 5% escalation. Reviewing draft lease deed.',
        activityLog: [
          { action: 'Inquiry Created', performedBy: 'Kunal Deshmukh', details: 'Commercial lead' },
          { action: 'Status Changed', performedBy: 'Ananya Sen', details: 'Inspection completed, term sheet under review' },
        ],
        source: 'Website - Commercial Inquiry',
      },
      {
        customerName: 'Sunita Reddy',
        phone: '+91 99490 66778',
        email: 'sunita.reddy@gmail.com',
        message: 'Interested in the Jubilee Hills villa for long-term company guest house lease.',
        property: properties[4]._id,
        propertyTitle: properties[4].title,
        propertyId: properties[4].propertyId,
        inquiryType: 'property_inquiry',
        status: 'New',
        assignedAgent: agents[2]._id,
        internalNotes: '',
        activityLog: [
          { action: 'Inquiry Created', performedBy: 'Sunita Reddy', details: 'Received new inquiry' },
        ],
        source: 'Website - Property Page',
      },
      {
        customerName: 'Aditya Kapoor',
        phone: '+91 98111 22334',
        email: 'aditya.kapoor@outlook.com',
        message: 'Looking for luxury investment properties in Bengaluru with high rental yield.',
        property: null,
        propertyTitle: 'General Investment Consultation',
        inquiryType: 'general',
        status: 'Qualified',
        assignedAgent: agents[3]._id,
        followUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        internalNotes: 'Budget ₹3 to ₹5 Crore. Interested in residential & commercial pre-leases.',
        activityLog: [
          { action: 'Inquiry Created', performedBy: 'Aditya Kapoor', details: 'General contact form' },
          { action: 'Qualified', performedBy: 'Pooja Hegde', details: 'Requirements mapped to portfolio' },
        ],
        source: 'Website - Contact Us',
      },
    ]

    await Inquiry.insertMany(inquiriesData)
    console.log(`📋 Seeded ${inquiriesData.length} Inquiries`)

    // 6. Seed PageContent for CMS
    const pagesContentData = [
      {
        pageKey: 'home',
        title: 'PrimeVista Real Estate — Home Page',
        sections: {
          heroBadge: 'Find a place to call home',
          heroTitle: 'Your Dream Home',
          heroHighlight: 'Is Just a Step Away',
          heroDescription:
            'Discover hand-picked residential, luxury villa, and commercial properties tailored to your ambition, lifestyle, and financial future with PrimeVista.',
          heroImage:
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
          stat1Number: '2,500+',
          stat1Label: 'Happy Families Housed',
          stat2Number: '98.6%',
          stat2Label: 'Client Satisfaction',
          stat3Number: '₹1,400 Cr+',
          stat3Label: 'Property Value Transacted',
          ctaTitle: 'Ready to Find Your Dream Property?',
          ctaSubtitle:
            'Our seasoned property advisors are here to guide you with verified legal titles, seamless visits, and end-to-end documentation.',
        },
        seoTitle: 'PrimeVista Real Estate | Better Spaces. Brighter Futures.',
        seoDescription:
          'Search verified apartments, villas, penthouses, and commercial spaces with PrimeVista Real Estate.',
        updatedBy: superAdmin._id,
      },
      {
        pageKey: 'about',
        title: 'About PrimeVista Real Estate',
        sections: {
          headline: 'Redefining Real Estate with Integrity & Sophistication',
          story:
            'Founded with a mission to bring complete transparency and architectural prestige to the Indian real estate landscape, PrimeVista represents the standard of excellence in property advisory. We don’t just showcase listings; we curate homes where memories are built and spaces that power business dreams.',
          mission:
            'To empower property seekers and corporate clients with verified, high-yield, aesthetically brilliant real estate choices backed by complete legal clarity.',
          vision:
            'To become India’s most trusted real estate consultancy known for integrity, customer-first service, and technological innovation.',
          values: [
            { title: 'Zero Compromise Transparency', desc: '100% verified documentation and clear title deeds for all listings.' },
            { title: 'Curated Elegance', desc: 'Every property is hand-inspected for build quality, ventilation, and premium design.' },
            { title: 'End-to-End Concierge', desc: 'From the first site inspection to key handover and registry, we stand beside you.' },
          ],
        },
        seoTitle: 'About Us | PrimeVista Real Estate',
        seoDescription: 'Learn about PrimeVista Real Estate, our values, mission, and experienced property advisory team.',
        updatedBy: superAdmin._id,
      },
      {
        pageKey: 'contact',
        title: 'Contact PrimeVista Real Estate',
        sections: {
          address: 'PrimeVista Executive Tower, Level 8, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
          phone: '+91 (080) 4567 8900',
          email: 'contact@primevista.com',
          supportEmail: 'support@primevista.com',
          officeHours: 'Monday – Saturday: 9:30 AM – 7:30 PM (Sunday by appointment)',
          mapEmbedUrl: 'https://maps.google.com/maps?q=Indiranagar+Bengaluru&t=&z=13&ie=UTF8&iwloc=&output=embed',
        },
        seoTitle: 'Contact Us | PrimeVista Real Estate',
        seoDescription: 'Get in touch with our property advisory team. Visit our Indiranagar office or schedule a consultation.',
        updatedBy: superAdmin._id,
      },
      {
        pageKey: 'faq',
        title: 'Frequently Asked Questions',
        sections: {
          faqs: [
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
          ],
        },
        seoTitle: 'FAQ | PrimeVista Real Estate',
        seoDescription: 'Find answers to common questions about buying, renting, site visits, and home loans with PrimeVista.',
        updatedBy: superAdmin._id,
      },
    ]

    await PageContent.insertMany(pagesContentData)
    console.log(`📄 Seeded ${pagesContentData.length} Page Content documents`)

    console.log('✨ Database seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
