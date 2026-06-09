# 🏗️ Setup Guide

Quick setup guide for Premium Estate CRM - from clone to running in minutes!

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download |
|----------|---------|----------|
| **Node.js** | 14.x or higher | [nodejs.org](https://nodejs.org/) |
| **MongoDB** | 4.4.x or higher | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **npm** | 6.x or higher | Comes with Node.js |

### Verify Installation

```bash
node --version    # Should show v14.x or higher
npm --version     # Should show 6.x or higher
mongod --version  # Should show 4.4.x or higher
git --version     # Should show 2.x or higher
```

---

## 🚀 Quick Start (5 minutes)

### Step 1: Clone the Repository

```bash
git clone https://github.com/LOSTFlam/PremiumEstateCRM.git
cd PremiumEstateCRM
```

### Step 2: Install Dependencies

```bash
# Install all dependencies (root + workspaces)
npm install
```

This will install dependencies for:
- Root workspace
- Client (`/client`)
- Server (`/server`)

### Step 3: Configure Environment Variables

#### Server Configuration

```bash
# Navigate to server directory
cd server

# Copy example environment file
cp .env.example .env

# Edit .env with your settings (optional - defaults work for local dev)
nano .env
```

**Default server .env (works out of the box):**
```env
PORT=5001
NODE_ENV=development
DB_URL=mongodb://127.0.0.1:27017
DB=PremiumEstateDB
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:3000
DEFAULT_USERS=admin@gmail.com,user@gmail.com
```

#### Client Configuration

```bash
# Navigate to client directory
cd ../client

# Copy example environment file
cp .env.example .env
```

**Default client .env (works out of the box):**
```env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_NODE_ENV=development
GENERATE_SOURCEMAP=false
```

### Step 4: Start MongoDB

**Linux (systemd):**
```bash
sudo systemctl start mongod
```

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Windows:**
```bash
# Run as Administrator
net start MongoDB
```

**Or manually:**
```bash
mongod --dbpath /data/db
```

### Step 5: Start the Application

#### Recommended (auto-open browser)

```bash
# Starts server + client and opens:
# - http://127.0.0.1:5173 (site)
# - http://127.0.0.1:5001/api/health/status (API health)
npm run dev:open
```

#### Optional: Seed sample properties (so admin sees objects)

```bash
npm run seed:properties
```

#### Option A: Start Both Servers (Recommended)

From the root directory:
```bash
npm run dev
```

This starts both:
- Server on http://localhost:5001
- Client on http://localhost:3000

#### Option B: Start Separately

**Terminal 1 - Server:**
```bash
cd server
npm start
```

**Terminal 2 - Client:**
```bash
cd client
npm start
```

### Step 6: Open in Browser

Navigate to: **http://localhost:3000**

---

## 👤 Default Login Credentials

After setup, you can login with these default accounts:

### Admin Account
- **Email:** `admin@gmail.com`
- **Password:** `admin123`
- **Role:** Administrator

### User Account
- **Email:** `user@gmail.com`
- **Password:** `user123`
- **Role:** User

---

## 📁 Project Structure

```
PremiumEstateCRM/
├── client/                 # React Frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── views/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utilities
│   │   ├── services/      # API services
│   │   ├── theme/         # Chakra UI theme
│   │   └── i18n/          # Translations
│   ├── .env.example       # Client env template
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middlewares/      # Auth & validation
│   ├── .env.example      # Server env template
│   └── package.json
│
├── .github/              # GitHub configurations
│   ├── ISSUE_TEMPLATE/   # Issue templates
│   ├── workflows/        # CI/CD pipelines
│   └── PULL_REQUEST_TEMPLATE.md
├── CODE_OF_CONDUCT.md    # Community guidelines
├── CONTRIBUTING.md       # Contribution guide
├── LICENSE              # MIT License
├── SECURITY.md          # Security policy
└── README.md            # Main documentation
```

---

## 🔧 Common Setup Issues

### Issue: MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod    # Linux
brew services list              # macOS

# Start MongoDB
sudo systemctl start mongod     # Linux
brew services start mongodb-community  # macOS
```

### Issue: Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Find process using the port
lsof -i :5001    # Server port
lsof -i :3000    # Client port

# Kill the process
kill -9 <PID>
```

### Issue: Node Modules Errors

**Error:** `Cannot find module`

**Solution:**
```bash
# Clean and reinstall
rm -rf node_modules client/node_modules server/node_modules
rm -rf package-lock.json client/package-lock.json server/package-lock.json
npm run install-all
```

### Issue: React Build Errors

**Error:** Various build errors

**Solution:**
```bash
# Clear cache
cd client
npm cache clean --force
rm -rf node_modules/.cache
npm install

# Try again
npm start
```

### Issue: Permission Errors (Linux/macOS)

**Error:** `EACCES: permission denied`

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

---

## 🧪 Testing

### Run Server Tests
```bash
cd server
npm test
```

### Run Client Tests
```bash
cd client
npm test
```

### Run Linting
```bash
cd server
npm run lint

cd ../client
npm run lint
```

---

## 📦 Build for Production

### Build Client
```bash
cd client
npm run build
```

The build artifacts will be in `client/build/`.

### Start Production Server
```bash
cd server
NODE_ENV=production npm start
```

---

## 🔄 Updating

To update your local copy:

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm run install-all

# Restart servers
npm run dev
```

---

## 🛠️ Development Tips

### Hot Reload
Both server and client support hot reload:
- **Server:** Uses nodemon - auto-restarts on file changes
- **Client:** React Fast Refresh - auto-updates browser

### Debugging

**Server:**
```bash
# With debugging
cd server
node --inspect index.js
```

Then open `chrome://inspect` in Chrome.

**Client:**
- Open DevTools (F12)
- Use React DevTools extension
- Check Console and Network tabs

### Database Management

**Connect to MongoDB:**
```bash
mongosh
use PremiumEstateDB
```

**Useful Commands:**
```javascript
// Show all collections
show collections

// Count documents
db.properties.countDocuments()
db.users.countDocuments()

// Find all users
db.users.find()

// Drop database (careful!)
db.dropDatabase()
```

---

## 📚 Next Steps

After setup:

1. ✅ **Explore the application** - Browse features
2. 📖 **Read documentation** - [README.md](README.md)
3. 🤝 **Contributing guide** - [CONTRIBUTING.md](CONTRIBUTING.md)
4. 📋 **Code of conduct** - [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
5. 🔒 **Security policy** - [SECURITY.md](SECURITY.md)

---

## 🆘 Getting Help

If you encounter issues:

1. **Check this guide** - Common issues section
2. **Search issues** - [GitHub Issues](https://github.com/LOSTFlam/PremiumEstateCRM/issues)
3. **Create an issue** - Use our [issue template](.github/ISSUE_TEMPLATE/bug_report.md)
4. **Join discussions** - [GitHub Discussions](https://github.com/LOSTFlam/PremiumEstateCRM/discussions)
5. **Contact:** Александр Авдеев (LOSTFlam) - support@premiumestate.com

---

## ✅ Setup Checklist

Use this checklist to ensure everything is set up correctly:

- [ ] Node.js 14+ installed
- [ ] MongoDB 4.4+ installed and running
- [ ] Git installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm run install-all`)
- [ ] Server `.env` created (copy from `.env.example`)
- [ ] Client `.env` created (copy from `.env.example`)
- [ ] MongoDB is running
- [ ] Server starts without errors (port 5001)
- [ ] Client starts without errors (port 3000)
- [ ] Can access http://localhost:3000
- [ ] Can login with default credentials
- [ ] Can navigate through the application

---

**Happy coding! 🚀**

For more information, see [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

---

*Last Updated: April 1, 2026*
*Version: 1.0.0*
