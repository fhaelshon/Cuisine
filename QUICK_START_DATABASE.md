# 🚀 5-Minute Database Setup (Quick Start)

## Prerequisites
- MongoDB installed locally (download from mongodb.com)
- Node.js and npm installed
- Africa Cuisine project

---

## Step 1: Start MongoDB

### Windows (PowerShell)
```powershell
# Start MongoDB service
net start MongoDB
# Or:
Get-Service -Name "MongoDB Server" | Start-Service
```

### Mac
```bash
brew services start mongodb-community
```

### Linux
```bash
sudo systemctl start mongod
```

**Verify:** Open terminal and run `mongosh` - you should see `>`

---

## Step 2: Initialize Database

```bash
# Navigate to server folder
cd c:\Users\User\Desktop\cruz\server

# Install dependencies (one time only)
npm install

# Create database tables and indexes
npm run init-db
```

**Expected output:**
```
✅ Orders collection ready
✅ Payments collection ready
✅ StripeEvents collection ready
✅ Customers collection ready
✅ Database initialization complete!
```

---

## Step 3: Test Connection

```bash
npm run test-db
```

**Expected output:**
```
✅ Successfully connected to MongoDB!
✅ All collections are accessible!
✅ DATABASE CONNECTION TEST PASSED!
```

---

## Step 4: Start Server

```bash
npm start
```

**Expected output:**
```
✅ MongoDB connected successfully
============================================
Africa Cuisine Server - MongoDB Integration
============================================
Server running on port 3000
```

---

## Step 5: Test Website

1. Open browser: `http://localhost:3000`
2. Add items to cart
3. Click **Checkout**
4. Fill in customer info
5. Select **Bank Transfer** (easiest for testing)
6. Click **Complete Order** ✅

---

## Step 6: Verify Order Saved

### In Terminal
```bash
curl http://localhost:3000/api/orders
```

### In Browser
```
http://localhost:3000/api/orders
```

**Should show your order!**

---

## Step 7: View in Admin Panel

1. Go to: `http://localhost:3000`
2. Scroll to bottom
3. Click **"Admin Panel"**
4. Password: `admin2024`
5. See all orders from database! ✅

---

## Test Persistence

```bash
# Stop server
Ctrl+C

# Start server again
npm start

# Check orders
http://localhost:3000/api/orders

# Order still there! ✅
```

---

## That's It! 🎉

Your database is connected and working!

| What | Status |
|------|--------|
| MongoDB running | ✅ |
| Database created | ✅ |
| Collections created | ✅ |
| Server connected | ✅ |
| Orders saved | ✅ |
| Admin panel working | ✅ |
| Data persistent | ✅ |

---

## Troubleshooting

### MongoDB won't start
- Windows: `net start MongoDB`
- Check Services (Windows): Press `Win+R`, type `services.msc`, find MongoDB

### Connection error
- Check `.env` has: `MONGODB_URI=mongodb://localhost:27017/africa-cuisine`
- Run `npm run test-db` to diagnose

### Orders not saving
- Check server is connected: `http://localhost:3000/api/health`
- Verify MongoDB is running: `mongosh`

---

## Next: Monitor Your Database

### Option 1: MongoDB Compass (Visual)
- Download from: mongodb.com/products/compass
- Connect to: `mongodb://localhost:27017`
- Browse collections visually

### Option 2: Terminal
```bash
mongosh
> show databases
> use africa-cuisine
> db.orders.find()
> exit
```

---

## Common Commands

```bash
# Start database
npm start

# Test connection
npm run test-db

# Initialize tables
npm run init-db

# Check orders
curl http://localhost:3000/api/orders

# Check status
curl http://localhost:3000/api/health
```

---

## You're Done! ✅

Database is connected. Orders are being saved. Website is fully functional.

**Next:** Place real orders and watch them save to your database!
