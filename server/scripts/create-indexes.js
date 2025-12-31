/**
 * Database Indexing Script
 * Creates optimized indexes for better query performance
 * Run: node scripts/create-indexes.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Import models
const User = require('../models/user.model');
const Job = require('../models/job.model');
const Application = require('../models/applications.model');

async function createIndexes() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📊 Creating indexes...\n');

    // User indexes
    console.log('Creating User indexes...');
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ createdAt: -1 });
    console.log('✅ User indexes created\n');

    // Job indexes
    console.log('Creating Job indexes...');
    await Job.collection.createIndex({ company: 1 });
    await Job.collection.createIndex({ status: 1 });
    await Job.collection.createIndex({ createdAt: -1 });
    await Job.collection.createIndex({ title: 'text', description: 'text' }); // Full-text search
    console.log('✅ Job indexes created\n');

    // Application indexes
    console.log('Creating Application indexes...');
    await Application.collection.createIndex({ job: 1 });
    await Application.collection.createIndex({ applicant: 1 });
    await Application.collection.createIndex({ status: 1 });
    await Application.collection.createIndex({ createdAt: -1 });
    await Application.collection.createIndex({ job: 1, applicant: 1 }, { unique: true });
    console.log('✅ Application indexes created\n');

    // List all indexes
    console.log('📋 Current indexes:\n');
    const collections = await mongoose.connection.db.listCollections().toArray();

    for (const collection of collections) {
      const indexes = await mongoose.connection.db
        .collection(collection.name)
        .indexes();

      console.log(`${collection.name}:`);
      indexes.forEach((index) => {
        console.log(`  - ${JSON.stringify(index.key)}`);
      });
      console.log('');
    }

    console.log('✅ All indexes created successfully!');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    logger.error('Index creation failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
createIndexes();