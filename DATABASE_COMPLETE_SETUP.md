# 🚀 Complete Database Setup & Connection Guide

## Overview

Your Africa Cuisine restaurant ordering system is now fully configured to save and retrieve orders from MongoDB. This guide walks you through:

1. Installing MongoDB locally
2. Creating database tables/collections
3. Testing the connection
4. Connecting the website to save orders
5. Viewing orders in the admin panel

---

## Part 1: Install MongoDB Locally

### Windows

**Download MongoDB:**
- Visit: https://www.mongodb.com/try/download/community
- Choose **Windows (msi)** and download
- Run the installer
- Keep all default settings
- Click **Install**
- MongoDB starts automatically as a Windows Service

**Verify it's running:**
```powershell
# Open PowerShell and run:
Get-Service -Name "MongoDB Server"

# Should show: Running
```

**If it's not running:**
```powershell
# Start MongoDB
net start MongoDB

# Or via PowerShell:
Get-Service -Name "MongoDB Server" | Start-Service
```

### Mac

```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify (optional)
brew services list
# Should show: mongodb-community ... started
```

### Linux (Ubuntu/Debian)

```bash
# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable auto-start
sudo systemctl enable mongod

# Verify
sudo systemctl status mongod
```

---

## Part 2: Verify MongoDB Connection

### Test Connection with mongosh

```bash
# Open terminal/PowerShell and run:
mongosh

# You should see:
# Current Mongosh Log ID: 
# Connecting to: mongodb://127.0.0.1:27017/?directConnection=true
# ---
# > (This means you're connected!)

# List databases
> show databases

# Exit
> exit
```

---

## Part 3: Setup Database Tables & Collections

Navigate to your project folder and run the initialization script:

```bash
# Go to server folder
cd c:\Users\User\Desktop\cruz\server

# Make sure dependencies are installed
npm install

# Initialize database (creates collections and indexes)
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

## Part 4: Test Database Connection

Before starting the server, test that everything is connected:

```bash
# Still in server folder
npm run test-db
```

You should see:
```
🧪 Testing Database Connection...

📍 Connection String: mongodb://localhost:27017/africa-cuisine

⏳ Connecting to MongoDB...
✅ Successfully connected to MongoDB!

📦 Testing Collections:

   Orders: 0 documents
   Payments: 0 documents
   StripeEvents: 0 documents
   Customers: 0 documents

✅ All collections are accessible!

📝 Testing Data Write...
   ✅ Test order created: TEST_1234567890

✅ Successfully retrieved test order from database!

Order Details:
   ID: TEST_1234567890
   Name: Test User
   Email: test@example.com
   Total: €12.50
   Status: pending

🧹 Test order cleaned up

═══════════════════════════════════════════
✅ DATABASE CONNECTION TEST PASSED!
═══════════════════════════════════════════
```

---

## Part 5: Start the Server

```bash
# From server folder
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

Created by: Keny Cruz
Email: kenycruz701@gmail.com
Phone: +229 0143515312

API Endpoints:
- http://localhost:3000/api/health (check status)
- http://localhost:3000/api/orders (get all orders)
- http://localhost:3000/api/order/:id (get specific order)

Admin Dashboard:
- http://localhost:3000 (access admin panel)

============================================
```

---

## Part 6: Verify Database Connection

### Check Health Endpoint

Open browser and go to:
```
http://localhost:3000/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-01-31T10:30:00.123Z",
  "creator": "Keny Cruz",
  "email": "kenycruz701@gmail.com",
  "phone": "+229 0143515312",
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

## Part 7: Connect Website to Database

The website is already connected! When you place an order, it automatically saves to the database. Let's test it:

### Test Order Creation

1. **Go to website:**
   ```
   http://localhost:3000
   ```

2. **Add items to cart:**
   - Click menu items
   - Add to cart
   - View cart

3. **Go to checkout:**
   - Click "Checkout"

4. **Fill in customer info:**
   - Name: John Test
   - Email: john@example.com
   - Phone: +229 12345678
   - Address: 123 Main Street
   - City: Cotonou
   - Postal: 01
   - Country: Bénin

5. **Choose payment method:**
   - Select "Bank Transfer" (easiest for testing)
   - Click "Complete Order"

6. **Order is saved to database!** ✅

---

## Part 8: Verify Order Was Saved

### Check via API

```bash
# In terminal/PowerShell
curl http://localhost:3000/api/orders
```

Should return your order(s) in JSON format.

### Check via Admin Dashboard

1. Go to: `http://localhost:3000`
2. Scroll to bottom
3. Click **"Admin Panel"**
4. Enter password: `admin2024`
5. See all orders from database
6. Update order status
7. View payment information

---

## Part 9: Test Data Persistence

The most important feature - orders survive server restart:

