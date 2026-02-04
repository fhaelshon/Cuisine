# Database Setup & Connection Guide

## Quick Start (Step by Step)

### Step 1: Install MongoDB Locally

#### Windows
1. Download MongoDB Community Edition from: https://www.mongodb.com/try/download/community
2. Run the installer and keep default settings
3. MongoDB will install and start automatically as a service

**Verify MongoDB is running:**
```bash
# Open PowerShell and run:
Get-Service -Name "MongoDB Server" | Start-Service
```

#### Mac
```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian)
```bash
# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

### Step 2: Verify MongoDB Connection

```bash
# In terminal/PowerShell, run:
mongosh

# You should see:
# > (connected to mongodb://127.0.0.1:27017)

# List databases:
> show databases

# Exit:
> exit
```

---

### Step 3: Initialize Database Tables & Indexes

```bash
# Navigate to project folder
cd c:\Users\User\Desktop\cruz\server

# Install dependencies (if not already done)
npm install

# Initialize database - this creates all collections and indexes
npm run init-db
```

You should see:
```
🔄 Initializing database...
✅ Connected to MongoDB
📦 Creating collections and indexes...
✅ Orders collection ready
✅ Payments collection ready
✅ StripeEvents collection ready
✅ Customers collection ready

📊 Database Status:
   Orders: 0
   Payments: 0
   Events: 0

✅ Database initialization complete!
🚀 Ready to start server: npm start
```

---

### Step 4: Start the Server

```bash
# From the server folder
npm start
```

You should see:
```
✅ MongoDB connected successfully
============================================
Africa Cuisine Server - MongoDB Integration
============================================
Server running on port 3000
Database Status: ✅ MongoDB Connected
```

---

### Step 5: Test the Connection

#### In your browser:
```
http://localhost:3000/api/health
```

Should return:
```json
{
  "status": "ok",
  "database": {
    "connected": true,
    "status": "✅ Connected",
    "stats": {
      "orders": 0,
      "payments": 0
    }
  }
}
```

---

## Test Database Integration

### Test 1: Check Orders Endpoint

```bash
# Get all orders (should be empty initially)
curl http://localhost:3000/api/orders

# Response: []
```

### Test 2: Place a Test Order

