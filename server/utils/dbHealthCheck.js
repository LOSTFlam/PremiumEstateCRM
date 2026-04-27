const mongoose = require('mongoose');

/**
 * Database Health Check & Verification Utility
 * Tests connectivity, schema integrity, and data quality
 */

const dbHealthCheck = async () => {
  try {
    const health = {
      status: 'checking',
      timestamp: new Date(),
      database: {},
      collections: {},
      indexes: {},
      dataQuality: {},
      issues: [],
      warnings: [],
    };

    // 1. Check MongoDB connection
    if (!mongoose.connection) {
      health.issues.push('MongoDB connection not initialized');
      return health;
    }

    health.database.connected = mongoose.connection.readyState === 1;
    health.database.host = mongoose.connection.host;
    health.database.port = mongoose.connection.port;
    health.database.name = mongoose.connection.db?.databaseName || 'unknown';

    if (!health.database.connected) {
      health.issues.push('MongoDB is not connected');
      return health;
    }

    // 2. Check Collections
    const collections = await mongoose.connection.db?.listCollections().toArray();
    health.collections.count = collections?.length || 0;
    health.collections.names = collections?.map((c) => c.name) || [];

    // 3. Check Key Collections
    const Collections = {
      Users: 'User',
      Properties: 'Properties',
      Contacts: 'Contacts',
      Leads: 'Leads',
      Invoices: 'Invoices',
      Quotes: 'Quotes',
    };

    for (const [key, model] of Object.entries(Collections)) {
      try {
        const Model = mongoose.model(model);
        const count = await Model.countDocuments();
        health.collections[key] = {
          exists: true,
          count,
          lastModified: await Model.findOne().select({ updatedDate: 1 }),
        };
      } catch (error) {
        health.warnings.push(`Collection ${key} not found or error: ${error.message}`);
      }
    }

    // 4. Check Indexes
    const models = mongoose.modelNames();
    for (const modelName of models) {
      try {
        const Model = mongoose.model(modelName);
        const indexes = await Model.collection.getIndexes();
        health.indexes[modelName] = Object.keys(indexes).length;
      } catch (error) {
        health.warnings.push(`Could not get indexes for ${modelName}`);
      }
    }

    // 5. Data Quality Checks
    health.dataQuality.users = await checkUserDataQuality();
    health.dataQuality.properties = await checkPropertyDataQuality();
    health.dataQuality.contacts = await checkContactDataQuality();

    // 6. Storage Statistics
    const stats = await mongoose.connection.db?.stats();
    health.storage = {
      dataSize: stats?.dataSize || 0,
      indexes: stats?.indexes || 0,
      collections: stats?.collections || 0,
      dataSize_mb: ((stats?.dataSize || 0) / 1024 / 1024).toFixed(2),
    };

    health.status = health.issues.length === 0 ? 'healthy' : 'unhealthy';

    return health;
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date(),
    };
  }
};

/**
 * Check User data quality
 */
