# 🏡 PrimeVista Real Estate — Platform & Management Suite

> **Better Spaces. Brighter Futures.**  
> A full-stack, enterprise-grade real estate property listing and customer inquiry management platform built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS.

---

## 🎨 Brand Design System

As specified in the **PrimeVista Requirements Specification**:

| Color Role | Hex Code | Description |
| :--- | :--- | :--- |
| **Primary Brand Green** | `#0F4C3A` | Deep Emerald Green used for headers, primary CTAs, active pills |
| **Accent Warm Gold** | `#F4B740` | Luxury Warm Gold used for highlights, featured badges, star accents |
| **Dark Slate** | `#1F2937` | Charcoal for typography, high-contrast headings, and footer |
| **Light Tint** | `#F5F7F5` | Soft background hue providing a calm, premium aesthetic |
| **White** | `#FFFFFF` | Card containers and elevated panels |
| **Typography** | `Poppins` & `Inter` | Modern geometric headlines with clean, highly legible body copy |

---

## 🏗️ Architecture & Clean Directory Structure

The project follows a modular, cleanly separated client-server architecture:

```
RealEstateProject/
├── .gitignore                     # Ignores node_modules, build dist, and sensitive .env files
├── README.md                      # Complete system documentation & setup guide
├── client/                        # React Frontend (Vite + Tailwind CSS v4 + Lucide Icons)
│   ├── public/
│   │   ├── favicon.svg            # Custom PrimeVista emerald house favicon
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js          # Centralized fetch client with Bearer auth & error handling
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLayout.jsx   # Collapsible sidebar, header with role badge, mobile drawer
│   │   │   │   ├── InquiryModal.jsx  # Lead dossier, pipeline progression, agent assignment, notes
│   │   │   │   ├── PropertyModal.jsx # Add & Edit property modal with image preview and validation
│   │   │   │   └── StatsCard.jsx     # Dynamic KPI metric cards with colored badge pills
│   │   │   ├── common/
│   │   │   │   ├── Footer.jsx        # 4-column rich dark footer with quick links and office info
│   │   │   │   └── Navbar.jsx        # Responsive navigation bar with brand logo & staff portal link
│   │   │   └── public/
│   │   │       ├── InquiryModal.jsx  # Customer viewing and site-visit scheduling modal
│   │   │       ├── PropertyCard.jsx  # Signature card with badges, INR price, specs, and agent
│   │   │       └── SearchHero.jsx    # Hero section with overlapping multi-tab search filter box
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Global authentication state, JWT storage, role verification
│   │   │   └── ToastContext.jsx      # Animated floating notifications (success/error/info)
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AgentsAdmin.jsx      # Agent roster management
│   │   │   │   ├── CMSAdmin.jsx         # Live website content editor (Hero, contacts, SEO)
│   │   │   │   ├── Dashboard.jsx        # Live statistics, recent inquiries, property cards
│   │   │   │   ├── InquiriesAdmin.jsx   # Lead pipeline manager with CSV export
│   │   │   │   ├── PropertiesAdmin.jsx  # Searchable property inventory table with actions
│   │   │   │   └── UsersAdmin.jsx       # Staff accounts & permissions (Super Admin only)
│   │   │   └── public/
│   │   │       ├── About.jsx            # Company introduction, mission, vision, core values
│   │   │       ├── Agents.jsx           # Agent profiles, contact details, active listings
│   │   │       ├── Contact.jsx          # Headquarters details, phone, email, contact form
│   │   │       ├── FAQ.jsx              # Accordion FAQ fetched from database
│   │   │       ├── Home.jsx             # Public homepage matching the design preview
│   │   │       ├── Login.jsx            # Management login with 1-click test credentials
│   │   │       ├── NotFound.jsx         # Custom 404 page
│   │   │       ├── Properties.jsx       # Listing page with search, filters, and pagination
│   │   │       ├── PropertyDetail.jsx   # Details page with gallery, specs, agent, inquiry form
│   │   │       └── Services.jsx         # Acquisition, leasing, and advisory service cards
│   │   ├── utils/
│   │   │   └── formatters.js            # INR currency formatter (Crore/Lakhs), dates, status colors
│   │   ├── App.jsx                      # App router with protected routes & role access control
│   │   ├── index.css                    # Tailwind CSS + custom glassmorphism and card styles
│   │   └── main.jsx                     # Vite entry point
│   ├── package.json
│   └── vite.config.js                   # Proxy configuration for /api -> port 5001
└── server/                        # Express REST API Backend
    ├── .env                             # Port, MongoDB URI, JWT Secret
    ├── .env.example                     # Environment template for GitHub
    ├── package.json
    └── src/
        ├── config/
        │   └── db.js                    # Resilient Mongoose connection with connection state logger
        ├── controllers/
        │   ├── agentController.js       # Agent CRUD and active listings counter
        │   ├── authController.js        # Login, profile, user creation, and status toggle
        │   ├── contentController.js     # CMS page content retrieval and updates
        │   ├── dashboardController.js   # Live database statistics aggregator
        │   ├── inquiryController.js     # Public inquiry capture, pipeline updates, follow-ups
        │   └── propertyController.js    # Search, filter, CRUD, status management
        ├── middleware/
        │   ├── auth.js                  # Bearer token verification & Role-Based Access Control
        │   ├── errorHandler.js          # Centralized error handler and 404 route catcher
        │   ├── security.js              # Helmet, strict CORS, and rate limiters
        │   └── validate.js              # Zod request body validation
        ├── models/
        │   ├── Agent.js                 # Agent schema
        │   ├── Inquiry.js               # Inquiry schema with activity audit log
        │   ├── PageContent.js           # Dynamic CMS page content schema
        │   ├── Property.js              # Property schema with unique ID, slug, and amenities
        │   └── User.js                  # Staff user schema with bcryptjs password hashing
        ├── routes/
        │   ├── agentRoutes.js
        │   ├── authRoutes.js
        │   ├── contentRoutes.js
        │   ├── dashboardRoutes.js
        │   ├── inquiryRoutes.js
        │   └── propertyRoutes.js
        ├── scripts/
        │   └── seedDatabase.js          # Database seeder with sample properties, agents, inquiries
        ├── utils/
        │   ├── generateId.js            # Unique property ID generator (e.g. PV-101)
        │   └── slugify.js               # SEO friendly URL slug generator
        └── index.js                     # Express server bootstrapper
```