1. Go to: `http://localhost:3000`
2. Add items to cart
3. Go to checkout
4. **For Testing: Use Bank Transfer or Mobile Money** (doesn't require real payment)
5. Fill in test info:
   - Name: John Test
   - Email: test@example.com
   - Phone: +229 12345678
   - Address: 123 Main St
6. Select "Bank Transfer" 
7. Click "Complete Order"

### Test 3: Verify Order Was Saved

```bash
# Check orders endpoint again
curl http://localhost:3000/api/orders

# Should now return your order!
[
  {
    "id": "ACN12345678",
    "firstName": "John",
    "lastName": "Test",
    "email": "test@example.com",
    ...
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Test 4: Test Persistence

1. Stop the server: `Ctrl+C`
2. Start server again: `npm start`
3. Check orders again: `curl http://localhost:3000/api/orders`
4. **Order still there!** ✅

---

## Database Collections Explained

### orders Collection
Stores all customer orders:
```javascript
{
  id: "ACN12345678",          // Unique order ID
  firstName: "John",
  lastName: "Test",
  email: "test@example.com",
  phone: "+229 12345678",
  address: "123 Main St",
  city: "Cotonou",
  postal: "01",
  country: "Bénin",
  items: [
    {
      id: 1,
      name: "Jollof Rice",
      price: 8.50,
      quantity: 2
    }
  ],
  subtotal: 17.00,
  shippingFee: 2.50,
  total: 19.50,
  paymentMethod: "bank",      // stripe, bank, wave, orange, mtn
  paymentStatus: "pending",   // pending, completed, failed
  status: "pending",          // pending, confirmed, processing, completed
  createdAt: ISODate(...),
  updatedAt: ISODate(...),
  ipAddress: "192.168.1.1"
}
```

### payments Collection
Stores payment transaction records:
```javascript
{
  paymentId: "bank_ACN12345678",
  orderId: "ACN12345678",
  amount: 19.50,
  currency: "EUR",
  paymentMethod: "bank",
  status: "pending",
  customerEmail: "test@example.com",
  customerPhone: "+229 12345678",
  createdAt: ISODate(...),
  completedAt: null
}
```

### stripeevents Collection
Logs Stripe webhook events (for Stripe payments only):
```javascript
{
  stripeEventId: "evt_xxxxx",
  eventType: "payment_intent.succeeded",
  paymentIntentId: "pi_xxxxx",
  eventData: {...},
  processed: true,
  receivedAt: ISODate(...),
  processedAt: ISODate(...)
}
```

---

## API Endpoints (All Connected to Database)

### Get Orders
```bash
# Get all orders
GET http://localhost:3000/api/orders

# Get specific order
GET http://localhost:3000/api/order/ACN12345678
```

### Create Order (Automatic - called by website)
```bash
# Bank Transfer (saves to DB)
POST http://localhost:3000/api/process-bank-transfer
Body: { "orderData": {...} }

# Mobile Money options:
POST http://localhost:3000/api/process-wave
POST http://localhost:3000/api/process-orange
POST http://localhost:3000/api/process-mtn

# Stripe (saves to DB)
POST http://localhost:3000/api/process-stripe
```

### Update Order Status
```bash
PUT http://localhost:3000/api/order/ACN12345678/status
Body: { "status": "processing" }

# Valid statuses:
# - pending
# - confirmed
# - processing
# - completed
# - cancelled
# - refunded
```

---

## Admin Dashboard (View Database Orders)

1. Go to: `http://localhost:3000`
2. Scroll to bottom, click "Admin Panel"
3. Password: `admin2024`
4. See all orders from database
5. Update order status
6. View payment information

---

## Troubleshooting

### "Cannot connect to MongoDB"

**Solution:**
1. Check MongoDB is running:
   ```bash
   # Windows PowerShell:
   Get-Service -Name "MongoDB Server"
   
   # Should say: Running
   ```

2. If not running, start it:
   ```bash
   # Windows:
   net start MongoDB
   
   # Mac:
   brew services start mongodb-community
   
   # Linux:
   sudo systemctl start mongod
   ```

3. Check connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/africa-cuisine
   ```

### "Cannot find module 'mongoose'"

**Solution:**
```bash
cd server
npm install
```

### Orders not saving to database

**Check:**
1. Is database connected? Run: `curl http://localhost:3000/api/health`
2. Look for: `"connected": true`
3. If false, MongoDB isn't connected

**Fix:**
1. Make sure MongoDB is running
2. Check `.env` for correct MONGODB_URI
3. Try again: `npm start`

### Indexes not created

**Solution:**
Run database initialization:
```bash
npm run init-db
```

---

## Monitor Database with MongoDB Compass

1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Install and open it
3. Connection: `mongodb://localhost:27017`
4. Connect
5. Browse your "africa-cuisine" database
6. View collections: orders, payments, stripeevents
7. View documents in real-time
8. Export data or run queries

---

## Next Steps

✅ MongoDB installed locally
✅ Database initialized with collections
✅ Server running and connected
✅ Admin dashboard showing orders
✅ Orders saving to database
✅ Data persisting across restarts

### Now ready to:
- Place real orders through website
- Track orders in admin panel
- Monitor database growth
- Deploy to production (with MongoDB Atlas)

---

## Summary Commands

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Initialize database tables and indexes
npm run init-db

# Start server (development)
npm start

# Start server with auto-restart (requires nodemon)
npm run dev

# Check if MongoDB is running (Windows)
Get-Service -Name "MongoDB Server"

# Start MongoDB (Windows)
net start MongoDB

# Check health endpoint
curl http://localhost:3000/api/health

# Get all orders
curl http://localhost:3000/api/orders
```

---

**Your database is now connected and ready to save orders!**
