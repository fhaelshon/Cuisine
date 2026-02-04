// ============================================
// DATABASE INITIALIZATION SCRIPT
// Creates collections and ensures indexes
// ============================================

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const { Order, Payment, StripeEvent, Customer } = require('./models');

async function initializeDatabase() {
    try {
        console.log('🔄 Initializing database...');

        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/africa-cuisine';
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        
        console.log('✅ Connected to MongoDB');

        // Create collections and indexes
        console.log('📦 Creating collections and indexes...');

        // Orders collection
        await Order.collection.createIndex({ id: 1 }, { unique: true });
        await Order.collection.createIndex({ email: 1 });
        await Order.collection.createIndex({ createdAt: -1 });
        await Order.collection.createIndex({ status: 1 });
        console.log('✅ Orders collection ready');

        // Payments collection
        await Payment.collection.createIndex({ paymentId: 1 }, { unique: true });
        await Payment.collection.createIndex({ orderId: 1 });
        await Payment.collection.createIndex({ stripePaymentIntentId: 1 });
        await Payment.collection.createIndex({ createdAt: -1 });
        console.log('✅ Payments collection ready');

        // StripeEvents collection
        await StripeEvent.collection.createIndex({ stripeEventId: 1 }, { unique: true });
        await StripeEvent.collection.createIndex({ eventType: 1 });
        await StripeEvent.collection.createIndex({ receivedAt: -1 });
        console.log('✅ StripeEvents collection ready');

        // Customers collection
        await Customer.collection.createIndex({ email: 1 }, { unique: true, sparse: true });
        console.log('✅ Customers collection ready');

        // Get collection stats
        const orderCount = await Order.countDocuments();
        const paymentCount = await Payment.countDocuments();
        const eventCount = await StripeEvent.countDocuments();

        console.log('\n📊 Database Status:');
        console.log(`   Orders: ${orderCount}`);
        console.log(`   Payments: ${paymentCount}`);
        console.log(`   Events: ${eventCount}`);

        console.log('\n✅ Database initialization complete!');
        console.log('🚀 Ready to start server: npm start\n');

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Make sure MongoDB is running locally');
        console.error('2. Or update MONGODB_URI in .env for MongoDB Atlas');
        console.error('3. Check connection string in .env');
        process.exit(1);
    }
}

// Run initialization
initializeDatabase();
