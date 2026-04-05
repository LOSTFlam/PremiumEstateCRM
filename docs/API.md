# API Documentation

Premium Estate CRM API provides RESTful endpoints for managing real estate properties, leads, contacts, and business operations.

**Base URL:** `http://localhost:5001/api`

**Authentication:** JWT Bearer Token (via Authorization header or cookie)

---

## 🔐 Authentication

### POST /api/user/login
Login with username/email and password.

**Request Body:**
```json
{
  "username": "admin@gmail.com",
  "password": "Admin123!"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64d33173fd7ff3fa0924a109",
    "username": "admin@gmail.com",
    "firstName": "Premium",
    "lastName": "Estate",
    "role": "superAdmin"
  },
  "expiresIn": 900000
}
```

**Rate Limit:** 5 attempts per 15 minutes per IP

**Error Responses:**
- `401` - Invalid credentials
- `423` - Account locked (too many failed attempts)
- `429` - Rate limit exceeded

---

### POST /api/user/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Not in last 5 used passwords

---

### POST /api/user/refresh-token
Refresh access token using refresh token.

**Response (200):**
```json
{
  "token": "new_access_token...",
  "refreshToken": "new_refresh_token..."
}
```

**Note:** Implements token rotation - old refresh tokens are invalidated.

---

### POST /api/user/change-password
Change user password.

**Request Body:**
```json
{
  "currentPassword": "OldP@ss123",
  "newPassword": "NewP@ss456"
}
```

---

### POST /api/user/logout
Logout and invalidate all tokens.

---

## 🏠 Properties

### GET /api/property
Get all properties (authenticated).

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20, max: 100) |
| sort | string | Sort field:direction (e.g., `createdDate:desc`) |
| search | string | Text search |
| status | string | Filter by status |

**Response (200):**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### POST /api/property/add
Create a new property.

**Request Body:**
```json
{
  "name": "Luxury Villa",
  "propertyAddress": "123 Main St",
  "listingPrice": "500000",
  "propertyType": "Villa",
  "marketingDescription": "Beautiful luxury villa..."
}
```

---

### GET /api/property/view/:id
View property details with associated contacts, phone calls, and emails.

---

### PUT /api/property/edit/:id
Update property information.

---

### DELETE /api/property/delete/:id
Soft-delete a property (also cleans up associated files).

---

### POST /api/property/add-property-photos/:id
Upload property photos.

**Request:** Multipart form data
- Field: `property` (up to 10 files)
- Allowed types: JPEG, PNG, GIF, WebP, SVG, AVIF
- Max size: 10MB per file

---

### POST /api/property/add-virtual-tours-or-videos/:id
Upload virtual tours/videos.

**Allowed types:** MP4, WebM, OGG, MOV
**Max size:** 100MB per file

---

### POST /api/property/add-floor-plans/:id
Upload floor plans.

**Allowed types:** JPEG, PNG, GIF, WebP, PDF
**Max size:** 15MB per file

---

### POST /api/property/add-property-documents/:id
Upload property documents.

**Allowed types:** PDF, DOC, DOCX, XLS, XLSX, CSV, RTF
**Max size:** 25MB per file

---

### PUT /api/property/verify/:id
Verify/update property listing status.

**Request Body:**
```json
{
  "verificationStatus": "verified",
  "verificationNotes": "All documents verified",
  "verificationChecklist": ["address", "price", "photos", "documents"]
}
```

---

## 🌐 Public Property Endpoints

### GET /api/property/public
Get public listing of active properties.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| search | string | Search query |
| type | string | Property type filter |

---

### GET /api/property/public/:id
View public property details by ID.

---

### GET /api/property/public/slug/:slug
View public property by SEO-friendly slug.

---

## 👥 Contacts

### GET /api/contact
Get all contacts.

### POST /api/contact/add
Create new contact.

### PUT /api/contact/edit/:id
Update contact.

### DELETE /api/contact/delete/:id
Delete contact.

---

## 🎯 Leads

### GET /api/lead
Get all leads.

### POST /api/lead/add
Create new lead.

### PUT /api/lead/edit/:id
Update lead.

### DELETE /api/lead/delete/:id
Delete lead.

---

## 📊 Media Management

### GET /api/media/stats
Get media storage statistics.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "propertiesWithPhotos": 45,
    "propertiesWithDocs": 23,
    "totalPhotos": 180,
    "totalDocs": 67,
    "uploadDirs": ["property", "images", "general"]
  }
}
```

---

### GET /api/media/orphaned/scan
Scan for orphaned files (dry run).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deleted": 15,
    "errors": 0,
    "totalSize": 52428800,
    "totalSizeText": "50 MB",
    "dryRun": true,
    "message": "Found 15 orphaned files (50 MB)"
  }
}
```

---

### POST /api/media/orphaned/cleanup
Clean up orphaned files (admin only).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deleted": 15,
    "errors": 0,
    "totalSize": 52428800,
    "totalSizeText": "50 MB",
    "dryRun": false,
    "message": "Deleted 15 orphaned files (50 MB)"
  }
}
```

---

## 👤 User Management

### GET /api/user
Get all users (authenticated).

### POST /api/user/admin-register
Create admin user (superAdmin only).

### PUT /api/user/edit/:id
Update user information.

### DELETE /api/user/delete/:id
Soft-delete user.

### PUT /api/user/change-roles/:id
Update user roles.

---

## 📋 Tasks

### GET /api/task
Get all tasks.

### POST /api/task/add
Create new task.

### PUT /api/task/edit/:id
Update task.

### DELETE /api/task/delete/:id
Delete task.

---

## 📧 Email & Communication

### GET /api/email
Get email history.

### GET /api/phoneCall
Get phone call history.

### GET /api/text-msg
Get text message history.

### GET /api/meeting
Get meetings.

---

## 📈 Reporting

### GET /api/reporting
Get reports and analytics data.

---

## 📁 Documents

### GET /api/document
Get all documents.

### POST /api/document/add
Upload document.

### DELETE /api/document/delete/:id
Delete document.

---

## 🔧 Custom Fields

### GET /api/custom-field
Get custom field configurations.

### POST /api/custom-field
Create custom field module.

### PUT /api/custom-field/:id
Update custom field module.

---

## 📅 Calendar

### GET /api/calendar
Get calendar events.

### POST /api/calendar/add
Create calendar event.

---

## 📊 Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 423 | Locked (Account locked) |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## 🔒 Security Headers

All API responses include security headers via Helmet.js:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (production)

---

## 📝 Rate Limits

| Endpoint | Limit |
|----------|-------|
| General API | 100 requests / 15 min |
| Login | 5 attempts / 15 min |
| Register | 3 attempts / hour |
| Password Reset | 3 attempts / hour |

---

## 🔑 Authentication

Include the JWT token in requests:

**Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Or via Cookie:**
```
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📌 Notes

- All timestamps are in ISO 8601 format
- Soft-deleted records are excluded by default
- File uploads support progress tracking
- Session timeout: 30 minutes of inactivity
- Access token expiry: 15 minutes
- Refresh token expiry: 7 days
