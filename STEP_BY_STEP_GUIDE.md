# 📋 Step-by-Step: Database Setup & Connection

## Complete Visual Guide

---

## ✅ PHASE 1: MongoDB Installation

### Windows

**Step 1:** Download MongoDB
```
1. Go to: https://www.mongodb.com/try/download/community
2. Select "Windows (msi)"
3. Click Download
4. Run installer
```

**Step 2:** Install
```
1. Open downloaded file
2. Click "Next" repeatedly
3. Keep all default settings
4. Click "Install"
5. Click "Finish"
```

**Step 3:** Verify MongoDB is Running
```
1. Open PowerShell (Win+R, type "powershell")
2. Type: Get-Service -Name "MongoDB Server"
3. Look for "Running" status
```

**If not running:**
```powershell
Get-Service -Name "MongoDB Server" | Start-Service
```

---

### Mac

**Step 1:** Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Step 2:** Install MongoDB
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Step 3:** Start MongoDB
```bash
brew services start mongodb-community
```

**Verify:**
```bash
brew services list | grep mongodb
# Should show: mongodb-community ✓ started
```

---

### Linux

**Step 1:** Install MongoDB (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install -y mongodb-org
```

**Step 2:** Start MongoDB
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Verify:**
```bash
sudo systemctl status mongod
# Should show: active (running)
```

---

## ✅ PHASE 2: Verify MongoDB Connection

### Test Connection

```bash
# Type in terminal:
mongosh

# You should see:
# Current Mongosh Log ID: xxx
# Connecting to: mongodb://127.0.0.1:27017/?directConnection=true
# ---
# > (This means you're connected!)

# Try a command:
> show databases

# You should see your databases listed

# Exit:
> exit
```

**If connection fails:**
1. Make sure MongoDB is running (see Phase 1, Step 3)
2. Check MongoDB service status
3. Try restarting MongoDB

---

## ✅ PHASE 3: Initialize Database Tables

### Navigate to Project

```bash
# Open PowerShell/Terminal and go to:
cd c:\Users\User\Desktop\cruz\server

# Or navigate there manually:
# 1. Open File Explorer
# 2. Go to: Desktop → cruz → server
# 3. Right-click → "Open in Terminal"
```

### Install Dependencies

```bash
# One time only - installs mongoose, mongodb, etc.
npm install
```

**Wait for:** `added X packages`

### Create Database Tables

```bash
# Initialize database - creates collections and indexes
npm run init-db
```

**Expected Output:**
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
```

---

## ✅ PHASE 4: Test Database Connection

### Run Test Script

```bash
# Still in server folder
npm run test-db
```

**Expected Output:**
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

## ✅ PHASE 5: Start the Server

```bash
# Still in server folder
npm start
```

**Expected Output:**
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
- http://localhost:3000/api/health
- http://localhost:3000/api/orders

Admin Dashboard:
- http://localhost:3000

============================================
```

**Server is running!** ✅

---

## ✅ PHASE 6: Verify Database Connection

### Check in Browser

**Open:** `http://localhost:3000/api/health`

**Expected Response:**
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

**If you see `"connected": true`** → Database is working! ✅

---

## ✅ PHASE 7: Test Order Creation & Saving

### Place Test Order

**Step 1:** Go to Website
```
http://localhost:3000
```

**Step 2:** Add Items to Cart
```
1. Click on any menu item
2. It appears in the cart
3. View cart (click "View Cart" or cart icon)
```

**Step 3:** Proceed to Checkout
```
1. Click "Checkout" button
```

**Step 4:** Fill in Customer Info
```
First Name:    John
Last Name:     Test
Email:         john@example.com
Phone:         +229 12345678
Address:       123 Main Street
City:          Cotonou
Postal Code:   01
Country:       Bénin
```

**Step 5:** Choose Payment Method
```
Select: "Virement Bancaire" (Bank Transfer)
This is easiest for testing - no real payment needed
```

**Step 6:** Complete Order
```
Click "Completez Votre Commande"
```

**Order is now saved to database!** ✅

---

## ✅ PHASE 8: Verify Order Was Saved

### Method 1: API Endpoint

```bash
# In terminal/PowerShell:
curl http://localhost:3000/api/orders
```

**Should show:**
```json
[
  {
    "id": "ACN1234567890",
    "firstName": "John",
    "lastName": "Test",
    "email": "john@example.com",
    "items": [...],
    "total": 19.50,
    "status": "pending",
    "createdAt": "2024-01-31T10:30:00.000Z"
  }
]
```

### Method 2: Browser

Open: `http://localhost:3000/api/orders`

Should show same JSON data

### Method 3: Admin Panel

**Step 1:** Go to Admin Panel
```
http://localhost:3000
Scroll to bottom
Click "Admin Panel"
Password: admin2024
```

**Step 2:** View Orders
```
See all orders in a table
Click on order to see details
Update order status
```

---

## ✅ PHASE 9: Test Data Persistence

**Test:** Does order survive server restart?

**Step 1:** Stop Server
```
In terminal: Press Ctrl+C
```

**Step 2:** Start Server Again
```
npm start
```

**Step 3:** Check Orders
```
http://localhost:3000/api/orders
```

**Your order is still there!** ✅ (Data persisted!)

---

## ✅ PHASE 10: Monitor Database Visually

### Install MongoDB Compass

**Step 1:** Download
```
Go to: https://www.mongodb.com/products/compass
Click Download
Run installer
```

**Step 2:** Open MongoDB Compass

**Step 3:** Connect
```
Connection: mongodb://localhost:27017
Click "Connect"
```

**Step 4:** View Your Database
```
1. Click "africa-cuisine" database
2. See collections: orders, payments, stripeevents
3. Click "orders" collection
4. See your order document
5. Click to expand and view all fields
```

---

## Summary of What You've Done

✅ Installed MongoDB locally
✅ Created database tables/collections
✅ Configured database connection
✅ Started server with database
✅ Verified database is connected
✅ Placed a test order
✅ Order automatically saved to database
✅ Viewed order in API
✅ Viewed order in Admin Panel
✅ Verified data persists after restart
✅ Monitor with MongoDB Compass

---

## What's Working Now

| Feature | Status |
|---------|--------|
| MongoDB running | ✅ |
| Database created | ✅ |
| Server connected | ✅ |
| Website saves orders | ✅ |
| Admin panel shows orders | ✅ |
| Orders persist | ✅ |
| Data is safe | ✅ |

---

## If Something Goes Wrong

### Server won't start

```bash
# Check MongoDB is running
Get-Service -Name "MongoDB Server"

# If not running:
net start MongoDB

# Restart server:
npm start
```

### Orders not saving

```bash
# Check database status
curl http://localhost:3000/api/health

# Should show: "connected": true

# If false, MongoDB isn't running
# Start MongoDB and restart server
```

### Cannot connect to MongoDB

```bash
# Test connection
mongosh

# If fails, MongoDB isn't running
# Start MongoDB (see Phase 1, Step 3)
```

---

## Next Steps

### Now You Can:
1. ✅ Place real orders through website
2. ✅ View all orders in API
3. ✅ Manage orders in Admin Panel
4. ✅ Update order statuses
5. ✅ Monitor with MongoDB Compass
6. ✅ Export order data
7. ✅ Analyze orders and revenue

### For Production:
1. Use MongoDB Atlas (cloud) instead of local
2. Deploy server to cloud
3. Use production Stripe keys
4. Setup email service (SendGrid, etc.)

---

## Command Quick Reference

```bash
# Navigate to project
cd c:\Users\User\Desktop\cruz\server

# Test database connection
npm run test-db

# Initialize database
npm run init-db

# Start server
npm start

# Start with auto-reload (development)
npm run dev

# Check database status (in browser)
http://localhost:3000/api/health

# View all orders (in browser)
http://localhost:3000/api/orders

# Admin panel (in browser)
http://localhost:3000
# Password: admin2024
```

---

**You're Done! Database is fully connected and working.** 🎉

Your Africa Cuisine restaurant ordering system now:
- ✅ Saves all orders to MongoDB
- ✅ Saves all payments to database
- ✅ Tracks order status in real-time
- ✅ Provides admin management
- ✅ Persists data across restarts
- ✅ Ready for production

**Start placing real orders now!**
