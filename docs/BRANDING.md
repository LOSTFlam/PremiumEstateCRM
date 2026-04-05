# Branding Guide

Customize Premium Estate CRM for your real estate agency.

---

## 🎨 Brand Configuration

### Logo Setup

Place your logo files in:
- `client/public/assets/img/layout/brand-icon-stacked.svg` - Stacked logo for sidebar
- `client/public/assets/img/layout/logoWhite.png` - White/light logo for dark backgrounds
- `client/public/assets/img/layout/public-brand-mark.svg` - Brand mark for public pages
- `client/public/assets/img/layout/public-brand-primary.svg` - Primary brand logo

### Color Scheme

Edit `client/tailwind.config.js` to customize colors:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',  // Main brand color
          600: '#0284c7',
          700: '#0369a1',
        },
        // Secondary/accent colors
        accent: {
          500: '#f59e0b',
        },
      },
    },
  },
};
```

### Typography

Default fonts are configured in `client/src/assets/css/App.css`. To customize:

1. Add Google Fonts to `client/public/index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

2. Update Tailwind config:
```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
}
```

---

## 🏢 Agency Information

### Update Agency Name

Edit the following files to update your agency name:

1. `client/public/index.html` - Update `<title>` and meta tags
2. `client/src/components/navbar/NavbarAdmin.js` - Update header text
3. `client/src/components/sidebar/components/Brand.js` - Update sidebar branding

### Contact Information

Update contact details in:
- `client/src/components/footer/FooterAdmin.js`
- `client/src/components/footer/FooterAuth.js`
- Email templates in `server/controllers/emailTemplate/`

---

## 🖼️ Image Management

### Upload Brand Assets

Use the admin panel to upload brand assets:
1. Navigate to Settings > Branding
2. Upload:
   - Authentication page banner
   - Small logo (for header)
   - Large logo (for login page)

### Property Photos

- Recommended size: 1920x1080px
- Format: JPEG or WebP
- Max file size: 10MB
- Photos are automatically optimized

---

## 📧 Email Templates

### Customize Email Templates

Location: `server/controllers/emailTemplate/`

Edit template files to include your branding:
- Add logo URL
- Update company name
- Customize colors
- Add contact information

### Email Configuration

Update `server/.env`:

```env
# Email Settings
MAIL_HOST=smtp.your-provider.com
MAIL_PORT=587
MAIL_USER=your-email@domain.com
MAIL_PASSWORD=your-email-password
MAIL_FROM=Your Agency <noreply@your-domain.com>
```

---

## 🌐 Public Pages

### Landing Page Customization

Edit `client/src/views/public/ModernLandingPage.jsx`:

- Hero section text and images
- Featured properties section
- Testimonials
- Contact information
- Footer content

### SEO Configuration

Update meta tags in `client/public/index.html`:

```html
<title>Your Agency Name - Premium Real Estate</title>
<meta name="description" content="Your agency description">
<meta name="keywords" content="real estate, properties, your city">
```

---

## 🎭 Theme Options

### Light/Dark Mode

The application supports light and dark themes. Toggle is available in:
- Admin dashboard: Top right corner
- Public pages: Footer

### Custom Themes

Create custom themes by editing:
- `client/src/assets/css/App.css` - Global styles
- `client/tailwind.config.js` - Theme configuration

---

## 📱 Mobile Branding

### PWA Configuration

Edit `client/public/manifest.json`:

```json
{
  "name": "Your Agency Name",
  "short_name": "Agency",
  "description": "Your agency description",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0ea5e9",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/favicon1.ico",
      "sizes": "192x192",
      "type": "image/x-icon"
    }
  ]
}
```

---

## 📋 Branding Checklist

- [ ] Update agency name throughout application
- [ ] Upload custom logos
- [ ] Configure color scheme
- [ ] Update contact information
- [ ] Customize email templates
- [ ] Configure SEO meta tags
- [ ] Set up PWA manifest
- [ ] Test on mobile devices
- [ ] Review public pages

---

## 📞 Support

For branding assistance:
- Review the design system in `client/tailwind.config.js`
- Check component documentation
- Contact the development team
