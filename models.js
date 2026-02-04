// ============================================
// DATABASE MODELS - MONGOOSE SCHEMAS
// Africa Cuisine - Order & Payment System
// ============================================

const mongoose = require('mongoose');

// ============================================
// ORDER SCHEMA
// ============================================

const orderSchema = new mongoose.Schema({
    // Order Identification
    id: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    orderId: {
        type: String,
        unique: true,
        sparse: true
    },
    
    // Customer Information
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    
    // Delivery Address
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postal: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
        default: 'Bénin'
    },
    
    // Order Items
    items: [{
        id: Number,
        name: String,
        price: Number,
        quantity: Number,
        category: String
    }],
    
    // Order Totals
    subtotal: {
        type: Number,
        required: true
    },
    shippingFee: {
        type: Number,
        default: 2.50
    },
    total: {
        type: Number,
        required: true
    },
    
    // Payment Information
    paymentMethod: {
        type: String,
        enum: ['stripe', 'bank', 'wave', 'orange', 'mtn'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    stripePaymentId: {
        type: String,
        sparse: true,
        index: true
    },
    stripeCustomerId: {
        type: String,
        sparse: true
    },
    
    // Order Status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded'],
        default: 'pending',
        index: true
    },
    
    // Tracking Information
    ipAddress: String,
    userAgent: String,
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date,
    
    // Notes
    notes: String,
    adminNotes: String
});

// Index for efficient queries
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ email: 1 });

// ============================================
// PAYMENT SCHEMA
// ============================================

const paymentSchema = new mongoose.Schema({
    // Payment Identification
    paymentId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    orderId: {
        type: String,
        required: true,
        index: true
    },
    
    // Stripe Information
    stripePaymentIntentId: {
        type: String,
        sparse: true,
        index: true
    },
    stripeCustomerId: {
        type: String,
        sparse: true
    },
    stripeChargeId: {
        type: String,
        sparse: true
    },
    
    // Payment Details
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'EUR'
    },
    paymentMethod: {
        type: String,
        enum: ['stripe', 'bank', 'wave', 'orange', 'mtn'],
        required: true
    },
    
    // Payment Status
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    stripeStatus: {
        type: String,
        enum: ['requires_payment_method', 'requires_confirmation', 'requires_action', 'processing', 'requires_capture', 'canceled', 'succeeded'],
        sparse: true
    },
    
    // Customer Information
    customerEmail: String,
    customerPhone: String,
    
    // Metadata
    metadata: {
        type: Map,
        of: String
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    completedAt: Date,
    
    // Error Tracking
    errorMessage: String,
    retryCount: {
        type: Number,
        default: 0
    }
});

// Index for efficient queries
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });

// ============================================
// STRIPE EVENT LOG SCHEMA
// ============================================

const stripeEventSchema = new mongoose.Schema({
    // Event Identification
    stripeEventId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    eventType: {
        type: String,
        required: true,
        index: true
    },
    
    // Related Resources
    paymentIntentId: {
        type: String,
        sparse: true,
        index: true
    },
    customerId: {
        type: String,
        sparse: true
    },
    
    // Event Data
    eventData: mongoose.Schema.Types.Mixed,
    
    // Processing Status
    processed: {
        type: Boolean,
        default: false
    },
    processedAt: Date,
    errorMessage: String,
    
    // Timestamps
    receivedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// ============================================
// CUSTOMER SCHEMA
// ============================================

const customerSchema = new mongoose.Schema({
    // Customer Identification
    customerId: {
        type: String,
        unique: true,
        sparse: true,
        index: true
    },
    stripeCustomerId: {
        type: String,
        unique: true,
        sparse: true,
        index: true
    },
    
    // Customer Information
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    firstName: String,
    lastName: String,
    phone: String,
    
    // Address
    address: String,
    city: String,
    postal: String,
    country: String,
    
    // Statistics
    totalOrders: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    lastOrderDate: Date,
    
    // Preferences
    isSubscribed: {
        type: Boolean,
        default: false
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// ============================================
// CREATE MODELS
// ============================================

const Order = mongoose.model('Order', orderSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const StripeEvent = mongoose.model('StripeEvent', stripeEventSchema);
const Customer = mongoose.model('Customer', customerSchema);

// ============================================
// EXPORT MODELS
// ============================================

module.exports = {
    Order,
    Payment,
    StripeEvent,
    Customer
};
