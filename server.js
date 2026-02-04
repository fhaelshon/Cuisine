// ============================================
// AFRICA CUISINE - STRIPE BACKEND SERVER
// Designed by: Keny Cruz
// Email: kenycruz701@gmail.com
// MongoDB Integration for Automatic Payment Recording
// ============================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Import database models
const { Order, Payment, StripeEvent, Customer } = require('./models');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../'));

// ============================================
// DATABASE CONNECTION
// ============================================

let db_connection = null;

async function connectDatabase() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/africa-cuisine';
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        
        console.log('✅ MongoDB connected successfully');
        db_connection = mongoose.connection;
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('⚠️ Starting in DEMO MODE - using in-memory storage only');
        // Fallback to in-memory storage
        return false;
    }
}

// In-memory order storage (fallback if database unavailable)
let orders = [];

// Database connection flag
let isDbConnected = false;

// Connect to database on startup
connectDatabase().then(connected => {
    isDbConnected = connected;
});

// Admin credentials (in production, use a database with hashed passwords)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2024';

// Stripe configuration (Demo mode - add your real key in .env)
const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY || 'pk_test_demo_key';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key';

let stripe;
try {
    stripe = require('stripe')(STRIPE_SECRET_KEY);
} catch (error) {
    console.log('Stripe configuration skipped for demo mode');
}

// Email configuration
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'kenycruz701@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your_app_password'
    }
});

// Routes

// Get Stripe public key
app.get('/api/stripe-key', (req, res) => {
    res.json({ publishableKey: STRIPE_PUBLIC_KEY });
});

