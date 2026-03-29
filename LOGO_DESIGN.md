# Premium Estate - Logo Design Guide

## 🎨 Logo Overview

The new Premium Estate logo features a **minimalist, modern design** with excellent visibility across all backgrounds.

### Design Philosophy
- **Minimalist**: Clean lines, simple geometric shapes
- **Elegant**: Gold gradient (#F5D076 → #D4AF37 → #B8962E)
- **Professional**: Dark background (#1a2332 → #0d141f)
- **Memorable**: Distinctive house/roof silhouette with premium accents

---

## 📐 Logo Variations

### 1. **Brand Mark (Icon)** - `public-brand-mark.svg`
- **Size**: 120x120px
- **Use**: Favicon, app icon, social media profile
- **Features**:
  - Circular design with gradient gold border
  - Minimalist house silhouette
  - Glow effect for depth
  - Corner accent dots

### 2. **Primary Logo (Horizontal)** - `public-brand-primary.svg`
- **Size**: 600x160px
- **Use**: Header, website, email signature
- **Features**:
  - Icon mark on the left
  - "PREMIUM ESTATE" wordmark
  - Tagline: "CURATED ESTATES • PRIVATE BROKERAGE"
  - Decorative gold line

### 3. **Monochrome Logo** - `public-brand-monochrome.svg`
- **Size**: 600x160px
- **Use**: Light backgrounds, print materials
- **Features**:
  - Same layout as primary
  - Optimized for visibility on light backgrounds

### 4. **Stacked Icon** - `brand-icon-stacked.svg`
- **Size**: 200x200px
- **Use**: Social media, app stores, large displays
- **Features**:
  - Square format with rounded corners
  - Enhanced house icon with window details
  - Corner decorations

### 5. **Favicon** - `favicon.svg`
- **Size**: 64x64px (scalable)
- **Use**: Browser tab, bookmarks
- **Features**:
  - Simplified house icon
  - Optimized for small sizes
  - Gold accent on dark background

---

## 🎨 Color Palette

### Primary Colors
```
Gold Gradient:
  - Light:  #F5D076 (RGB: 245, 208, 118)
  - Medium: #D4AF37 (RGB: 212, 175, 55)
  - Dark:   #B8962E (RGB: 184, 150, 46)

Dark Background:
  - Light:  #1a2332 (RGB: 26, 35, 50)
  - Dark:   #0d141f (RGB: 13, 20, 31)

Text Colors:
  - White:  #FFFFFF
  - Muted:  #8F9BAF
```

### Gradients
- **Gold Gradient**: `linear-gradient(135deg, #F5D076 0%, #D4AF37 50%, #B8962E 100%)`
- **Dark Background**: `linear-gradient(180deg, #1a2332 0%, #0d141f 100%)`

---

## 📱 Usage Guidelines

### Header Logo
- **File**: `public-brand-primary.svg` or `public-brand-mark.svg`
- **Min Height**: 40px (mobile), 48px (desktop)
- **Clear Space**: Minimum 20px on all sides
- **Background**: Dark gradient or glassmorphism effect

### Favicon
- **File**: `favicon.svg` (with `.ico` fallback)
- **Sizes**: 16x16, 32x32, 64x64
- **Format**: SVG preferred, ICO for compatibility

### Social Media
- **Profile Picture**: `brand-icon-stacked.svg` or `public-brand-mark.svg`
- **Cover Photo**: Use primary logo with brand colors
- **Minimum Size**: 400x400px

---

## ✨ Visual Effects

### Glow Effect
```css
filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.6));
```

### Hover Animation
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
transform: translateY(-2px);
box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
```

### Shimmer Animation
```css
@keyframes logo-shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
```

---

## 🚀 Implementation

### React Component
```jsx
<Image
  src={publicBrandPrimary}
  alt="Premium Estate"
  maxH="48px"
  objectFit="contain"
  filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))"
/>
```

### HTML
```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/favicon.svg" />
```

---

## 📏 Minimum Sizes

| Usage | Minimum Size |
|-------|--------------|
| Web Header | 40px height |
| Mobile App | 32px height |
| Print | 25mm width |
| Favicon | 16x16px |
| Social Media | 400x400px |

---

## ✅ Do's and Don'ts

### ✅ Do
- Use the gold gradient on dark backgrounds
- Maintain clear space around the logo
- Use SVG format for web (crisp at any size)
- Apply subtle hover effects for interactivity

### ❌ Don't
- Don't stretch or distort the logo
- Don't use on busy backgrounds
- Don't change the colors
- Don't add effects not in this guide

---

## 📁 File Locations

```
client/src/assets/img/layout/
├── public-brand-mark.svg          # Icon mark (120x120)
├── public-brand-primary.svg       # Horizontal logo (600x160)
├── public-brand-monochrome.svg    # Mono version (600x160)
└── brand-icon-stacked.svg         # Stacked icon (200x200)

client/public/
└── favicon.svg                     # Browser favicon (64x64)
```

---

## 🎯 Key Improvements

### Before → After
1. **Visibility**: ❌ Hard to see → ✅ High contrast gold on dark
2. **Design**: ❌ Complex, busy → ✅ Minimalist, clean
3. **Scalability**: ❌ Loses detail → ✅ Crisp at any size
4. **Brand Recognition**: ❌ Generic → ✅ Distinctive house silhouette
5. **Animation**: ❌ Static → ✅ Subtle shimmer & glow effects
6. **Versatility**: ❌ Single format → ✅ Multiple variations for all uses

---

**Last Updated**: 2026-03-29  
**Version**: 2.0  
**Status**: ✅ Production Ready