const checkUserDataQuality = async () => {
  try {
    const User = mongoose.model('User');
    const total = await User.countDocuments();
    const withoutEmail = await User.countDocuments({ email: { $exists: false } });
    const withoutPassword = await User.countDocuments({ password: { $exists: false } });
    const inactive = await User.countDocuments({ isActive: false });

    return {
      total,
      issues: {
        missingEmail: withoutEmail,
        missingPassword: withoutPassword,
        inactive: inactive,
      },
      score: total > 0 ? (100 * (total - withoutEmail - withoutPassword)) / total : 0,
    };
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Check Property data quality
 */
const checkPropertyDataQuality = async () => {
  try {
    const Property = mongoose.model('Properties');
    const total = await Property.countDocuments();
    const withPhotos = await Property.countDocuments({ propertyPhotos: { $exists: true, $ne: [] } });
    const withoutPrice = await Property.countDocuments({ listingPrice: { $exists: false } });
    const withoutAddress = await Property.countDocuments({ propertyAddress: { $exists: false } });
    const verified = await Property.countDocuments({ verificationStatus: 'verified' });

    return {
      total,
      withPhotos,
      withoutPhotos: total - withPhotos,
      dataCompleteness: {
        missingPrice: withoutPrice,
        missingAddress: withoutAddress,
        verified: verified,
      },
      score:
        total > 0
          ? (100 *
              (total -
                withoutPrice -
                withoutAddress +
                withPhotos * 0.5)) /
            total
          : 0,
    };
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Check Contact data quality
 */
const checkContactDataQuality = async () => {
  try {
    const Contact = mongoose.model('Contacts');
    const total = await Contact.countDocuments();
    const withInterestProperty = await Contact.countDocuments({
      interestProperty: { $exists: true, $ne: [] },
    });
    const withQuotes = await Contact.countDocuments({ quotes: { $exists: true, $ne: [] } });

    return {
      total,
      withInterestProperty,
      withQuotes,
      engagementScore:
        total > 0 ? ((withInterestProperty + withQuotes) / total) * 100 : 0,
    };
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Verify database schemas
 */
const verifySchemas = async () => {
  try {
    const schemas = {};
    const models = mongoose.modelNames();

    for (const modelName of models) {
      try {
        const Model = mongoose.model(modelName);
        const schema = Model.schema;
        schemas[modelName] = {
          paths: Object.keys(schema.paths).length,
          virtuals: Object.keys(schema.virtuals).length,
          methods: Object.keys(schema.methods).length,
          statics: Object.keys(schema.statics).length,
        };
      } catch (error) {
        schemas[modelName] = { error: error.message };
      }
    }

    return schemas;
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Test image storage
 */
const testImageStorage = async () => {
  try {
    const Property = mongoose.model('Properties');
    const propertiesWithImages = await Property.countDocuments({
      propertyPhotos: { $exists: true, $ne: [] },
    });

    const propertiesWithoutImages = await Property.countDocuments({
      $or: [
        { propertyPhotos: { $exists: false } },
        { propertyPhotos: { $size: 0 } },
      ],
    });

    const totalImageCount = await Property.aggregate([
      { $group: { _id: null, total: { $sum: { $size: '$propertyPhotos' } } } },
    ]);

    return {
      propertiesWithImages,
      propertiesWithoutImages,
      totalImages: totalImageCount[0]?.total || 0,
      coverage: `${(
        (propertiesWithImages / (propertiesWithImages + propertiesWithoutImages)) *
        100
      ).toFixed(2)}%`,
    };
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Repair missing data
 */
const repairMissingData = async () => {
  const repairs = {
    timestamp: new Date(),
    operations: [],
  };

  try {
    // Repair users without email format
    const User = mongoose.model('User');
    const usersWithoutRole = await User.find({ role: { $exists: false } });
    if (usersWithoutRole.length > 0) {
      await User.updateMany(
        { role: { $exists: false } },
        { $set: { role: 'user' } }
      );
      repairs.operations.push({
        type: 'User role',
        count: usersWithoutRole.length,
        status: 'repaired',
      });
    }

    // Repair properties without verification status
    const Property = mongoose.model('Properties');
    const propsWithoutVerification = await Property.find({
      verificationStatus: { $exists: false },
    });
    if (propsWithoutVerification.length > 0) {
      await Property.updateMany(
        { verificationStatus: { $exists: false } },
        { $set: { verificationStatus: 'pending' } }
      );
      repairs.operations.push({
        type: 'Property verification status',
        count: propsWithoutVerification.length,
        status: 'repaired',
      });
    }

    repairs.status = 'completed';
  } catch (error) {
    repairs.status = 'error';
    repairs.error = error.message;
  }

  return repairs;
};

module.exports = {
  dbHealthCheck,
  verifySchemas,
  testImageStorage,
  repairMissingData,
  checkUserDataQuality,
  checkPropertyDataQuality,
  checkContactDataQuality,
};
