#!/usr/bin/env node

/**
 * Premium Estate CRM Enhancements Integration Script
 * 
 * This script helps integrate the new features:
 * - Image optimization middleware
 * - Health check endpoints
 * - Enhanced components
 * 
 * Run with: node scripts/integrate-enhancements.js
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

const log = {
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  info: (msg) => console.log(`${COLORS.blue}ℹ${COLORS.reset} ${msg}`),
  warn: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
  error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
};

// Check if files exist and create integration summary
const checkFiles = () => {
  log.info('Checking for new files...');

  const files = [
    'server/middlewares/imageOptimization.js',
    'server/utils/dbHealthCheck.js',
    'server/controllers/health/health.js',
    'client/src/components/EnhancedImageGallery.jsx',
    'client/src/components/PropertyComparison.jsx',
    'client/src/components/DatabaseHealthDashboard.jsx',
    'client/src/components/AdvancedPropertyFilter.jsx',
  ];

  const projectRoot = path.resolve(__dirname, '..');
  let allExist = true;

  files.forEach((file) => {
    const fullPath = path.join(projectRoot, file);
    const exists = fs.existsSync(fullPath);
    if (exists) {
      log.success(`Found: ${file}`);
    } else {
      log.warn(`Missing: ${file}`);
      allExist = false;
    }
  });

  return allExist;
};

// Generate integration checklist
const generateChecklist = () => {
  log.info('\nGenerating integration checklist...');

  const checklist = `
# 📋 Premium Estate CRM Enhancements - Integration Checklist

## Installation Steps

### 1. Install Dependencies
\`\`\`bash
npm install sharp
npm install --save-dev @types/sharp (optional for TypeScript)
\`\`\`
Status: [ ] Done

### 2. Backend Integration

#### 2a. Update Route Aggregator
File: \`server/controllers/route.js\`

Add this code after other router.use() statements:
\`\`\`javascript
// Health check routes
const health = require('./health/health');
router.use('/health', health);
\`\`\`
Status: [ ] Done

#### 2b. Update Property Upload Controller
File: \`server/controllers/property/upload.controller.js\`

Add this import at the top:
\`\`\`javascript
const { processUploadedImage } = require('../../middlewares/imageOptimization');
\`\`\`

In your image upload handler, add:
\`\`\`javascript
const result = await processUploadedImage(file.path, 'images');
\`\`\`
Status: [ ] Done

### 3. Frontend Integration

#### 3a. Property Detail View
File: \`client/src/views/admin/property/View.js\`

Replace image gallery with:
\`\`\`javascript
import EnhancedImageGallery from 'components/EnhancedImageGallery';

const images = property.propertyPhotos?.map(photo => ({
  url: photo.url,
  alt: photo.alt || 'Property photo',
  size: photo.size
})) || [];

<EnhancedImageGallery images={images} title="Property Photos" />
\`\`\`
Status: [ ] Done

#### 3b. Admin Dashboard
File: \`client/src/views/admin/default/index.js\`

Add health check component:
\`\`\`javascript
import DatabaseHealthDashboard from 'components/DatabaseHealthDashboard';

// In your dashboard JSX
<GridItem colSpan={12}>
  <DatabaseHealthDashboard />
</GridItem>
\`\`\`
Status: [ ] Done

#### 3c. Property Comparison Page
File: \`client/src/views/admin/property/index.js\` or create new

Add comparison component:
\`\`\`javascript
import PropertyComparison from 'components/PropertyComparison';

<PropertyComparison properties={selectedProperties} />
\`\`\`
Status: [ ] Done

#### 3d. Property Search/Catalog
File: \`client/src/views/public/catalog/index.jsx\`

Add advanced filter:
\`\`\`javascript
import AdvancedPropertyFilter from 'components/AdvancedPropertyFilter';

<AdvancedPropertyFilter 
  properties={properties}
  onFilter={handleFilter}
/>
\`\`\`
Status: [ ] Done

### 4. Testing

#### 4a. Test Image Optimization
\`\`\`bash
curl -X POST http://localhost:5001/api/property/add-property-photos/PROPERTY_ID \\
  -F "property=@test-image.jpg"
\`\`\`
Status: [ ] Done

#### 4b. Test Health Endpoints
\`\`\`bash
# Full health check
curl http://localhost:5001/api/health/status

# Image storage stats
curl http://localhost:5001/api/health/images

# Verify schemas
curl http://localhost:5001/api/health/schemas
\`\`\`
Status: [ ] Done

#### 4c. Test Components
- [ ] EnhancedImageGallery displays correctly
- [ ] Lightbox modal opens on image click
- [ ] Zoom controls work
- [ ] Download functionality works
- [ ] PropertyComparison shows comparison table
- [ ] DatabaseHealthDashboard shows stats
- [ ] AdvancedPropertyFilter applies filters

### 5. Deployment

#### 5a. Build & Test
\`\`\`bash
npm run verify
npm run build
\`\`\`
Status: [ ] Done

#### 5b. Check Production Dependencies
\`\`\`bash
npm list sharp
npm list --production
\`\`\`
Status: [ ] Done

#### 5c. Monitor Database
\`\`\`bash
# Check database health periodically
curl http://your-domain.com/api/health/status
\`\`\`
Status: [ ] Done

---

## Feature Checklist

### Image Optimization
- [ ] Sharp.js installed
- [ ] Image compression working
- [ ] Thumbnails generated
- [ ] File validation in place
- [ ] Upload errors handled

### Database Health
- [ ] Health endpoints working
- [ ] Collection stats accurate
- [ ] Data quality metrics calculated
- [ ] Repair functionality tested
- [ ] Schema verification working

### UI Components
- [ ] EnhancedImageGallery integrated
- [ ] PropertyComparison page working
- [ ] DatabaseHealthDashboard visible
- [ ] AdvancedPropertyFilter functional
- [ ] All components styled correctly

### Performance
- [ ] Images optimized on upload
- [ ] Gallery lazy-loads images
- [ ] Database queries optimized
- [ ] No N+1 query problems
- [ ] Image caching enabled

---

## Documentation

- [ ] AUDIT_REPORT.md reviewed
- [ ] IMPLEMENTATION_GUIDE.md read
- [ ] README.md updated with new features
- [ ] API documentation updated
- [ ] Team trained on new features

---

## Known Issues & Notes

<!-- Add any known issues or important notes here -->

---

## Support

For issues or questions:
1. Check IMPLEMENTATION_GUIDE.md
2. Review error logs
3. Test individual components
4. Contact team lead

---

Version: 1.0
Date: \${new Date().toISOString().split('T')[0]}
`;

  const filePath = path.join(path.resolve(__dirname, '..'), 'INTEGRATION_CHECKLIST.md');
  fs.writeFileSync(filePath, checklist);
  log.success(`Generated: INTEGRATION_CHECKLIST.md`);
};

// Verify database can be tested
const verifyDatabaseSetup = () => {
  log.info('\nVerifying database setup...');

  const configPath = path.resolve(__dirname, '../server/db/config.js');
  if (fs.existsSync(configPath)) {
    log.success('Database config found');
  } else {
    log.warn('Database config not found');
  }

  const envExamplePath = path.resolve(__dirname, '../server/.env.example');
  if (fs.existsSync(envExamplePath)) {
    log.success('Environment file template found');
    const content = fs.readFileSync(envExamplePath, 'utf8');
    if (content.includes('DB_URL')) {
      log.success('Database URL configured in template');
    }
  }
};

// Create package.json scripts for testing
const suggestScripts = () => {
  log.info('\nSuggested npm scripts to add:\n');
  console.log(`{
  "scripts": {
    "health-check": "node -e \\"const h = require('./server/utils/dbHealthCheck'); h.dbHealthCheck().then(r => console.log(JSON.stringify(r, null, 2)))\\"",
    "verify-images": "node -e \\"const h = require('./server/utils/dbHealthCheck'); h.testImageStorage().then(r => console.log(JSON.stringify(r, null, 2)))\\"",
    "repair-db": "node -e \\"const h = require('./server/utils/dbHealthCheck'); h.repairMissingData().then(r => console.log(JSON.stringify(r, null, 2)))\\"",
    "test:db": "npm run health-check && npm run verify-images"
  }
}`);
};

// Generate next steps
const generateNextSteps = () => {
  log.info('\n' + '='.repeat(60));
  log.info('NEXT STEPS');
  log.info('='.repeat(60) + '\n');

  const steps = [
    {
      num: 1,
      title: 'Install Dependencies',
      cmd: 'npm install sharp',
      file: 'N/A',
    },
    {
      num: 2,
      title: 'Update Route Aggregator',
      cmd: 'N/A',
      file: 'server/controllers/route.js',
    },
    {
      num: 3,
      title: 'Integrate Components in Views',
      cmd: 'N/A',
      file: 'client/src/views/admin/property/View.js',
    },
    {
      num: 4,
      title: 'Add Health Check Dashboard',
      cmd: 'N/A',
      file: 'client/src/views/admin/default/index.js',
    },
    {
      num: 5,
      title: 'Test Image Optimization',
      cmd: 'curl http://localhost:5001/api/health/images',
      file: 'N/A',
    },
    {
      num: 6,
      title: 'Verify All Components Work',
      cmd: 'npm run dev && check in browser',
      file: 'N/A',
    },
    {
      num: 7,
      title: 'Deploy to Production',
      cmd: 'npm run build',
      file: 'N/A',
    },
  ];

  steps.forEach((step) => {
    console.log(`${step.num}. ${step.title}`);
    if (step.file !== 'N/A') {
      console.log(`   📄 File: ${step.file}`);
    }
    if (step.cmd !== 'N/A') {
      console.log(`   💻 Command: ${step.cmd}`);
    }
    console.log();
  });
};

// Main execution
const main = () => {
  console.log('\n' + '='.repeat(60));
  console.log('🏠 Premium Estate CRM - Enhancements Integration');
  console.log('='.repeat(60) + '\n');

  const allExist = checkFiles();

  if (!allExist) {
    log.warn('Some files are missing. Please ensure all new files are in place.');
  }

  generateChecklist();
  verifyDatabaseSetup();
  suggestScripts();
  generateNextSteps();

  log.info('\n' + '='.repeat(60));
  log.success('Integration script completed!');
  log.info('Check INTEGRATION_CHECKLIST.md for detailed steps');
  log.info('='.repeat(60) + '\n');
};

main();
