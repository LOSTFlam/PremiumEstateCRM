# 🏠 Premium Estate CRM

> **Version:** 1.0.0 — Ethereal Luxury Edition  
> **Author:** [LOSTFlam](https://github.com/LOSTFlam) (Alexander Avdeev)  
> **Stack:** MERN (MongoDB, Express, React 18, Node.js)

<div align="center">

[![Version](https://img.shields.io/badge/version-1.0.0-gold?style=for-the-badge)](https://github.com/LOSTFlam/PremiumEstateCRM/releases)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Node.js-25+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-2.8.2-319795?style=for-the-badge&logo=chakraui)](https://chakra-ui.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?style=for-the-badge)](https://www.framer.com/motion/)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📧 Notification Setup](#-notification-setup)
- [🎨 Design System](#-design-system)
- [🔒 Security](#-security)
- [📁 Project Structure](#-project-structure)
- [🧪 Testing](#-testing)
- [📦 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🏠 Property Management
- **Property Catalog** — apartments, houses, land plots, commercial
- **SEO Optimization** — public pages with meta tags
- **Media Gallery** — photos, videos, virtual tours, documents
- **Smart Search** — filters by price, type, location, area
- **Property Comparison** — side-by-side feature comparison

### 👥 CRM & Leads
- **Kanban Board** — visual sales pipeline management
- **Contact Management** — complete interaction history
- **Auto Notifications** — email + SMS on new inquiries
- **Tasks & Meetings** — scheduling and tracking
- **Invoices & Quotes** — PDF document generation

### 📊 Analytics
- **Real-time Dashboard** — KPIs, charts, metrics
- **Reports** — conversion rates, traffic sources, revenue
- **Data Export** — Excel, CSV, PDF

### 🎨 Premium UI/UX
- **Ethereal Luxury Design** — glassmorphism, gold accents
- **Animations** — 40+ keyframes, Framer Motion transitions
- **Page Transitions** — smooth page-to-page animations
- **Command Palette** — navigation via `Cmd+K`
- **Scroll-to-top** — smooth return button
- **Dark & Light Themes** — with system auto-detection
- **PWA** — installable on device, offline mode

### 🔔 Notifications
- **Email** — via Resend (beautiful HTML templates)
- **SMS** — via Twilio or SMSC.ru (mock in dev)
- **Real-time** — WebSocket for instant updates

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  Frontend (React 18)             │
│  ┌──────────┬──────────┬──────────┬──────────┐  │
│  │ Chakra   │ Framer   │ Redux    │ React    │  │
│  │ UI 2.8   │ Motion 11│ Toolkit  │ Query v5 │  │
│  └──────────┴──────────┴──────────┴──────────┘  │
│  ┌──────────────────────────────────────────┐   │
│  │  PremiumCard · MagneticButton ·          │   │
│  │  ScrollRevealPro · CommandPalette        │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────┘
                      │ REST API + WebSocket
┌─────────────────────┴───────────────────────────┐
│                  Backend (Node.js)               │
│  ┌──────────┬──────────┬──────────┬──────────┐  │
│  │ Express  │ Mongoose │ JWT Auth │ Nodemailer│ │
│  │ 4.x      │ 7.x      │ Refresh  │ / Resend │  │
│  └──────────┴──────────┴──────────┴──────────┘  │
│  ┌──────────────────────────────────────────┐   │
│  │  Rate Limiting · Helmet · Compression    │   │
│  │  Cache Middleware · Audit Logging         │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────┐
│              MongoDB Atlas                       │
│  ┌──────────────────────────────────────────┐   │
│  │  Indexed Collections · Connection Pool   │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (recommended 25+)
- **MongoDB** — local or MongoDB Atlas
- **npm** or **yarn**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/LOSTFlam/PremiumEstateCRM.git
cd PremiumEstateCRM

# 2. Install server dependencies
cd server
cp .env.example .env
# Edit .env — set MongoDB URL and Resend API key
npm install

# 3. Install client dependencies
cd ../client
npm install --legacy-peer-deps

# 4. Create MongoDB indexes
cd ../server
npm run seed:index

# 5. Start the server (port 5001)
npm start

# 6. In a new terminal, start the client (port 3000)
cd ../client
npm start
```

Open **http://localhost:3000** — the landing page is ready!

---

## 📧 Notification Setup

### Email (Resend)
1. Register at [resend.com](https://resend.com)
2. Create an API Key in Dashboard
3. Add to `server/.env`:
```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@premiumestatecrm.com
ADMIN_EMAIL=your_email@gmail.com
```

### SMS (Twilio or SMSC.ru)
```env
# Twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# Or SMSC.ru (for Russia)
SMSC_LOGIN=your_login
SMSC_PASSWORD=your_password
SMSC_SENDER=PremiumEstate
```

Without SMS keys, notifications are logged to the server console (mock mode).

---

## 🎨 Design System

### Color Palette
| Palette | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---------|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| **Gold** | #FFFDF5 | #FFF9E6 | #F5E6B8 | #F5D076 | #E8C46B | **#D4AF37** | #B8962E | #9C7D25 | #7A621D | #584715 |
| **Platinum** | #F9FAFB | #F3F4F6 | #E5E7EB | #D1D5DB | #9CA3AF | **#6B7280** | #4B5563 | #374151 | #1F2937 | #111827 |
| **Bronze** | #FFF8F0 | #FFE8CC | #FFD1A3 | #FFB575 | #FF9947 | **#FF7D19** | #E66600 | #B34F00 | #803800 | #4D2100 |

### Premium Components
| Component | Description |
|-----------|-------------|
| **PremiumCard** | Card with 3D parallax, glow, shimmer effects |
| **MagneticButton** | Button with cursor attraction physics |
| **ScrollRevealPro** | 7 scroll-reveal animation directions |
| **CommandPalette** | Global navigation via `Cmd+K` |
| **ParticleUniverse** | Three.js 3D particle background |

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `Cmd+K` / `Ctrl+K` | Open Command Palette |
| `Esc` | Close modals |

---

## 🔒 Security

- **JWT with refresh token** — automatic session renewal
- **Rate limiting** — brute force and spam protection
- **Helmet** — HTTP security headers
- **Password validation** — complexity + password history
- **Account lockout** — after failed attempts
- **Input sanitization** — all incoming data validated
- **Audit logging** — critical actions logged

---

## 📁 Project Structure

```
PremiumEstateCRM/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # PremiumCard, MagneticButton
│   │   │   ├── animations/          # ScrollRevealPro
│   │   │   ├── effects/             # ParticleUniverse
│   │   │   ├── skeletons/           # Loading skeletons
│   │   │   └── ...
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── views/
│   │   │   ├── admin/               # Admin dashboard pages
│   │   │   └── public/              # Public catalog pages
│   │   ├── redux/                   # Redux Toolkit store
│   │   ├── services/                # API client (JS + TS)
│   │   ├── theme/                   # Chakra UI theme
│   │   ├── styles/                  # Premium CSS effects
│   │   ├── types/                   # TypeScript types
│   │   └── utils/                   # Helpers, validators
│   └── public/
│       ├── manifest.json            # PWA manifest
│       └── service-worker.js        # PWA service worker
│
├── server/                          # Node.js Backend
│   ├── controllers/                 # Route handlers
│   ├── model/schema/                # Mongoose models
│   ├── services/
│   │   ├── notificationService.js   # Email + SMS
│   │   ├── websocket.js             # Real-time updates
│   │   └── mediaService.js          # File management
│   ├── middelwares/
│   │   ├── auth.js                  # JWT + refresh tokens
│   │   ├── cache.js                 # Response caching
│   │   ├── auditLog.js              # Activity logging
│   │   └── passwordValidator.js     # Password strength
│   └── scripts/
│       └── createIndexes.js         # MongoDB indexes
│
└── README.md                        # This file
```

---

## 🧪 Testing

```bash
# Server
cd server
npm test              # Run tests
npm run test:watch    # Watch mode

# Client
cd client
npm test              # Run tests
```

---

## 📦 Deployment

### Production .env
```env
NODE_ENV=production
DB_URL=mongodb+srv://user:pass@cluster.mongodb.net/PremiumEstateDB
RESEND_API_KEY=re_your_key
EMAIL_FROM=noreply@premiumestatecrm.com
ADMIN_EMAIL=your_email@gmail.com
JWT_SECRET=your-production-secret
JWT_EXPIRES_IN=7d
PORT=5001
CLIENT_URL=https://yourdomain.com
```

### Build
```bash
# Client
cd client
npm run build

# Server
cd server
NODE_ENV=production npm start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Made with ❤️ by [LOSTFlam](https://github.com/LOSTFlam)**

[![GitHub](https://img.shields.io/badge/GitHub-LOSTFlam-181717?style=for-the-badge&logo=github)](https://github.com/LOSTFlam)

</div>
