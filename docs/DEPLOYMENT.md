# Deployment Guide

Complete guide for deploying Premium Estate CRM to production environments.

---

## 📋 Prerequisites

- Node.js >= 18.x
- MongoDB >= 5.0
- npm or yarn
- SSL Certificate (for production)
- Domain name (optional)

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-org/PremiumEstateCRM.git
cd PremiumEstateCRM
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration

#### Server (.env)

Create `server/.env`:

```env
# Server Configuration
PORT=5001
NODE_ENV=production

# Database
DB_URL=mongodb://localhost:27017
DB=PremiumEstateDB

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=15m

# CORS
CLIENT_URL=http://localhost:3000
PUBLIC_APP_URL=https://your-production-domain.com

# Payments (Stripe Checkout — optional)
STRIPE_PRIVATE_KEY=sk_live_...

# Default Users (comma-separated emails)
DEFAULT_USERS=admin@gmail.com
```

#### Client (.env)

Create `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_ENV=production
```

### 4. Database Setup

```bash
cd server
npm start
```

The application will automatically:
- Create database collections
- Set up indexes
- Create default admin user

**Default Admin Credentials:**
- Email: `admin@gmail.com`
- Password: `admin123`

⚠️ **Change these credentials immediately after first login!**

### 5. Run Database Migration

After first deployment, run the index migration script:

```bash
cd server
node scripts/migrate-indexes.js
```

### 6. Start Development Servers

```bash
# Terminal 1 - Server
cd server
npm start

# Terminal 2 - Client
cd client
npm start
```

---

## 🐳 Docker Deployment

### 1. Create Dockerfile (Server)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5001

CMD ["node", "index.js"]
```

### 2. Create Dockerfile (Client)

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Create docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    container_name: premium-estate-mongo
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secure-password

  server:
    build: ./server
    container_name: premium-estate-server
    restart: always
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - DB_URL=mongodb://admin:secure-password@mongodb:27017
      - DB=PremiumEstateDB
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - mongodb

  client:
    build: ./client
    container_name: premium-estate-client
    restart: always
    ports:
      - "80:80"
    depends_on:
      - server

volumes:
  mongo-data:
```

### 4. Build and Run

```bash
docker-compose up -d
```

---

## ☁️ Production Deployment

### AWS EC2

#### 1. Launch EC2 Instance

- Ubuntu 22.04 LTS
- t3.medium (minimum)
- 50GB storage

#### 2. Install Dependencies

```bash
sudo apt update
sudo apt install -y nodejs npm nginx mongodb-org

# Install PM2 globally
sudo npm install -g pm2
```

#### 3. Configure Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Client (React)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Server (API)
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4. Setup PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'premium-estate-server',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5001
    }
  }]
};
```

Start application:

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### 5. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Heroku

#### 1. Create Procfile (server/)

```
web: node index.js
```

#### 2. Deploy

```bash
heroku create your-app-name
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

---

### Vercel (Client) + Railway (Server)

#### Client (Vercel)

```bash
cd client
vercel --prod
```

#### Server (Railway)

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

---

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS allowed origins
- [ ] Set NODE_ENV=production
- [ ] Enable rate limiting
- [ ] Setup database backups
- [ ] Configure firewall rules
- [ ] Enable audit logging
- [ ] Setup monitoring (UptimeRobot, Sentry)

---

## 📊 Monitoring

### Health Check Endpoint

```
GET /
Response: "Welcome to my world..."
```

### Uptime Monitoring

Use UptimeRobot or Pingdom to monitor:
- `https://your-domain.com/`
- `https://your-domain.com/api/property/public`

### Log Files

- Server logs: `server/logs/audit.log`
- PM2 logs: `pm2 logs`

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: |
          cd server && npm ci
          cd ../client && npm ci
      
      - name: Run Tests
        run: cd server && npm test
      
      - name: Build Client
        run: cd client && npm run build
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/PremiumEstateCRM
            git pull
            cd server && npm ci
            cd ../client && npm ci && npm run build
            pm2 restart all
```

---

## 🗄️ Database Backup

### Manual Backup

```bash
mongodump --db PremiumEstateDB --out /backup/$(date +%Y%m%d)
```

### Automated Backup (Cron)

```bash
# Add to crontab (daily at 2 AM)
0 2 * * * mongodump --db PremiumEstateDB --out /backup/$(date +\%Y\%m\%d)
```

### Restore

```bash
mongorestore --db PremiumEstateDB /backup/20240101/PremiumEstateDB
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :5001

# Kill process
kill -9 <PID>
```

### MongoDB Connection Failed

```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### PM2 Process Crashed

```bash
# View logs
pm2 logs premium-estate-server

# Restart
pm2 restart premium-estate-server
```

---

## 📞 Support

For deployment issues:
1. Check server logs: `pm2 logs`
2. Verify environment variables
3. Test database connection
4. Check firewall rules
5. Review CORS configuration
