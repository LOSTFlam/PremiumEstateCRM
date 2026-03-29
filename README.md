# 🏠 Premium Estate CRM

A modern, premium real estate management system with advanced property listings, lead management, and analytics.

![Premium Estate CRM](https://img.shields.io/badge/version-0.3.1.26-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-17.0.2-blue)
![Node](https://img.shields.io/badge/Node-14+-green)

---

## ✨ Features

### 🌐 Public Portal

#### Property Discovery
- **Advanced Search & Filters** - Filter by price, area, bedrooms, bathrooms, location, property type
- **Property Details Page** - Full property information with image gallery, video tours, floor plans
- **Interactive Map** - View properties on map (Google Maps/Mapbox integration ready)
- **Similar Properties** - AI-powered property recommendations

#### User Tools
- **Favorites** - Save properties with PDF export and sharing
- **Compare** - Side-by-side property comparison (up to 3 properties)
- **Lead Capture Forms** - Schedule viewing, request info, make offers
- **Multi-language** - English & Russian support
- **Dark/Light Theme** - Auto-detect system preference

### 👤 User Dashboard
- Saved properties and searches
- Viewing appointments
- Communication history
- Document management

### 🔧 Admin Panel

#### Analytics Dashboard
- **6 Key Metrics** - Views, leads, favorites, comparisons, conversion rate, properties
- **Growth Indicators** - Trend analysis with percentage changes
- **Views by Type** - Property type distribution charts
- **Recent Activity** - Real-time user activity feed
- **Popular Properties** - Top performing listings with conversion rates
- **Export Reports** - PDF export functionality

#### Lead Management
- **Kanban Board** - Visual pipeline with 7 statuses
- **Status Workflow**: New → Contacted → Qualified → Viewing → Offer → Closed/Lost
- **Quick Actions** - Change status, add notes, contact lead
- **Search & Filter** - Find leads by name, email, property, status
- **Communication History** - Track all interactions

#### Property Management
- Add/Edit/Delete properties
- Bulk import/export (CSV, Excel)
- Photo management with drag-and-drop
- Floor plan uploads
- Video tour integration
- Property verification system

#### User Management
- Role-based access control
- User permissions
- Activity logs
- Account management

#### Additional Modules
- **Contacts** - CRM contact management
- **Opportunities** - Deal tracking
- **Invoices & Quotes** - Financial documents
- **Meetings & Tasks** - Schedule management
- **Email Templates** - Pre-built email campaigns
- **Phone Calls** - Call logging
- **Documents** - File management
- **Reports** - Custom report generation
- **Custom Fields** - Flexible data structure

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- MongoDB 4.4+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/LOSTFlam/PremiumEstateCRM.git
cd PremiumEstateCRM

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Configure environment variables
# Server: server/.env
# Client: client/.env

# Start development servers
# Terminal 1 - Server
cd server
npm start

# Terminal 2 - Client
cd client
npm start
```

### Environment Variables

**Server (.env):**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/premium-estate
JWT_SECRET=your-secret-key
NODE_ENV=development
```

**Client (.env):**
```env
REACT_APP_API_URL=http://localhost:5001
NODE_ENV=development
```

---

## 📁 Project Structure

```
PremiumEstateCRM/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── property/  # Property-specific components
│   │   │   ├── Modern*.jsx # Landing page components
│   │   │   └── ...
│   │   ├── views/         # Page components
│   │   │   ├── admin/     # Admin pages
│   │   │   ├── public/    # Public pages
│   │   │   └── auth/      # Auth pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── services/      # API services
│   │   ├── theme/         # Chakra UI theme
│   │   └── i18n/          # Translations
│   └── package.json
│
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middlewares/      # Auth, validation
│   └── index.js          # Entry point
│
└── README.md
```

---

## 🎨 Design Features

### Premium UI/UX
- **Glassmorphism Effects** - Modern frosted glass design
- **Smooth Animations** - 40+ CSS animations
- **Dark Mode** - System-aware theme switching
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG 2.1 compliant

### Visual Effects
- Mouse-following glow effects
- Floating gradient orbs
- Shimmer particles
- Parallax backgrounds
- Card hover animations
- Gradient borders

---

## 📊 Tech Stack

### Frontend
- **React 17** - UI library
- **Chakra UI** - Component library
- **React Router** - Navigation
- **i18next** - Internationalization
- **Redux Toolkit** - State management
- **React Query** - Data fetching
- **Formik** - Form handling

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

### DevOps
- **Git** - Version control
- **npm** - Package manager

---

## 🔑 Key Routes

### Public Routes
```
/                    - Homepage
/offers              - Property catalog
/property/:slug      - Property details
/favorites           - Saved properties
/offers/compare      - Compare properties
/auth/sign-in        - Login
/auth/sign-up        - Register
```

### Admin Routes
```
/admin/dashboard     - Admin dashboard
/admin/analytics     - Analytics dashboard
/admin/leads         - Lead management (Kanban)
/admin/properties    - Property management
/admin/users         - User management
/admin/contacts      - Contacts CRM
/admin/opportunities - Opportunities
/admin/invoices      - Invoices
/admin/reports       - Reports
```

---

## 📖 User Guide

### For Property Buyers

1. **Browse Properties**
   - Visit `/offers` to see all listings
   - Use filters to narrow down search
   - Save favorites for later

2. **View Details**
   - Click on any property for full details
   - View photo gallery
   - Check location on map
   - Read property description

3. **Take Action**
   - Schedule a viewing
   - Request more information
   - Make an offer
   - Compare with other properties

### For Real Estate Agents

1. **Manage Properties**
   - Add new listings
   - Upload photos and documents
   - Update property status
   - Track views and leads

2. **Handle Leads**
   - View lead pipeline (Kanban)
   - Update lead status
   - Add notes and follow-ups
   - Schedule viewings

3. **Analyze Performance**
   - Check analytics dashboard
   - View popular properties
   - Track conversion rates
   - Export reports

### For Administrators

1. **User Management**
   - Create/edit users
   - Assign roles
   - Manage permissions
   - Monitor activity

2. **System Configuration**
   - Custom fields
   - Email templates
   - Validation rules
   - Module settings

---

## 🔒 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Role-based access control
- Input validation
- XSS protection
- CSRF protection
- Rate limiting ready

---

## 📈 Performance

- **60fps** animations
- **Lazy loading** components
- **Code splitting** for faster loads
- **Image optimization**
- **Caching** strategies
- **MongoDB indexing**

---

## 🌍 Languages

Currently supported:
- 🇬🇧 English (EN)
- 🇷🇺 Russian (RU)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 Changelog

### Version 0.3.1.26 (Latest)
**✨ New Features:**
- Analytics Dashboard with 6 key metrics
- Lead Kanban Board with 7 statuses
- Enhanced Favorites with PDF export
- Improved Compare page
- Dark theme toggle
- Property detail page with gallery
- Advanced search filters
- Lead capture forms

**🐛 Bug Fixes:**
- Fixed React warnings
- Fixed DOM nesting issues
- Fixed memory leaks
- Removed unused code

**⚡ Performance:**
- Optimized animations
- Reduced bundle size
- Improved load times

### Version 0.2.0
- Initial public release
- Basic property management
- User authentication
- CRM modules

---

## 📞 Support

- **Email:** support@premiumestate.com
- **Documentation:** See `/docs` folder
- **Issues:** GitHub Issues

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👨‍💻 Author

**LOSTFlam**
- GitHub: [@LOSTFlam](https://github.com/LOSTFlam)
- Project: [Premium Estate CRM](https://github.com/LOSTFlam/PremiumEstateCRM)

---

## 🙏 Acknowledgments

- Chakra UI team for amazing components
- React community for excellent documentation
- All contributors and supporters

---

## 📊 Statistics

- **15+** Core Features
- **40+** Animations
- **6** Admin Modules
- **7** Lead Statuses
- **2** Languages
- **100%** Responsive

---

**Made with ❤️ for Real Estate Professionals**

⭐ Star this repo if you find it helpful!
