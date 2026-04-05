/**
 * Database Migration Script
 * Adds indexes to existing collections for performance optimization
 * AND migrates phoneNumber from Number to String type
 * 
 * Usage: node scripts/migrate-indexes.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE || 'premiumestate';

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL, { dbName: DATABASE_NAME });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const migratePhoneNumbers = async () => {
  const db = mongoose.connection.db;
  const usersCollection = db.collection('User');
  
  console.log('Migrating phoneNumber from Number to String...');
  
  try {
    // Find all users with numeric phoneNumber
    const usersWithNumericPhone = await usersCollection.find({
      phoneNumber: { $type: 'number' }
    }).toArray();
    
    if (usersWithNumericPhone.length === 0) {
      console.log('  No numeric phoneNumbers found, skipping migration');
      return;
    }
    
    console.log(`  Found ${usersWithNumericPhone.length} users with numeric phoneNumber`);
    
    // Convert each numeric phoneNumber to string
    const bulkOps = usersWithNumericPhone.map(user => ({
      updateOne: {
        filter: { _id: user._id },
        update: { $set: { phoneNumber: String(user.phoneNumber) } }
      }
    }));
    
    const result = await usersCollection.bulkWrite(bulkOps);
    console.log(`  ✓ Migrated ${result.modifiedCount} phoneNumbers from Number to String`);
  } catch (error) {
    console.error('  ✗ phoneNumber migration failed:', error.message);
    throw error;
  }
};

const createIndexes = async () => {
  const db = mongoose.connection.db;
  
  console.log('Starting index migration...');
  
  try {
    // Properties collection indexes
    const propertiesCollection = db.collection('Properties');
    
    console.log('Creating indexes for Properties collection...');
    
    await propertiesCollection.createIndex({ deleted: 1 });
    console.log('  ✓ deleted index');
    
    await propertiesCollection.createIndex({ createdDate: -1 });
    console.log('  ✓ createdDate index');
    
    await propertiesCollection.createIndex({ updatedDate: -1 });
    console.log('  ✓ updatedDate index');
    
    await propertiesCollection.createIndex({ createBy: 1 });
    console.log('  ✓ createBy index');
    
    await propertiesCollection.createIndex({ publicSlug: 1 }, { unique: true, sparse: true });
    console.log('  ✓ publicSlug unique sparse index');
    
    await propertiesCollection.createIndex({ verificationStatus: 1 });
    console.log('  ✓ verificationStatus index');
    
    // Compound indexes
    await propertiesCollection.createIndex({ deleted: 1, createdDate: -1 });
    console.log('  ✓ compound: deleted + createdDate');
    
    await propertiesCollection.createIndex({ deleted: 1, verificationStatus: 1 });
    console.log('  ✓ compound: deleted + verificationStatus');
    
    await propertiesCollection.createIndex({ createBy: 1, deleted: 1 });
    console.log('  ✓ compound: createBy + deleted');
    
    await propertiesCollection.createIndex({ publicSlug: 1, deleted: 1 });
    console.log('  ✓ compound: publicSlug + deleted');
    
    // User collection indexes
    const usersCollection = db.collection('User');
    
    console.log('Creating indexes for User collection...');
    
    await usersCollection.createIndex({ username: 1 });
    console.log('  ✓ username index');
    
    await usersCollection.createIndex({ email: 1 }, { sparse: true });
    console.log('  ✓ email sparse index');
    
    await usersCollection.createIndex({ role: 1 });
    console.log('  ✓ role index');
    
    await usersCollection.createIndex({ deleted: 1 });
    console.log('  ✓ deleted index');
    
    // Compound indexes
    await usersCollection.createIndex({ role: 1, deleted: 1 });
    console.log('  ✓ compound: role + deleted');
    
    await usersCollection.createIndex({ username: 1, deleted: 1 });
    console.log('  ✓ compound: username + deleted');
    
    await usersCollection.createIndex({ email: 1, deleted: 1 });
    console.log('  ✓ compound: email + deleted');
    
    // Contact collection indexes (if exists)
    try {
      const contactsCollection = db.collection('Contacts');
      await contactsCollection.createIndex({ deleted: 1 });
      await contactsCollection.createIndex({ createdDate: -1 });
      console.log('Created indexes for Contacts collection');
    } catch (error) {
      console.log('Contacts collection not found, skipping...');
    }
    
    // Lead collection indexes (if exists)
    try {
      const leadsCollection = db.collection('Leads');
      await leadsCollection.createIndex({ deleted: 1 });
      await leadsCollection.createIndex({ createdDate: -1 });
      console.log('Created indexes for Leads collection');
    } catch (error) {
      console.log('Leads collection not found, skipping...');
    }
    
    console.log('\n✅ Index migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Index migration failed:', error.message);
    throw error;
  }
};

const runMigration = async () => {
  await connectDB();
  await migratePhoneNumbers();  // Run phoneNumber migration first
  await createIndexes();
  await mongoose.disconnect();
  console.log('Database disconnected');
  process.exit(0);
};

runMigration().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
