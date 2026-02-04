# MongoDB Setup Guide - Africa Cuisine

## Overview

This guide will help you set up MongoDB for the Africa Cuisine restaurant ordering system. The system automatically saves all Stripe payments and orders to the database.

## ✅ What's Included

### Automatic Payment Recording
- **Stripe Payments**: Automatically saved to database when payment succeeds
- **Mobile Money**: Wave, Orange, MTN orders saved with "pending" status
- **Bank Transfers**: Orders saved waiting for manual confirmation
- **Payment History**: Complete payment records with timestamps and status tracking
- **Stripe Webhooks**: Automatic status updates from Stripe events

### Database Features
- ✅ Persistent order storage (survives server restarts)
- ✅ Payment tracking and history
- ✅ Stripe event logging
- ✅ Customer profiles
- ✅ Order status management
- ✅ Automatic order indexing for fast queries
- ✅ Fallback to in-memory storage if database unavailable

---

## Option 1: MongoDB Atlas (Cloud - Recommended)

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Start Free"
3. Create an account with email or Google

### Step 2: Create a Database Cluster

1. Once logged in, click "Create"
2. Select **Free** tier
3. Select a region close to you (e.g., "US East Virginia")
4. Click "Create Cluster" and wait (2-3 minutes)

### Step 3: Set Up Database Access

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Fill in credentials:
   - **Username**: `africacuisine`
   - **Password**: Create a strong password (e.g., `SecurePass2024!`)
4. Click "Add User"

### Step 4: Configure Network Access

1. In left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (0.0.0.0/0) for development
   - *For production, use specific IP addresses*
4. Click "Confirm"

### Step 5: Get Connection String

1. Click "Databases" in left sidebar
2. Click "Connect" button next to your cluster
3. Select "Drivers" → "Node.js"
4. Copy the connection string:
   ```
   mongodb+srv://africacuisine:<password>@cluster0.xxxxx.mongodb.net/africa-cuisine?retryWrites=true&w=majority
   ```

### Step 6: Update .env File

In `server/.env`, replace:
```dotenv
MONGODB_URI=mongodb+srv://africacuisine:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/africa-cuisine?retryWrites=true&w=majority
DB_NAME=africa-cuisine
```

Replace `YOUR_PASSWORD_HERE` with the password you created in Step 3.

---

## Option 2: Local MongoDB Installation

### For Windows:

