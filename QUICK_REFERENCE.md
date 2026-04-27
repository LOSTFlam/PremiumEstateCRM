# Premium Estate CRM Quick Reference

## Installation and Setup

### 1. Install Dependencies

```bash
cd /home/lostflam/Downloads/PremiumEstateCRM
npm install sharp
```

### 2. Add Backend Routes

File: `server/controllers/route.js`

Add the health router after the existing `router.use()` registrations:

```javascript
const health = require("./health/health");

router.use("/health", health);
```

### 3. Update Property Photo Upload

File: `server/controllers/property/upload.controller.js`

Import the processor:

```javascript
const { processUploadedImage } = require("../../middlewares/imageOptimization");
```

Call it after the file is stored:

```javascript
const result = await processUploadedImage(filePath, "images");
```

### 4. Use the Gallery Component

Example file: `client/src/views/admin/property/View.js`

```javascript
import EnhancedImageGallery from "components/EnhancedImageGallery";

const images =
  property.propertyPhotos?.map((photo) => ({
    url: photo.url,
    alt: photo.alt || "Property photo",
    size: photo.size,
  })) || [];

return (
  <EnhancedImageGallery
    images={images}
    title="Property Photos"
    columns={{ base: 1, md: 2, lg: 3 }}
  />
);
```

## Component Quick Reference

### EnhancedImageGallery

```jsx
import EnhancedImageGallery from "components/EnhancedImageGallery";

<EnhancedImageGallery
  images={images}
  title="Property Photos"
  columns={{ base: 1, md: 2, lg: 3 }}
  allowDownload
  onImageClick={(image) => console.log(image)}
/>;
```

### PropertyComparison

```jsx
import PropertyComparison from "components/PropertyComparison";

<PropertyComparison
  properties={selectedProperties}
  onRemoveProperty={(id) => {
    removeProperty(id);
  }}
/>;
```

### DatabaseHealthDashboard

```jsx
import DatabaseHealthDashboard from "components/DatabaseHealthDashboard";

<DatabaseHealthDashboard />;
```

### AdvancedPropertyFilter

```jsx
import AdvancedPropertyFilter from "components/AdvancedPropertyFilter";

<AdvancedPropertyFilter
  properties={allProperties}
  showSaveFilter
  onFilter={(filters) => {
    applyFilters(filters);
  }}
/>;
```

## API Endpoints

### Health Check Commands

```bash
curl http://localhost:5001/api/health/status
curl http://localhost:5001/api/health/images
curl http://localhost:5001/api/health/schemas
curl -X POST http://localhost:5001/api/health/repair
```

### Example Response

```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "name": "PremiumEstateDB",
    "host": "localhost",
    "port": 27017
  },
  "collections": {
    "Users": { "count": 45 },
    "Properties": { "count": 328 }
  },
  "dataQuality": {
    "users": { "score": 95 },
    "properties": { "score": 87 }
  }
}
```

## Props Reference

### EnhancedImageGallery Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `images` | `Array` | `[]` | Array of image objects |
| `title` | `String` | `"Gallery"` | Gallery heading |
| `columns` | `Object` | `{ base: 1, md: 2, lg: 3 }` | Responsive grid columns |
| `allowDownload` | `Boolean` | `true` | Shows the download action |
| `onImageClick` | `Function` | `null` | Click callback |

### PropertyComparison Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `properties` | `Array` | `[]` | Properties to compare |
| `onRemoveProperty` | `Function` | `null` | Remove handler |

### AdvancedPropertyFilter Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `properties` | `Array` | `[]` | Properties to filter |
| `onFilter` | `Function` | `null` | Filter callback |
| `showSaveFilter` | `Boolean` | `false` | Enables save-search UI |

## Testing Commands

```bash
npm run dev:server
curl -X POST http://localhost:5001/api/property/add-property-photos/PROPERTY_ID \
  -F "property=@test-image.jpg"
curl http://localhost:5001/api/health/images
curl http://localhost:5001/api/health/status
npm test
npm run verify
```

## File Locations

| Feature | File |
| --- | --- |
| Image optimization | `server/middlewares/imageOptimization.js` |
| Database health | `server/utils/dbHealthCheck.js` |
| Health API | `server/controllers/health/health.js` |
| Gallery component | `client/src/components/EnhancedImageGallery.jsx` |
| Comparison component | `client/src/components/PropertyComparison.jsx` |
| Dashboard component | `client/src/components/DatabaseHealthDashboard.jsx` |
| Filter component | `client/src/components/AdvancedPropertyFilter.jsx` |

## Performance Tips

### Enable Caching

```javascript
app.use(
  "/uploads",
  express.static("uploads", {
    maxAge: "1d",
    etag: false,
  })
);
```

### Lazy Load Components

```javascript
const EnhancedImageGallery = React.lazy(() =>
  import("components/EnhancedImageGallery")
);
```

### Image Optimization Configuration

```javascript
compression: {
  quality: 85,
  maxWidth: 2560,
  maxHeight: 1920
}
```

## Troubleshooting

### Images Not Optimizing

```bash
npm list sharp
ls -la uploads/
npm run dev:server
```

### Gallery Not Showing

```javascript
console.log(property.propertyPhotos);
```

```bash
curl -I http://localhost:5001/api/property/public
```

### Health Endpoint Returns 404

```bash
grep "health" server/controllers/route.js
npm run dev:server
```

## Configuration Reference

### Image Sizes

- Original images: compressed to a maximum of `2560x1920`.
- Thumbnail images: `300x200`.
- Maximum upload size: `15 MB`.

### Database

- Connection target: local MongoDB or Atlas.
- Default database name: `PremiumEstateDB`.
- Health endpoint: `/api/health/status`.

### Frontend Stack

- UI framework: Chakra UI.
- Utility styling: Tailwind CSS.
- State layer: Redux and React Query.
- Animation layer: Framer Motion.

## Update Process

```bash
npm install sharp
npm run verify
npm run build
```

Follow-up work:

1. Back up the database.
2. Mount the new backend routes.
3. Update the image upload handler.
4. Replace or extend the existing frontend views.
5. Verify the integrated experience before deployment.

## Need Help

1. Setup details: `IMPLEMENTATION_GUIDE.md`
2. Integration helper: `scripts/integrate-enhancements.js`
3. Health check URL: [http://localhost:5001/api/health/status](http://localhost:5001/api/health/status)
4. Database issues: inspect the MongoDB connection and server logs

## Verification Checklist

- [ ] `sharp` is installed.
- [ ] Health routes are mounted.
- [ ] Image optimization works.
- [ ] Gallery renders correctly.
- [ ] Lightbox behavior works.
- [ ] Health dashboard renders.
- [ ] Filters apply correctly.
- [ ] Comparison output is correct.
- [ ] CSV export works.
- [ ] No avoidable console errors remain in the tested path.

Version: 1.0

Last Updated: April 26, 2026

Status: Production-ready reference