1. **Place an order** (as described above)
2. **Verify it shows** in `/api/orders`
3. **Stop server:** Press `Ctrl+C`
4. **Start server again:** Run `npm start`
5. **Check `/api/orders` again**
6. **Order is still there!** ✅

---

## Database Collections Structure

### Orders Collection

```javascript
{
  _id: ObjectId(...),
  id: "ACN1234567890",                // Unique order ID
  firstName: "John",
  lastName: "Test",
  email: "john@example.com",
  phone: "+229 12345678",
  address: "123 Main Street",
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
  paymentMethod: "bank",            // stripe, bank, wave, orange, mtn
  paymentStatus: "pending",         // pending, completed, failed
  status: "pending",                // pending, confirmed, processing, completed
  createdAt: ISODate("2024-01-31..."),
  updatedAt: ISODate("2024-01-31..."),
  ipAddress: "192.168.1.100"
}
```

### Payments Collection

```javascript
{
  _id: ObjectId(...),
  paymentId: "bank_ACN1234567890",
  orderId: "ACN1234567890",
  amount: 19.50,
  currency: "EUR",
  paymentMethod: "bank",
  status: "pending",               // pending, completed, failed
  customerEmail: "john@example.com",
  customerPhone: "+229 12345678",
  createdAt: ISODate("2024-01-31..."),
  completedAt: null
}
```

---

## All Available Commands

```bash
# Navigate to project
cd c:\Users\User\Desktop\cruz\server

# Install dependencies
npm install

# Test database connection (before starting server)
npm run test-db

# Initialize database tables and indexes
npm run init-db

# Start server (production mode)
npm start

# Start server with auto-reload (development)
npm run dev
```

---

## API Endpoints (Database Connected)

### View Orders
```bash
# Get all orders
curl http://localhost:3000/api/orders

# Get specific order
curl http://localhost:3000/api/order/ACN1234567890
```

### Update Order Status
```bash
curl -X PUT http://localhost:3000/api/order/ACN1234567890/status \
  -H "Content-Type: application/json" \
  -d '{"status":"processing"}'

# Valid statuses:
# - pending
# - confirmed
# - processing
# - completed
# - cancelled
# - refunded
```

### Check Database Status
```bash
# Get health status
curl http://localhost:3000/api/health
```

---

## Monitor Database with MongoDB Compass

GUI tool to view database visually:

1. **Download MongoDB Compass:**
   - Go to: https://www.mongodb.com/products/compass
   - Download and install

2. **Open MongoDB Compass**

3. **Connect to local database:**
   - Connection: `mongodb://localhost:27017`
   - Click "Connect"

4. **View your data:**
   - Click "africa-cuisine" database
   - See collections: orders, payments, stripeevents
   - View, search, and export orders
   - Run aggregation queries

---

## Troubleshooting

### "Cannot connect to MongoDB"

**Problem:** Server won't connect to database

**Solutions:**
```bash
# 1. Check if MongoDB is running
# Windows:
Get-Service -Name "MongoDB Server"

# Mac:
brew services list | grep mongodb

# Linux:
sudo systemctl status mongod

# 2. If not running, start it
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# 3. Check .env file
# Open server/.env and verify:
# MONGODB_URI=mongodb://localhost:27017/africa-cuisine

# 4. Restart server
npm start
```

### "Cannot find module 'mongoose'"

**Problem:** Dependencies missing

**Solution:**
```bash
cd server
npm install
```

### Orders not showing in database

**Problem:** Orders don't appear in `/api/orders`

**Solutions:**
1. Verify database is connected: `npm run test-db`
2. Check health endpoint: `http://localhost:3000/api/health`
3. Make sure MongoDB is running
4. Check server logs for errors
5. Try placing another order

### Indexes not created

**Problem:** Database tables don't have proper indexes

**Solution:**
```bash
npm run init-db
```

---

## Summary - You're All Set! ✅

✅ MongoDB installed locally
✅ Database collections created
✅ Indexes configured
✅ Server connected to database
✅ Website saves orders to database
✅ Admin panel shows database orders
✅ Orders persist across restarts

### Next Steps:

1. **Place test orders** through the website
2. **View in admin panel** to see real-time updates
3. **Monitor with MongoDB Compass** for detailed view
4. **Deploy to production** when ready (with MongoDB Atlas)

---

## Quick Command Reference

```bash
# Test database (first time)
npm run test-db

# Initialize database
npm run init-db

# Start server
npm start

# Check connection
http://localhost:3000/api/health

# View all orders
http://localhost:3000/api/orders

# Admin panel
http://localhost:3000
Password: admin2024
```

---

**Your database is now fully connected and ready to save orders!**

For more details, see:
- `DATABASE_CONNECTION_SETUP.md` - Detailed setup guide
- `MONGODB_SETUP.md` - MongoDB configuration options
- `AUTOMATIC_FEATURES.md` - Database features reference