1. **Download MongoDB Community Edition**
   - Visit [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Select Windows and download MSI installer

2. **Install MongoDB**
   - Run the installer
   - Keep default installation path: `C:\Program Files\MongoDB\Server\7.0`
   - Install MongoDB Compass (included in installer)

3. **Start MongoDB Service**
   - Open Services (press `Win + R`, type `services.msc`)
   - Find "MongoDB Server"
   - Right-click → "Start" (or it starts automatically)

4. **Update .env File**
   ```dotenv
   MONGODB_URI=mongodb://localhost:27017/africa-cuisine
   DB_NAME=africa-cuisine
   ```

5. **Verify Connection**
   ```bash
   mongosh
   > show databases
   ```

### For macOS:

1. **Install via Homebrew**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB**
   ```bash
   brew services start mongodb-community
   ```

3. **Update .env File**
   ```dotenv
   MONGODB_URI=mongodb://localhost:27017/africa-cuisine
   DB_NAME=africa-cuisine
   ```

### For Linux (Ubuntu/Debian):

1. **Install MongoDB**
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

2. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Update .env File**
   ```dotenv
   MONGODB_URI=mongodb://localhost:27017/africa-cuisine
   DB_NAME=africa-cuisine
   ```

---

## Step 3: Install Dependencies

After configuring MongoDB, install required packages:

```bash
cd c:\Users\User\Desktop\cruz\server

# Install Node packages including Mongoose
npm install

# Or if using yarn
yarn install
```

This will install:
- `mongoose` (MongoDB ODM)
- `mongodb` (MongoDB driver)
- Plus all other existing dependencies

---

## Step 4: Start the Server

```bash
# Production mode
npm start

# Development mode (with auto-restart)
npm run dev
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

Or if database unavailable:
```
⚠️ Starting in DEMO MODE - using in-memory storage only
Database Status: ⚠️ In-Memory Storage (Demo Mode)
```

---

## Verifying the Connection

### Check Server Health

Visit `http://localhost:3000/api/health` in your browser:

```json
{
  "status": "ok",
  "database": {
    "connected": true,
    "status": "✅ Connected",
    "stats": {
      "orders": 5,
      "payments": 3
    }
  }
}
```

### Test Payment Recording

1. Go to the Africa Cuisine website (`http://localhost:3000`)
2. Place a test order with Stripe
3. Check `/api/health` or `/api/orders` to verify it's saved
4. Restart the server - order should still be there!

---

## Database Schema

### Orders Collection
```javascript
{
  _id: ObjectId,
  id: "ACN12345678",              // Order ID
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+229 1234567890",
  address: "123 Main St",
  city: "Cotonou",
  postal: "01",
  country: "Bénin",
  items: [
    {
      id: 1,
      name: "Jollof Rice",
      price: 8.50,
      quantity: 2,
      category: "Rice"
    }
  ],
  subtotal: 17.00,
  shippingFee: 2.50,
  total: 19.50,
  paymentMethod: "stripe",        // stripe, bank, wave, orange, mtn
  paymentStatus: "completed",     // pending, processing, completed, failed
  status: "confirmed",            // pending, confirmed, processing, completed
  stripePaymentId: "pi_xxxxx",    // Stripe Payment Intent ID (if applicable)
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z"),
  completedAt: ISODate("2024-01-15T11:00:00Z")
}
```

### Payments Collection
```javascript
{
  _id: ObjectId,
  paymentId: "stripe_ACN12345678",
  orderId: "ACN12345678",
  stripePaymentIntentId: "pi_xxxxx",
  stripeCustomerId: "cus_xxxxx",
  amount: 19.50,
  currency: "EUR",
  paymentMethod: "stripe",
  status: "completed",
  stripeStatus: "succeeded",
  customerEmail: "john@example.com",
  customerPhone: "+229 1234567890",
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  completedAt: ISODate("2024-01-15T10:30:00Z")
}
```

### Stripe Events Collection
```javascript
{
  _id: ObjectId,
  stripeEventId: "evt_xxxxx",
  eventType: "payment_intent.succeeded",
  paymentIntentId: "pi_xxxxx",
  eventData: { /* Full Stripe event data */ },
  processed: true,
  processedAt: ISODate("2024-01-15T10:30:00Z"),
  receivedAt: ISODate("2024-01-15T10:30:00Z")
}
```

---

## API Endpoints for Orders

### Get All Orders
```
GET /api/orders
```
Returns array of all orders sorted by newest first, limited to 500.

### Get Specific Order
```
GET /api/order/:id
```
Example: `GET /api/order/ACN12345678`

### Update Order Status
```
PUT /api/order/:id/status
Body: { "status": "processing" }
```

Valid statuses:
- `pending` - Awaiting payment
- `confirmed` - Payment received
- `processing` - Being prepared
- `completed` - Delivered
- `cancelled` - Cancelled by customer
- `refunded` - Money refunded

---

## Admin Dashboard Access

1. Go to `http://localhost:3000`
2. Click "Admin Panel" (bottom right)
3. Password: `admin2024` (change in .env)
4. View all orders from database
5. Update order statuses
6. Track payment information

---

## Automatic Features

### Automatic Order Saving
- ✅ All Stripe payments saved immediately
- ✅ Mobile money orders saved with pending status
- ✅ Bank transfer orders saved awaiting confirmation
- ✅ Customer data associated with orders
- ✅ Order timestamps and IP addresses logged

### Automatic Payment Tracking
- ✅ Payment intent IDs stored and tracked
- ✅ Payment status synchronized with Stripe
- ✅ Failed payments recorded with error messages
- ✅ Refunds tracked automatically

### Automatic Webhook Processing
- ✅ Stripe webhooks automatically update order/payment status
- ✅ Payment confirmation events trigger status updates
- ✅ Failure events recorded with error information
- ✅ Refund events update order status

### Fallback Mechanism
- ✅ If database unavailable, falls back to in-memory storage
- ✅ Server continues operating in DEMO MODE
- ✅ Data preserved when database comes back online
- ✅ Clear status messages in logs and API

---

## Troubleshooting

### "MongoDB connection error"

**Solution 1: Verify MongoDB is running**
```bash
# Windows
Get-Service -Name "MongoDB Server" | Start-Service

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Solution 2: Check connection string in .env**
- Verify `MONGODB_URI` is correct
- Check username and password
- Confirm network access is allowed (for Atlas)

**Solution 3: Use local MongoDB**
```dotenv
MONGODB_URI=mongodb://localhost:27017/africa-cuisine
```

### "Cannot find module 'mongoose'"

**Solution:**
```bash
cd server
npm install mongoose mongodb
```

### Orders not persisting

**Check server logs:**
- Look for "✅ MongoDB connected" message
- If you see "⚠️ In-Memory Storage", database isn't connected
- Verify `.env` file has correct `MONGODB_URI`

### Stripe webhooks not updating database

1. Verify Stripe webhook secret in `.env`
2. Check webhook endpoint: `http://your-domain/api/webhook`
3. In Stripe dashboard → Webhooks, verify URL is correct
4. Check server logs for webhook errors

---

## Security Notes

### For Production

1. **Use Atlas IP Whitelist**
   - Don't use "Allow from anywhere" (0.0.0.0/0)
   - Add specific server IP addresses

2. **Use Environment Variables**
   - Never commit `.env` to Git
   - Add `.env` to `.gitignore`
   - Use strong passwords for MongoDB

3. **Enable MongoDB Authentication**
   - Use strong database passwords
   - Enable IP whitelist in Atlas
   - Use VPC peering for secure connections

4. **Use SSL/TLS**
   - Enable encrypted connections
   - Update connection string to use `mongodb+srv://`

---

## Monitoring and Maintenance

### MongoDB Atlas Dashboard
- View storage usage: `Clusters → Collections`
- Monitor queries: `Metrics` tab
- Check backups: `Backup` tab (daily automatic backups on free tier)

### View Data in MongoDB Compass

1. Open MongoDB Compass (installed with MongoDB)
2. Connect with URI from .env
3. Browse orders and payments
4. Execute queries
5. Export/backup data

### Common Queries

```javascript
// Count orders by payment method
db.orders.aggregate([
  { $group: { _id: "$paymentMethod", count: { $sum: 1 } } }
])

// Get total revenue
db.orders.aggregate([
  { $group: { _id: null, total: { $sum: "$total" } } }
])

// Find orders in last 7 days
db.orders.find({
  createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
})

// Find pending payments
db.payments.find({ status: "pending" })
```

---

## Next Steps

1. ✅ Set up MongoDB (Atlas or Local)
2. ✅ Update `.env` with connection string
3. ✅ Run `npm install`
4. ✅ Start server with `npm start`
5. ✅ Test with order payment
6. ✅ Verify data in database
7. ✅ Monitor admin dashboard

---

## Support

For issues:
1. Check server logs for error messages
2. Visit `/api/health` to check database status
3. Verify `.env` configuration
4. Check MongoDB Atlas/local database is running
5. Review firewall/network settings

**Contact: kenycruz701@gmail.com**

---

Last Updated: January 2024
Version: 1.0 (MongoDB Integration)
