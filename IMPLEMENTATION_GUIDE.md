# Premium Estate CRM Enhancement Implementation Guide

## Overview

This guide explains how to wire the new enhancement files into the existing Premium Estate CRM application. It covers the backend middleware and health endpoints first, then the frontend components.

## New Components and Features

### 1. Image Optimization Middleware

File: `server/middlewares/imageOptimization.js`

Capabilities:

- Automatic image compression through `sharp`.
- Thumbnail generation.
- MIME type validation.
- File size limits for uploads.

Install the dependency:

```bash
npm install sharp
```

Usage example:

```javascript
const { processUploadedImage } = require("../../middlewares/imageOptimization");

const result = await processUploadedImage(filePath, "images");
```

### 2. Enhanced Image Gallery

File: `client/src/components/EnhancedImageGallery.jsx`

Capabilities:

- Lazy loading.
- Modal viewing.
- Rotation and zoom controls.
- Download support.
- Responsive gallery layout.

Example usage:

```javascript
import EnhancedImageGallery from "components/EnhancedImageGallery";

const PropertyDetail = ({ property }) => {
  const images =
    property.propertyPhotos?.map((photo) => ({
      url: photo.url,
      alt: `${property.name} - photo`,
      size: photo.size,
    })) || [];

  return <EnhancedImageGallery images={images} title="Property Photos" />;
};
```

### 3. Property Comparison

File: `client/src/components/PropertyComparison.jsx`

Capabilities:

- Side-by-side listing comparison.
- Price-per-square-meter calculations.
- CSV export.
- Summary statistics.

Example usage:

```javascript
import PropertyComparison from "components/PropertyComparison";

const ComparisonPage = () => {
  const [selectedProperties, setSelectedProperties] = useState([]);

  return (
    <PropertyComparison
      properties={selectedProperties}
      onRemoveProperty={(id) =>
        setSelectedProperties((previous) =>
          previous.filter((property) => property._id !== id)
        )
      }
    />
  );
};
```

### 4. Database Health Check

File: `server/utils/dbHealthCheck.js`

Available functions:

- `dbHealthCheck()`
- `verifySchemas()`
- `testImageStorage()`
- `repairMissingData()`

Example:

```javascript
const { dbHealthCheck } = require("./utils/dbHealthCheck");

const health = await dbHealthCheck();
console.log(health);
```

### 5. Health Check API

File: `server/controllers/health/health.js`

Endpoints:

```text
GET  /api/health/status
GET  /api/health/schemas
GET  /api/health/images
POST /api/health/repair
```

Mount the routes in `server/controllers/route.js`:

```javascript
const health = require("./health/health");

router.use("/health", health);
```

### 6. Database Health Dashboard

File: `client/src/components/DatabaseHealthDashboard.jsx`

Capabilities:

- Live connection status.
- Collection statistics.
- Data-quality metrics.
- Image storage visibility.

Example:

```javascript
import DatabaseHealthDashboard from "components/DatabaseHealthDashboard";

const AdminDashboard = () => {
  return <DatabaseHealthDashboard />;
};
```

### 7. Advanced Property Filter

File: `client/src/components/AdvancedPropertyFilter.jsx`

Capabilities:

- Text and numeric filtering.
- Bedrooms, bathrooms, type, status, and amenity selection.
- Sort options and active-filter UI.

Example:

```javascript
import AdvancedPropertyFilter from "components/AdvancedPropertyFilter";

const PropertyCatalog = ({ allProperties }) => {
  return (
    <AdvancedPropertyFilter
      properties={allProperties}
      showSaveFilter
      onFilter={(filters) => {
        console.log("Applied filters:", filters);
      }}
    />
  );
};
```

## Integration Steps

### Step 1: Install Dependencies

```bash
cd /home/lostflam/Downloads/PremiumEstateCRM
npm install sharp
npm install yet-another-react-lightbox
npm install react-medium-image-zoom
```

### Step 2: Update Backend Routes

Edit `server/controllers/route.js` and mount the health router:

```javascript
const health = require("./health/health");

router.use("/health", health);
```

### Step 3: Update the Property Upload Flow

Edit the property upload controller and process each stored image after upload:

