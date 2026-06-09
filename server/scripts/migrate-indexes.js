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
    // Console statement removed
  } catch (error) {
    // Console statement removed
    process.exit(1);
  }
};

const migratePhoneNumbers = async () => {
  const db = mongoose.connection.db;
  const usersCollection = db.collection('User');
  
  // Console statement removed
  
  try {
    // Find all users with numeric phoneNumber
    const usersWithNumericPhone = await usersCollection.find({
      phoneNumber: { $type: 'number' }
    }).toArray();
    
    if (usersWithNumericPhone.length === 0) {
      // Console statement removed
      return;
    }
    
    // Console statement removed
    
    // Convert each numeric phoneNumber to string
    const bulkOps = usersWithNumericPhone.map(user => ({
      updateOne: {
        filter: { _id: user._id },
        update: { $set: { phoneNumber: String(user.phoneNumber) } }
      }
    }));
    
    const result = await usersCollection.bulkWrite(bulkOps);
    // Console statement removed
  } catch (error) {
    // Console statement removed
    throw error;
  }
};

const createIndexes = async () => {
  const db = mongoose.connection.db;
  
  // Console statement removed
  
  try {
    // Properties collection indexes
    const propertiesCollection = db.collection('Properties');
    
    // Console statement removed
    
    await propertiesCollection.createIndex({ deleted: 1 });
    // Console statement removed
    
    await propertiesCollection.createIndex({ createdDate: -1 });
    // Console statement removed
    
    await propertiesCollection.createIndex({ updatedDate: -1 });
    // Console statement removed
    
    await propertiesCollection.createIndex({ createBy: 1 });
    // Console statement removed
    
    await propertiesCollection.createIndex({ publicSlug: 1 }, { unique: true, sparse: true });
    // Console statement removed
    
    await propertiesCollection.createIndex({ verificationStatus: 1 });
    // Console statement removed
    
    // Compound indexes
    await propertiesCollection.createIndex({ deleted: 1, createdDate: -1 });
    // Console statement removed
    
    await propertiesCollection.createIndex({ deleted: 1, verificationStatus: 1 });
    // Console statement removed
    
    await propertiesCollection.createIndex({ createBy: 1, deleted: 1 });
    // Console statement removed
    
    await propertiesCollection.createIndex({ publicSlug: 1, deleted: 1 });
    // Console statement removed
    
    // User collection indexes
    const usersCollection = db.collection('User');
    
    // Console statement removed
    
    await usersCollection.createIndex({ username: 1 });
    // Console statement removed
    
    await usersCollection.createIndex({ email: 1 }, { sparse: true });
    // Console statement removed
    
    await usersCollection.createIndex({ role: 1 });
    // Console statement removed
    
    await usersCollection.createIndex({ deleted: 1 });
    // Console statement removed
    
    // Compound indexes
    await usersCollection.createIndex({ role: 1, deleted: 1 });
    // Console statement removed
    
    await usersCollection.createIndex({ username: 1, deleted: 1 });
    // Console statement removed
    
    await usersCollection.createIndex({ email: 1, deleted: 1 });
    // Console statement removed
    
    // Contact collection indexes (if exists)
    try {
      const contactsCollection = db.collection('Contacts');
      await contactsCollection.createIndex({ deleted: 1 });
      await contactsCollection.createIndex({ createdDate: -1 });
      // Console statement removed
    } catch (error) {
      // Console statement removed
    }
    
    // Lead collection indexes (if exists)
    try {
      const leadsCollection = db.collection('Leads');
      await leadsCollection.createIndex({ deleted: 1 });
      await leadsCollection.createIndex({ createdDate: -1 });
      // Console statement removed
    } catch (error) {
      // Console statement removed
    }
    
    // Console statement removed
    
  } catch (error) {
    // Console statement removed
    throw error;
  }
};

const runMigration = async () => {
  await connectDB();
  await migratePhoneNumbers();  // Run phoneNumber migration first
  await createIndexes();
  await mongoose.disconnect();
  // Console statement removed
  process.exit(0);
};

runMigration().catch((error) => {
  // Console statement removed
  process.exit(1);
});
