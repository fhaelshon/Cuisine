// ============================================
// TEST DATABASE CONNECTION
// Run this to test if database is working
// ============================================

const mongoose = require('mongoose');
require('dotenv').config();

async function testDatabaseConnection() {
    try {
        console.log('\n🧪 Testing Database Connection...\n');

        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/africa-cuisine';
        console.log('📍 Connection String: ', mongoUri);

        console.log('\n⏳ Connecting to MongoDB...');
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });

        console.log('✅ Successfully connected to MongoDB!\n');

        // Test collections
        const { Order, Payment, StripeEvent, Customer } = require('./models');

        console.log('📦 Testing Collections:\n');

        // Check Order collection
        const orderCount = await Order.countDocuments();
        console.log(`   Orders: ${orderCount} documents`);

        // Check Payment collection
        const paymentCount = await Payment.countDocuments();
        console.log(`   Payments: ${paymentCount} documents`);

        // Check StripeEvent collection
        const eventCount = await StripeEvent.countDocuments();
        console.log(`   StripeEvents: ${eventCount} documents`);

        // Check Customer collection
        const customerCount = await Customer.countDocuments();
        console.log(`   Customers: ${customerCount} documents`);

        console.log('\n✅ All collections are accessible!\n');

        // Test writing sample data
        console.log('📝 Testing Data Write...');
        
        const testOrder = new Order({
            id: 'TEST_' + Date.now(),
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '+229 12345678',
            address: '123 Test St',
            city: 'Test City',
            postal: '00',
            country: 'Test Country',
            items: [
                {
                    id: 1,
                    name: 'Test Item',
                    price: 10.00,
                    quantity: 1
                }
            ],
            subtotal: 10.00,
            shippingFee: 2.50,
            total: 12.50,
            paymentMethod: 'bank',
            status: 'pending'
        });

        const savedOrder = await testOrder.save();
        console.log(`   ✅ Test order created: ${savedOrder.id}\n`);

        // Verify write
        const retrievedOrder = await Order.findOne({ id: savedOrder.id });
        if (retrievedOrder) {
            console.log('✅ Successfully retrieved test order from database!\n');
            console.log('Order Details:');
            console.log(`   ID: ${retrievedOrder.id}`);
            console.log(`   Name: ${retrievedOrder.firstName} ${retrievedOrder.lastName}`);
            console.log(`   Email: ${retrievedOrder.email}`);
            console.log(`   Total: €${retrievedOrder.total}`);
            console.log(`   Status: ${retrievedOrder.status}\n`);
        }

        // Clean up test data
        await Order.deleteOne({ id: savedOrder.id });
        console.log('🧹 Test order cleaned up\n');

        console.log('═══════════════════════════════════════════');
        console.log('✅ DATABASE CONNECTION TEST PASSED!');
        console.log('═══════════════════════════════════════════\n');
        console.log('Your database is ready to use!');
        console.log('\nNext steps:');
        console.log('1. Run: npm run init-db (to create indexes)');
        console.log('2. Run: npm start (to start the server)');
        console.log('3. Visit: http://localhost:3000\n');

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ DATABASE CONNECTION TEST FAILED!\n');
        console.error('Error:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Make sure MongoDB is running locally');
        console.error('2. Or update MONGODB_URI in .env for MongoDB Atlas');
        console.error('3. Run: npm install (if mongoose is missing)');
        console.error('\nTo start MongoDB locally:');
        console.error('   Windows: net start MongoDB');
        console.error('   Mac: brew services start mongodb-community');
        console.error('   Linux: sudo systemctl start mongod\n');
        process.exit(1);
    }
}

testDatabaseConnection();