// Create payment intent
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { amount, email, customerName } = req.body;

        if (!stripe || STRIPE_SECRET_KEY.includes('demo')) {
            // Demo mode - simulate success
            return res.json({
                clientSecret: 'demo_secret_' + Date.now(),
                status: 'demo_mode',
                message: 'Payment processing in demo mode'
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'eur',
            metadata: {
                email: email,
                customerName: customerName
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            status: paymentIntent.status
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

// Confirm payment
app.post('/api/confirm-payment', async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        if (!stripe || STRIPE_SECRET_KEY.includes('demo')) {
            // Demo mode - simulate success
            return res.json({
                status: 'success',
                message: 'Payment confirmed in demo mode',
                orderId: 'DEMO' + Date.now()
            });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            res.json({
                status: 'success',
                orderId: paymentIntent.id
            });
        } else {
            res.status(400).json({
                status: 'failed',
                error: 'Payment not completed'
            });
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ error: error.message });
    }
});

// Process Stripe payment and save order to database
app.post('/api/process-stripe', async (req, res) => {
    try {
        const { orderData } = req.body;
        const orderId = orderData.id || generateOrderId();
        
        const orderObject = {
            id: orderId,
            firstName: orderData.firstName,
            lastName: orderData.lastName,
            email: orderData.email,
            phone: orderData.phone,
            address: orderData.address,
            city: orderData.city,
            postal: orderData.postal,
            country: orderData.country,
            items: orderData.items,
            subtotal: orderData.subtotal || orderData.total - 2.5,
            shippingFee: 2.50,
            total: orderData.total,
            paymentMethod: 'stripe',
            paymentStatus: 'completed',
            status: 'confirmed',
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Save to database if connected, otherwise use in-memory
        if (isDbConnected) {
            try {
                const newOrder = new Order(orderObject);
                await newOrder.save();
                console.log('✅ Order saved to database:', orderId);
            } catch (dbError) {
                console.error('⚠️ Database save error:', dbError.message);
                // Fallback to in-memory
                orders.push(orderObject);
            }
        } else {
            orders.push(orderObject);
        }

        // Also save payment record to database
        if (isDbConnected) {
            try {
                const payment = new Payment({
                    paymentId: 'stripe_' + orderId,
                    orderId: orderId,
                    stripePaymentIntentId: orderData.stripePaymentId || 'demo_' + Date.now(),
                    amount: orderData.total,
                    currency: 'EUR',
                    paymentMethod: 'stripe',
                    status: 'completed',
                    stripeStatus: 'succeeded',
                    customerEmail: orderData.email,
                    customerPhone: orderData.phone,
                    createdAt: new Date(),
                    completedAt: new Date()
                });
                await payment.save();
                console.log('✅ Payment record saved to database:', 'stripe_' + orderId);
            } catch (paymentError) {
                console.error('⚠️ Payment record save error:', paymentError.message);
                // Continue even if payment record fails
            }
        }

        // Send confirmation email to customer
        try {
            await emailTransporter.sendMail({
                from: 'Africa Cuisine <kenycruz701@gmail.com>',
                to: orderData.email,
                subject: '✓ Paiement Confirmé - Africa Cuisine',
                html: generateOrderEmail(orderData, 'stripe')
            });
        } catch (emailError) {
            console.error('⚠️ Customer email error:', emailError.message);
        }

        // Send notification email to admin
        try {
            await emailTransporter.sendMail({
                from: 'Africa Cuisine <kenycruz701@gmail.com>',
                to: 'kenycruz701@gmail.com',
                subject: 'Nouvelle Commande Payée - Africa Cuisine',
                html: generateOrderEmail(orderData, 'stripe') + `
                    <div style="margin-top: 20px; padding: 15px; background: #d4edda; border-radius: 8px; border-left: 4px solid #28a745;">
                        <h4>✓ Paiement Confirmé (Stripe)</h4>
                        <p><strong>Numéro de commande:</strong> ${orderId}</p>
                        <p><strong>Téléphone du client:</strong> ${orderData.phone}</p>
                        <p><strong>Montant total:</strong> ${orderData.total.toFixed(2)}€</p>
                        <p><strong>Adresse IP:</strong> ${req.ip}</p>
                        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                        <p><strong>Base de données:</strong> ${isDbConnected ? '✅ Sauvegardé' : '⚠️ Stockage en mémoire'}</p>
                    </div>
                `
            });
        } catch (adminEmailError) {
            console.error('⚠️ Admin email error:', adminEmailError.message);
        }

        res.json({
            status: 'completed',
            message: 'Commande confirmée et paiement reçu',
            orderId: orderId,
            dbStatus: isDbConnected ? 'saved' : 'memory'
        });
    } catch (error) {
        console.error('Error processing Stripe payment:', error);
        res.status(500).json({ 
            error: 'Payment processing error',
            message: error.message
        });
    }
});

// Send order confirmation email
app.post('/api/send-order-email', async (req, res) => {
    try {
        const { orderData } = req.body;

        const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e74c3c 0%, #f39c12 100%); color: white; padding: 20px; border-radius: 8px; }
        .content { margin: 20px 0; }
        .order-items { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .item:last-child { border-bottom: none; }
        .total { font-weight: bold; font-size: 1.2em; color: #e74c3c; margin-top: 15px; }
        .footer { background: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 0.9em; }
        .contact-info { margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍽️ Africa Cuisine - Confirmation de Commande</h1>
        </div>
        
        <div class="content">
            <p>Bonjour <strong>${orderData.firstName} ${orderData.lastName}</strong>,</p>
            
            <p>Merci pour votre commande! Voici les détails:</p>
            
            <div class="order-items">
                <h3>Détails de la Commande:</h3>
                ${orderData.items.map(item => `
                    <div class="item">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                `).join('')}
                <div class="item">
                    <span>Frais de livraison</span>
                    <span>2.50€</span>
                </div>
                <div class="total">
                    Total: ${orderData.total.toFixed(2)}€
                </div>
            </div>
            
            <h3>Adresse de Livraison:</h3>
            <p>
                ${orderData.firstName} ${orderData.lastName}<br>
                ${orderData.address}<br>
                ${orderData.postal} ${orderData.city}<br>
                ${orderData.country}
            </p>
            
            <h3>Méthode de Paiement:</h3>
            <p>
                ${orderData.paymentMethod === 'stripe' 
                    ? 'Carte Bancaire (Stripe)' 
                    : 'Virement Bancaire Direct'}
            </p>
            
            ${orderData.paymentMethod === 'bank' ? `
                <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h4>Détails du Virement:</h4>
                    <p><strong>Bénéficiaire:</strong> Keny Cruz</p>
                    <p><strong>Email:</strong> kenycruz701@gmail.com</p>
                    <p><strong>Téléphone:</strong> +229 0143515312</p>
                    <p><strong>WhatsApp:</strong> +229 0143515312</p>
                    <p style="color: #e74c3c; margin-top: 15px;">
                        <strong>Veuillez nous envoyer une photo du virement pour confirmer votre paiement.</strong>
                    </p>
                </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <h4>Besoin d'aide?</h4>
            <div class="contact-info">
                <p>📞 Téléphone: +229 0143515312</p>
                <p>💬 WhatsApp: +229 0143515312</p>
                <p>📧 Email: kenycruz701@gmail.com</p>
            </div>
            <p style="margin-top: 20px;">Créé et conçu par <strong>Keny Cruz</strong></p>
            <p>&copy; 2024 Africa Cuisine. Tous les droits réservés.</p>
        </div>
    </div>
</body>
</html>
        `;

        // Send email to customer
        await emailTransporter.sendMail({
            from: 'Africa Cuisine <kenycruz701@gmail.com>',
            to: orderData.email,
            subject: '✓ Commande Confirmée - Africa Cuisine',
            html: emailContent
        });

        // Send email to admin
        await emailTransporter.sendMail({
            from: 'Africa Cuisine <kenycruz701@gmail.com>',
            to: 'kenycruz701@gmail.com',
            subject: 'Nouvelle Commande Reçue - Africa Cuisine',
            html: emailContent + `
                <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px;">
                    <h4>Informations Administrateur:</h4>
                    <p><strong>Téléphone du client:</strong> ${orderData.phone}</p>
                    <p><strong>Adresse IP:</strong> ${req.ip}</p>
                    <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                </div>
            `
        });

        res.json({ 
            success: true, 
            message: 'Email de confirmation envoyé' 
        });
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't fail the order if email fails
        res.json({ 
            success: true, 
            message: 'Commande reçue (erreur lors de l\'envoi de l\'email)',
            error: error.message 
        });
    }
});

// Process bank transfer order and save to database
app.post('/api/process-bank-transfer', async (req, res) => {
    try {
        const { orderData } = req.body;
        const orderId = orderData.id || generateOrderId();
        
        const orderObject = {
            id: orderId,
            firstName: orderData.firstName,
            lastName: orderData.lastName,
            email: orderData.email,
            phone: orderData.phone,
            address: orderData.address,
            city: orderData.city,
            postal: orderData.postal,
            country: orderData.country,
            items: orderData.items,
            subtotal: orderData.subtotal || orderData.total - 2.5,
            shippingFee: 2.50,
            total: orderData.total,
            paymentMethod: 'bank',
            paymentStatus: 'pending',
            status: 'pending',
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Save to database if connected
        if (isDbConnected) {
            try {
                const newOrder = new Order(orderObject);
                await newOrder.save();
                console.log('✅ Order saved to database:', orderId);
            } catch (dbError) {
                console.error('⚠️ Database save error:', dbError.message);
                orders.push(orderObject);
            }
        } else {
            orders.push(orderObject);
        }

        // Save payment record
        if (isDbConnected) {
            try {
                const payment = new Payment({
                    paymentId: 'bank_' + orderId,
                    orderId: orderId,
                    amount: orderData.total,
                    currency: 'EUR',
                    paymentMethod: 'bank',
                    status: 'pending',
                    customerEmail: orderData.email,
                    customerPhone: orderData.phone,
                    createdAt: new Date()
                });
                await payment.save();
            } catch (paymentError) {
                console.error('⚠️ Payment record save error:', paymentError.message);
            }
        }

        // Send confirmation email
        await sendOrderConfirmationEmail(orderData, 'bank');

        res.json({
            status: 'pending',
            message: 'Commande en attente de paiement',
            orderId: orderId,
            bankDetails: {
                recipient: 'Keny Cruz',
                email: 'kenycruz701@gmail.com',
                phone: '+229 0143515312',
                whatsapp: '+229 0143515312'
            },
            dbStatus: isDbConnected ? 'saved' : 'memory'
        });
    } catch (error) {
        console.error('Error processing bank transfer:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// MOBILE MONEY ENDPOINTS - WITH DATABASE SAVING
// ============================================

// Process Wave payment and save to database
app.post('/api/process-wave', async (req, res) => {
    try {
        const { orderData } = req.body;
        const orderId = orderData.id || generateOrderId();
        
        const orderObject = {
            id: orderId,
            firstName: orderData.firstName,
            lastName: orderData.lastName,
            email: orderData.email,
            phone: orderData.phone,
            address: orderData.address,
            city: orderData.city,
            postal: orderData.postal,
            country: orderData.country,
            items: orderData.items,
            subtotal: orderData.subtotal || orderData.total - 2.5,
            shippingFee: 2.50,
            total: orderData.total,
            paymentMethod: 'wave',
            paymentStatus: 'pending',
            status: 'pending',
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Save to database
        if (isDbConnected) {
            try {
                const newOrder = new Order(orderObject);
                await newOrder.save();
                console.log('✅ Wave order saved to database:', orderId);
            } catch (dbError) {
                console.error('⚠️ Database save error:', dbError.message);
                orders.push(orderObject);
            }
        } else {
            orders.push(orderObject);
        }

        // Save payment record
        if (isDbConnected) {
            try {
                const payment = new Payment({
                    paymentId: 'wave_' + orderId,
                    orderId: orderId,
                    amount: orderData.total,
                    currency: 'EUR',
                    paymentMethod: 'wave',
                    status: 'pending',
                    customerEmail: orderData.email,
                    customerPhone: orderData.phone,
                    createdAt: new Date()
                });
                await payment.save();
            } catch (paymentError) {
                console.error('⚠️ Payment record save error:', paymentError.message);
            }
        }

        // Send confirmation email with Wave details
        await sendOrderConfirmationEmail(orderData, 'wave');

        res.json({
            status: 'pending',
            message: 'Commande reçue - En attente de confirmation Wave',
            orderId: orderId,
            dbStatus: isDbConnected ? 'saved' : 'memory'
        });
    } catch (error) {
        console.error('Error processing Wave payment:', error);
        res.status(500).json({ error: error.message });
    }
});

// Process Orange Money payment and save to database
app.post('/api/process-orange', async (req, res) => {
    try {
        const { orderData } = req.body;
        const orderId = orderData.id || generateOrderId();
        
        const orderObject = {
            id: orderId,
            firstName: orderData.firstName,
            lastName: orderData.lastName,
            email: orderData.email,
            phone: orderData.phone,
            address: orderData.address,
            city: orderData.city,
            postal: orderData.postal,
            country: orderData.country,
            items: orderData.items,
            subtotal: orderData.subtotal || orderData.total - 2.5,
            shippingFee: 2.50,
            total: orderData.total,
            paymentMethod: 'orange',
            paymentStatus: 'pending',
            status: 'pending',
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Save to database
        if (isDbConnected) {
            try {
                const newOrder = new Order(orderObject);
                await newOrder.save();
                console.log('✅ Orange order saved to database:', orderId);
            } catch (dbError) {
                console.error('⚠️ Database save error:', dbError.message);
                orders.push(orderObject);
            }
        } else {
            orders.push(orderObject);
        }

        // Save payment record
        if (isDbConnected) {
            try {
                const payment = new Payment({
                    paymentId: 'orange_' + orderId,
                    orderId: orderId,
                    amount: orderData.total,
                    currency: 'EUR',
                    paymentMethod: 'orange',
                    status: 'pending',
                    customerEmail: orderData.email,
                    customerPhone: orderData.phone,
                    createdAt: new Date()
                });
                await payment.save();
            } catch (paymentError) {
                console.error('⚠️ Payment record save error:', paymentError.message);
            }
        }

        // Send confirmation email with Orange Money details
        await sendOrderConfirmationEmail(orderData, 'orange');

        res.json({
            status: 'pending',
            message: 'Commande reçue - En attente de confirmation Orange Money',
            orderId: orderId,
            dbStatus: isDbConnected ? 'saved' : 'memory'
        });
    } catch (error) {
        console.error('Error processing Orange Money payment:', error);
        res.status(500).json({ error: error.message });
    }
});

// Process MTN payment and save to database
app.post('/api/process-mtn', async (req, res) => {
    try {
        const { orderData } = req.body;
        const orderId = orderData.id || generateOrderId();
        
        const orderObject = {
            id: orderId,
            firstName: orderData.firstName,
            lastName: orderData.lastName,
            email: orderData.email,
            phone: orderData.phone,
            address: orderData.address,
            city: orderData.city,
            postal: orderData.postal,
            country: orderData.country,
            items: orderData.items,
            subtotal: orderData.subtotal || orderData.total - 2.5,
            shippingFee: 2.50,
            total: orderData.total,
            paymentMethod: 'mtn',
            paymentStatus: 'pending',
            status: 'pending',
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Save to database
        if (isDbConnected) {
            try {
                const newOrder = new Order(orderObject);
                await newOrder.save();
                console.log('✅ MTN order saved to database:', orderId);
            } catch (dbError) {
                console.error('⚠️ Database save error:', dbError.message);
                orders.push(orderObject);
            }
        } else {
            orders.push(orderObject);
        }

        // Save payment record
        if (isDbConnected) {
            try {
                const payment = new Payment({
                    paymentId: 'mtn_' + orderId,
                    orderId: orderId,
                    amount: orderData.total,
                    currency: 'EUR',
                    paymentMethod: 'mtn',
                    status: 'pending',
                    customerEmail: orderData.email,
                    customerPhone: orderData.phone,
                    createdAt: new Date()
                });
                await payment.save();
            } catch (paymentError) {
                console.error('⚠️ Payment record save error:', paymentError.message);
            }
        }

        // Send confirmation email with MTN details
        await sendOrderConfirmationEmail(orderData, 'mtn');

        res.json({
            status: 'pending',
            message: 'Commande reçue - En attente de confirmation MTN Mobile Money',
            orderId: orderId,
            dbStatus: isDbConnected ? 'saved' : 'memory'
        });
    } catch (error) {
        console.error('Error processing MTN payment:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// ADMIN ENDPOINTS
// ============================================

// Admin login
app.post('/api/admin/login', (req, res) => {
    try {
        const { password } = req.body;
        
        if (password === ADMIN_PASSWORD) {
            res.json({
                success: true,
                message: 'Authentification réussie',
                token: 'admin_' + Date.now() // Simple token (use JWT in production)
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Mot de passe incorrect'
            });
        }
    } catch (error) {
        console.error('Error in admin login:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all orders - from database or fallback to memory
app.get('/api/orders', async (req, res) => {
    try {
        let allOrders = [];

        if (isDbConnected) {
            try {
                allOrders = await Order.find().sort({ createdAt: -1 }).limit(500).lean();
                console.log(`✅ Fetched ${allOrders.length} orders from database`);
            } catch (dbError) {
                console.error('⚠️ Database fetch error, falling back to memory:', dbError.message);
                allOrders = orders;
            }
        } else {
            allOrders = orders;
        }

        res.json(allOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get specific order - from database or fallback to memory
app.get('/api/order/:id', async (req, res) => {
    try {
        let order = null;

        if (isDbConnected) {
            try {
                order = await Order.findOne({ id: req.params.id }).lean();
            } catch (dbError) {
                console.error('⚠️ Database lookup error:', dbError.message);
            }
        }

        if (!order) {
            order = orders.find(o => o.id === req.params.id);
        }

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update order status - update database and memory
app.put('/api/order/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        let updatedOrder = null;

        // Update in database
        if (isDbConnected) {
            try {
                updatedOrder = await Order.findOneAndUpdate(
                    { id: req.params.id },
                    { 
                        status: status,
                        updatedAt: new Date(),
                        completedAt: status === 'completed' ? new Date() : null
                    },
                    { new: true }
                ).lean();
                
                if (updatedOrder) {
                    console.log('✅ Order status updated in database:', req.params.id, status);
                }
            } catch (dbError) {
                console.error('⚠️ Database update error:', dbError.message);
            }
        }

        // Also update in memory
        const memOrder = orders.find(o => o.id === req.params.id);
        if (memOrder) {
            memOrder.status = status;
            memOrder.updatedAt = new Date().toISOString();
            updatedOrder = memOrder;
        }

        if (updatedOrder) {
            res.json({
                success: true,
                message: 'Order status updated',
                order: updatedOrder
            });
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateOrderId() {
    return 'ACN' + Date.now().toString().slice(-8);
}

async function sendOrderConfirmationEmail(orderData, paymentMethod) {
    try {
        const paymentInfo = getPaymentMethodInfo(paymentMethod);
        
        const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e74c3c 0%, #f39c12 100%); color: white; padding: 20px; border-radius: 8px; }
        .content { margin: 20px 0; }
        .order-items { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .item:last-child { border-bottom: none; }
        .total { font-weight: bold; font-size: 1.2em; color: #e74c3c; margin-top: 15px; }
        .footer { background: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 0.9em; }
        .payment-box { background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍽️ Africa Cuisine - Confirmation de Commande</h1>
        </div>
        
        <div class="content">
            <p>Bonjour <strong>${orderData.firstName} ${orderData.lastName}</strong>,</p>
            
            <p>Merci pour votre commande! Voici les détails:</p>
            
            <div class="order-items">
                <h3>Détails de la Commande:</h3>
                ${orderData.items.map(item => `
                    <div class="item">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                `).join('')}
                <div class="item">
                    <span>Frais de livraison</span>
                    <span>2.50€</span>
                </div>
                <div class="total">
                    Total: ${orderData.total.toFixed(2)}€
                </div>
            </div>
            
            <h3>Adresse de Livraison:</h3>
            <p>
                ${orderData.firstName} ${orderData.lastName}<br>
                ${orderData.address}<br>
                ${orderData.postal} ${orderData.city}<br>
                ${orderData.country}
            </p>
            
            <h3>Méthode de Paiement:</h3>
            <div class="payment-box">
                ${paymentInfo}
            </div>
        </div>
        
        <div class="footer">
            <h4>Besoin d'aide?</h4>
            <p>📞 Téléphone: +229 0143515312</p>
            <p>💬 WhatsApp: +229 0143515312</p>
            <p>📧 Email: kenycruz701@gmail.com</p>
            <p style="margin-top: 20px;">Créé et conçu par <strong>Keny Cruz</strong></p>
            <p>&copy; 2024 Africa Cuisine. Tous les droits réservés.</p>
        </div>
    </div>
</body>
</html>
        `;

        // Send email to customer
        await emailTransporter.sendMail({
            from: 'Africa Cuisine <kenycruz701@gmail.com>',
            to: orderData.email,
            subject: '✓ Commande Confirmée - Africa Cuisine',
            html: emailContent
        });

        // Send email to admin
        await emailTransporter.sendMail({
            from: 'Africa Cuisine <kenycruz701@gmail.com>',
            to: 'kenycruz701@gmail.com',
            subject: 'Nouvelle Commande Reçue - Africa Cuisine',
            html: emailContent + `
                <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px;">
                    <h4>Informations Administrateur:</h4>
                    <p><strong>Téléphone du client:</strong> ${orderData.phone}</p>
                    <p><strong>Méthode de paiement:</strong> ${paymentMethod}</p>
                    <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        // Don't fail the order if email fails
    }
}

// Helper function to generate order email HTML
function generateOrderEmail(orderData, paymentMethod) {
    const paymentInfo = getPaymentMethodInfo(paymentMethod);
    const orderItems = orderData.items.map(item => `
        <div class="item">
            <span>${item.name} x ${item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}€</span>
        </div>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e74c3c 0%, #f39c12 100%); color: white; padding: 20px; border-radius: 8px; }
        .content { margin: 20px 0; }
        .order-items { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .item:last-child { border-bottom: none; }
        .total { font-weight: bold; font-size: 1.2em; color: #e74c3c; margin-top: 15px; }
        .footer { background: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 0.9em; }
        .payment-box { background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2196F3; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍽️ Africa Cuisine - Confirmation de Commande</h1>
        </div>
        
        <div class="content">
            <p>Bonjour <strong>${orderData.firstName} ${orderData.lastName}</strong>,</p>
            <p>Merci pour votre commande! Voici les détails:</p>
            
            <div class="order-items">
                <h3>Détails de la Commande:</h3>
                ${orderItems}
                <div class="item">
                    <span>Frais de livraison</span>
                    <span>2.50€</span>
                </div>
                <div class="total">
                    Total: ${orderData.total.toFixed(2)}€
                </div>
            </div>
            
            <h3>Adresse de Livraison:</h3>
            <p>
                ${orderData.firstName} ${orderData.lastName}<br>
                ${orderData.address}<br>
                ${orderData.postal} ${orderData.city}<br>
                ${orderData.country}
            </p>
            
            <h3>Méthode de Paiement:</h3>
            <div class="payment-box">
                ${paymentInfo}
            </div>
        </div>
        
        <div class="footer">
            <h4>Besoin d'aide?</h4>
            <p>📞 Téléphone: +229 0143515312</p>
            <p>💬 WhatsApp: +229 0143515312</p>
            <p>📧 Email: kenycruz701@gmail.com</p>
            <p style="margin-top: 20px;">Créé et conçu par <strong>Keny Cruz</strong></p>
            <p>&copy; 2024 Africa Cuisine. Tous les droits réservés.</p>
        </div>
    </div>
</body>
</html>
    `;
}


function getPaymentMethodInfo(method) {
    const methods = {
        'stripe': '<p><strong>💳 Paiement par Carte Bancaire</strong></p><p>Votre paiement a été traité avec succès via Stripe.</p>',
        'bank': '<p><strong>🏦 Virement Bancaire</strong></p><p>Veuillez envoyer une capture d\'écran du virement à: <strong>+229 0143515312</strong> via WhatsApp</p>',
        'wave': '<p><strong>📱 Wave Mobile Money</strong></p><p>Envoyez le virement à: <strong>+229 0143515312</strong><br>Puis envoyez la preuve via WhatsApp au même numéro.</p>',
        'orange': '<p><strong>🟠 Orange Money</strong></p><p>Envoyez le virement à: <strong>+229 0143515312</strong><br>Puis envoyez la preuve via WhatsApp au même numéro.</p>',
        'mtn': '<p><strong>🟡 MTN Mobile Money</strong></p><p>Envoyez le virement à: <strong>+229 0143515312</strong><br>Puis envoyez la preuve via WhatsApp au même numéro.</p>'
    };
    return methods[method] || methods['bank'];
}

// Webhook for Stripe events - with automatic database saving
app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    try {
        if (!stripe || STRIPE_SECRET_KEY.includes('demo')) {
            return res.json({ received: true });
        }

        const sig = req.headers['stripe-signature'];
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        // Save event to database for tracking
        if (isDbConnected) {
            try {
                const stripeEventRecord = new StripeEvent({
                    stripeEventId: event.id,
                    eventType: event.type,
                    paymentIntentId: event.data?.object?.id || null,
                    customerId: event.data?.object?.customer || null,
                    eventData: event.data,
                    processed: false,
                    receivedAt: new Date()
                });
                await stripeEventRecord.save();
                console.log('✅ Stripe event saved to database:', event.id);
            } catch (dbError) {
                console.error('⚠️ Event logging error:', dbError.message);
            }
        }

        // Handle specific event types
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log('✓ Payment succeeded:', paymentIntent.id);
                
                // Update payment status in database
                if (isDbConnected) {
                    try {
                        await Payment.updateMany(
                            { stripePaymentIntentId: paymentIntent.id },
                            { 
                                status: 'completed',
                                stripeStatus: 'succeeded',
                                completedAt: new Date()
                            }
                        );
                        
                        // Also update related order status
                        await Order.updateMany(
                            { stripePaymentId: paymentIntent.id },
                            { 
                                paymentStatus: 'completed',
                                status: 'confirmed',
                                updatedAt: new Date()
                            }
                        );
                        console.log('✅ Payment and order status updated in database');
                    } catch (updateError) {
                        console.error('⚠️ Status update error:', updateError.message);
                    }
                }
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                console.log('✗ Payment failed:', failedPayment.id);
                
                // Update payment status in database
                if (isDbConnected) {
                    try {
                        await Payment.updateMany(
                            { stripePaymentIntentId: failedPayment.id },
                            { 
                                status: 'failed',
                                stripeStatus: failedPayment.status,
                                errorMessage: failedPayment.last_payment_error?.message,
                                updatedAt: new Date()
                            }
                        );
                        console.log('✅ Failed payment recorded in database');
                    } catch (updateError) {
                        console.error('⚠️ Failed payment update error:', updateError.message);
                    }
                }
                break;

            case 'charge.refunded':
                const refundedCharge = event.data.object;
                console.log('↩️ Charge refunded:', refundedCharge.id);
                
                // Update payment status in database
                if (isDbConnected) {
                    try {
                        await Payment.updateMany(
                            { stripeChargeId: refundedCharge.id },
                            { 
                                status: 'refunded',
                                updatedAt: new Date()
                            }
                        );
                        console.log('✅ Refund recorded in database');
                    } catch (updateError) {
                        console.error('⚠️ Refund update error:', updateError.message);
                    }
                }
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({received: true});
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

// Health check and database status
app.get('/api/health', async (req, res) => {
    try {
        const stats = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            creator: 'Keny Cruz',
            email: 'kenycruz701@gmail.com',
            phone: '+229 0143515312',
            database: {
                connected: isDbConnected,
                status: isDbConnected ? '✅ Connected' : '⚠️ Using in-memory storage'
            }
        };

        // Get database statistics if connected
        if (isDbConnected) {
            try {
                const orderCount = await Order.countDocuments();
                const paymentCount = await Payment.countDocuments();
                
                stats.database.stats = {
                    orders: orderCount,
                    payments: paymentCount
                };
            } catch (statsError) {
                console.error('⚠️ Stats error:', statsError.message);
            }
        } else {
            stats.database.stats = {
                orders: orders.length,
                payments: 0,
                note: 'In-memory storage only'
            };
        }

        res.json(stats);
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({ 
            status: 'error',
            message: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// Start server with database status
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    const dbStatus = isDbConnected ? '✅ MongoDB Connected' : '⚠️ In-Memory Storage (Demo Mode)';
    
    console.log(`
    ============================================
    Africa Cuisine Server - MongoDB Integration
    ============================================
    Server running on port ${PORT}
    Database Status: ${dbStatus}
    
    Created by: Keny Cruz
    Email: kenycruz701@gmail.com
    Phone: +229 0143515312
    WhatsApp: +229 0143515312
    
    API Endpoints:
    - http://localhost:${PORT}/api/health (check status)
    - http://localhost:${PORT}/api/orders (get all orders)
    - http://localhost:${PORT}/api/order/:id (get specific order)
    
    Admin Dashboard:
    - http://localhost:${PORT} (access admin panel)
    
    ============================================
    `);
});

module.exports = app;