---

## 🛡️ Security Implementation

| Security Feature | Implementation Mechanism | Purpose |
| :--- | :--- | :--- |
| **HTTP Headers** | `helmet()` | Mitigates XSS, MIME sniffing, clickjacking |
| **Rate Limiting** | `express-rate-limit` | `loginLimiter` (15/15m) prevents brute force; `inquiryLimiter` (20/15m) blocks spam |
| **CORS Policy** | Whitelist in `server/src/middleware/security.js` | Restricts API requests to approved client origin |
| **Password Hashing** | `bcryptjs` (salt rounds: 10) | Passwords are never stored in plain text |
| **Authentication** | `jsonwebtoken` (HS256, 7-day expiry) | Stateless cryptographic token passed in `Authorization: Bearer <token>` |
| **Role-Based Access (RBAC)** | `authorize('super_admin', 'admin', 'agent')` | Enforced at the server/API layer, not just hidden in the UI |
| **Input Validation** | `zod` schemas | Sanitizes and validates request bodies before reaching controllers |
| **Data Isolation** | Query filters | `draft` and `archived` properties are inaccessible on public routes |

---

## 🔑 Demo Login Credentials

The login page at `/login` provides **1-Click Test Credential Buttons** to test all three system roles:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@primevista.com` | `Password@123` | Full system access, staff accounts, all properties & inquiries |
| **Admin** | `priya@primevista.com` | `Password@123` | Properties management, customer inquiries, CMS content |
| **Agent** | `agent@primevista.com` | `Password@123` | Assigned customer inquiries and site visit schedules |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v18+ (verified on v25.1.0)
- **MongoDB** running locally on `127.0.0.1:27017` or a MongoDB Atlas URI

### 1. Backend Server Setup
```bash
cd server
npm install
npm run seed     # Seeds properties, inquiries, agents, and default accounts
npm run dev      # Starts API server on http://localhost:5001
```

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev      # Starts Vite server on http://localhost:5173
```

---

## 📦 Pushing to Your GitHub Repository

Git is initialized and the initial commit is created. To upload to your GitHub account:

1. Create a new repository on [GitHub](https://github.com/new) named `primevista-real-estate` (do not initialize with README).
2. Run these commands from the project root:

```bash
git remote add origin https://github.com/YOUR-USERNAME/primevista-real-estate.git
git branch -M main
git push -u origin main
```