```javascript
const { processUploadedImage } = require("../../middlewares/imageOptimization");

const propertyPhoto = async (req, res) => {
  const processedImages = [];

  for (const file of req.files) {
    const result = await processUploadedImage(file.path, "images");
    processedImages.push(result);
  }

  return res.json({ processedImages });
};
```

### Step 4: Update Property Views

Replace the existing gallery in `client/src/views/admin/property/View.js`:

```javascript
import EnhancedImageGallery from "components/EnhancedImageGallery";

const images =
  property.propertyPhotos?.map((photo) => ({
    url: photo.url,
    alt: photo.alt || "Property photo",
    size: photo.size,
  })) || [];

return <EnhancedImageGallery images={images} title="Property Photos" />;
```

### Step 5: Update the Admin Dashboard

Add the database health dashboard in `client/src/views/admin/default/index.js`:

```javascript
import DatabaseHealthDashboard from "components/DatabaseHealthDashboard";

const AdminDashboard = () => {
  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={4}>
      <GridItem colSpan={12}>
        <DatabaseHealthDashboard />
      </GridItem>
    </Grid>
  );
};
```

## Testing

### Test Image Upload

```bash
npm run dev:server
curl -X POST http://localhost:5001/api/property/add-property-photos/PROPERTY_ID \
  -F "property=@test-image.jpg"
```

### Test Database Health

```bash
curl http://localhost:5001/api/health/status
curl http://localhost:5001/api/health/images
curl -X POST http://localhost:5001/api/health/repair
```

### Test the Gallery Component

```javascript
import EnhancedImageGallery from "components/EnhancedImageGallery";

const TestGallery = () => {
  const testImages = [
    { url: "https://via.placeholder.com/400x300", alt: "Test 1" },
    { url: "https://via.placeholder.com/400x300", alt: "Test 2" },
    { url: "https://via.placeholder.com/400x300", alt: "Test 3" },
  ];

  return <EnhancedImageGallery images={testImages} />;
};
```

## Configuration

### Image Optimization Settings

Edit `server/middlewares/imageOptimization.js`:

```javascript
const FILE_CONFIG = {
  images: {
    compression: {
      quality: 85,
      maxWidth: 2560,
      maxHeight: 1920,
    },
    thumbnail: {
      width: 300,
      height: 200,
      quality: 75,
    },
  },
};
```

### Health Check Thresholds

Adjust thresholds in `server/utils/dbHealthCheck.js` for:

- Data completeness scoring.
- Image coverage expectations.
- Collection size warning thresholds.

## Troubleshooting

### Images Not Optimizing

1. Confirm `sharp` is installed.
2. Check file permissions on the upload directories.
3. Verify MIME type validation is not rejecting the files.
4. Inspect backend logs for upload-time errors.

### Gallery Not Displaying

1. Confirm the stored image URLs are accessible.
2. Verify CORS behavior in the backend.
3. Confirm the `images` prop matches the expected shape.
4. Check the browser console for render-time errors.

### Health Check Errors

1. Confirm MongoDB connectivity.
2. Verify the authenticated user has permission.
3. Ensure the health routes are mounted.
4. Confirm the core schemas are registered on startup.

## Performance Tips

### Enable Image Caching

```javascript
app.use(
  "/uploads",
  express.static("uploads", {
    maxAge: "1d",
    etag: false,
  })
);
```

### Use a CDN for Images

- Consider S3, Cloudinary, or another CDN-backed asset pipeline.
- Move stored image URLs to CDN endpoints once the upload flow is stable.
- Add cache headers that match your deployment model.

### Lazy Load Heavy Components

```javascript
const EnhancedImageGallery = React.lazy(() =>
  import("components/EnhancedImageGallery")
);
```

### Optimize Database Queries

- Add indexes to the most queried fields.
- Use projections where only partial documents are needed.
- Add pagination for large result sets.

## Additional Resources

- [Sharp documentation](https://sharp.pixelplumbing.com/)
- [MongoDB documentation](https://www.mongodb.com/docs/)
- [Chakra UI documentation](https://chakra-ui.com/)
- [TanStack Query documentation](https://tanstack.com/query/latest)

## Next Steps

1. Install the required dependencies.
2. Mount the health routes.
3. Integrate the new frontend components where needed.
4. Test uploads and health endpoints.
5. Verify production caching before release.

Version: 1.0

Last Updated: April 26, 2026

Status: Ready for integration
