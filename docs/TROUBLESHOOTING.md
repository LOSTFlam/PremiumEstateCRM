# Troubleshooting Guide

Common issues and solutions for Premium Estate CRM.

---

## 🔐 Authentication Issues

### Problem: "Authentication failed, token missing"

**Possible Causes:**
- Token expired (15 minutes)
- User logged out from another device
- Cookie not being sent with requests

**Solutions:**
1. Refresh the page to get a new token via refresh token
2. Clear browser cookies and login again
3. Check if `NODE_ENV` is set correctly (affects cookie secure flag)
4. Verify CORS configuration includes your frontend URL

---

### Problem: "Account temporarily locked"

**Cause:** Too many failed login attempts (5 attempts in 15 minutes)

**Solutions:**
1. Wait 15 minutes for automatic unlock
2. Admin can unlock via database:
```javascript
db.User.updateOne(
  { username: "user@example.com" },
  { $set: { lockedUntil: null, failedLoginAttempts: 0 } }
)
```

---

### Problem: "Session expired. Please login again"

**Cause:** 30 minutes of inactivity

**Solution:** Login again. Session timeout is a security feature.

---

## 🗄️ Database Issues

### Problem: "Database Not connected"

**Possible Causes:**
- MongoDB not running
- Incorrect connection string
- Network issues

**Solutions:**
1. Check MongoDB status:
```bash
sudo systemctl status mongod
```

2. Start MongoDB:
```bash
sudo systemctl start mongod
```

3. Verify connection string in `server/.env`:
```env
DB_URL=mongodb://localhost:27017
DB=PremiumEstateDB
```

4. Test connection:
```bash
mongosh mongodb://localhost:27017/PremiumEstateDB
```

---

### Problem: Slow queries

**Solutions:**
1. Run index migration:
```bash
cd server
node scripts/migrate-indexes.js
```

2. Check query performance in MongoDB:
```javascript
db.Properties.find({ deleted: false }).explain("executionStats")
```

3. Ensure indexes exist:
```javascript
db.Properties.getIndexes()
db.User.getIndexes()
```

---

## 📁 File Upload Issues

### Problem: "No file uploaded"

**Possible Causes:**
- Missing form data encoding
- File size exceeds limit
- Wrong field name

**Solutions:**
1. Ensure form has `encType="multipart/form-data"`
2. Check file size limits:
   - Images: 10MB
   - Documents: 25MB
   - Videos: 100MB

3. Verify field name matches API expectation:
   - Property photos: `property`
   - Documents: `property`

---

### Problem: "File type not allowed"

**Allowed file types:**
- Images: JPEG, PNG, GIF, WebP, SVG, AVIF
- Documents: PDF, DOC, DOCX, XLS, XLSX, CSV, RTF
- Videos: MP4, WebM, OGG, MOV

**Solution:** Convert file to supported format.

---

### Problem: Orphaned files accumulating

**Solution:** Run cleanup endpoint:
```bash
curl -X POST http://localhost:5001/api/media/orphaned/cleanup \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🌐 CORS Issues

### Problem: "Not allowed by CORS"

**Solution:** Add your frontend URL to `server/.env`:
```env
CLIENT_URL=http://your-frontend-domain.com
```

For multiple origins:
```env
CLIENT_URL=http://localhost:3000,https://your-domain.com
```

---

## 🚀 Server Issues

### Problem: "Port already in use"

**Solution:**
1. Find process using the port:
```bash
lsof -i :5001
```

2. Kill the process:
```bash
kill -9 <PID>
```

3. Or use a different port:
```env
PORT=5002
```

---

### Problem: Server crashes on startup

**Check:**
1. Node.js version (requires >= 18):
```bash
node --version
```

2. Install dependencies:
```bash
cd server
npm install
```

3. Check for syntax errors:
```bash
node --check index.js
```

4. View error logs:
```bash
# If using PM2
pm2 logs

# Or check console output
```

---

## 🖥️ Client Issues

### Problem: Blank page after build

**Solutions:**
1. Check browser console for errors
2. Verify API URL in `client/.env`:
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

3. Clear browser cache and rebuild:
```bash
cd client
npm run build
```

---

### Problem: Images not loading

**Solutions:**
1. Check upload directory permissions:
```bash
chmod -R 755 server/uploads
```

2. Verify static file serving in server routes
3. Check browser network tab for 404 errors

---

## 📧 Email Issues

### Problem: Emails not sending

**Check:**
1. Email configuration in `server/.env`:
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

2. For Gmail, use App Password (not account password)
3. Check email logs:
```javascript
// Add to mail.js middleware
console.log('Email sent to:', info.messageId);
```

---

## 🔒 Security Issues

### Problem: npm audit vulnerabilities

**Solution:**
```bash
cd server
npm audit
npm audit fix

# For critical fixes
npm audit fix --force
```

---

### Problem: JWT_SECRET not configured

**Solution:** Add to `server/.env`:
```env
JWT_SECRET=your-random-secret-key-at-least-32-characters
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📊 Performance Issues

### Problem: Slow page loads

**Solutions:**
1. Enable compression (already configured in `server/index.js`)
2. Check database indexes
3. Optimize images before upload
4. Enable browser caching
5. Use CDN for static assets

---

### Problem: High memory usage

**Solutions:**
1. Check for memory leaks:
```bash
node --inspect index.js
```

2. Increase Node.js memory limit:
```bash
NODE_OPTIONS="--max-old-space-size=4096" node index.js
```

3. Restart server periodically via PM2:
```bash
pm2 restart all --max-memory-restart 1G
```

---

## 🐛 Common Errors

### "Cannot read property of undefined"

**Cause:** Missing data or failed API call

**Solution:**
1. Check browser console for specific error
2. Verify API response structure
3. Add null checks in code

---

### "ECONNREFUSED 127.0.0.1:27017"

**Cause:** MongoDB not running

**Solution:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Auto-start on boot
```

---

### "ENOENT: no such file or directory"

**Cause:** Missing directory or file

**Solution:**
```bash
# Create required directories
mkdir -p server/uploads/Property/PropertyPhotos
mkdir -p server/uploads/Property/virtual-tours-or-videos
mkdir -p server/uploads/Property/floor-plans
mkdir -p server/uploads/Property/property-documents
mkdir -p server/uploads/images
mkdir -p server/logs
```

---

## 📞 Getting Help

If issues persist:

1. **Check Logs:**
   - Server: `pm2 logs` or console output
   - Client: Browser console (F12)
   - Audit: `server/logs/audit.log`

2. **Verify Environment:**
   - Node.js >= 18
   - MongoDB >= 5.0
   - All dependencies installed

3. **Create Issue:**
   - Include error message
   - Steps to reproduce
   - Environment details
   - Relevant log output

---

## 🔄 Reset to Default State

If you need to start fresh:

```bash
# Drop database
mongosh
use PremiumEstateDB
db.dropDatabase()
exit

# Restart server (will recreate collections and admin user)
pm2 restart all
```

**Warning:** This deletes all data!
