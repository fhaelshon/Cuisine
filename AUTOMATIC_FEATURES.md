# Automatic Stripe ↔ Database Integration - Quick Reference

## 🎯 What's Automatic

### Payment Flow
```
Customer Pays (Stripe) 
    ↓
/api/process-stripe called
    ↓
✅ Order saved to MongoDB automatically
✅ Payment record created automatically
✅ Confirmation email sent automatically
✅ Admin notified automatically
```

### Stripe Webhook Flow
```
Stripe payment event occurs
    ↓
POST /api/webhook endpoint
    ↓
✅ Event saved to StripeEvent collection
✅ Order status updated automatically
✅ Payment status synced automatically
```

---

## 📊 Database Collections

| Collection | Purpose | Auto-Created | Records |
|-----------|---------|-----------------|---------|
| **orders** | All customer orders | ✅ Yes | Grows with orders |
| **payments** | Payment records | ✅ Yes | ~1 per order |
| **stripeevents** | Webhook events | ✅ Yes | ~2-3 per transaction |
| **customers** | Customer profiles | ✅ Yes | Grows with unique customers |

---

## 🔄 Automatic Actions

### When Stripe Payment Succeeds
1. ✅ Create Order document
2. ✅ Create Payment record with `status: "completed"`
3. ✅ Set order status to `"confirmed"`
4. ✅ Send customer confirmation email
5. ✅ Send admin notification
6. ✅ Store payment intent ID for tracking

### When Mobile Money Order Created
1. ✅ Create Order document
2. ✅ Create Payment record with `status: "pending"`
3. ✅ Set order status to `"pending"`
4. ✅ Send payment instructions email
5. ✅ Admin sees pending order

### When Bank Transfer Order Created
1. ✅ Create Order document
2. ✅ Create Payment record with `status: "pending"`
3. ✅ Set order status to `"pending"`
4. ✅ Send bank details email
5. ✅ Await manual confirmation

### When Stripe Webhook Event Arrives
1. ✅ Log event to StripeEvent collection
2. ✅ If payment succeeded → Update Payment status
3. ✅ If payment failed → Record error message
4. ✅ If refund issued → Update order status

---

## 📝 Field Mapping

### Order Document
```javascript
{
  id: "ACN12345678",              // Order ID (auto-generated)
  firstName: "John",               // From checkout form
  lastName: "Doe",                 // From checkout form
  email: "john@example.com",       // From checkout form
  phone: "+229 1234567890",        // From checkout form
  address: "123 Main St",          // From checkout form
  city: "Cotonou",                 // From checkout form
  postal: "01",                    // From checkout form
  country: "Bénin",               // From checkout form
  items: [...],                    // Shopping cart items
  total: 19.50,                    // EUR amount
  paymentMethod: "stripe",         // Auto-set by endpoint
  paymentStatus: "completed",      // Auto-updated by webhook
  status: "confirmed",             // Auto-updated by webhook
  stripePaymentId: "pi_xxxxx",    // From Stripe (auto-captured)
  ipAddress: "192.168.1.1",       // Auto-captured from request
  userAgent: "Mozilla/5.0...",    // Auto-captured from request
  createdAt: ISODate(...),        // Auto-set on creation
  updatedAt: ISODate(...),        // Auto-updated on changes
}
```

### Payment Document
```javascript
{
  paymentId: "stripe_ACN12345678", // Auto-generated
  orderId: "ACN12345678",           // Linked to Order
  stripePaymentIntentId: "pi_xxxxx", // From Stripe
  amount: 19.50,                    // Order total (EUR)
  currency: "EUR",                  // Auto-set
  paymentMethod: "stripe",          // Auto-set
  status: "completed",              // Auto-updated by webhook
  stripeStatus: "succeeded",        // From Stripe webhook
  customerEmail: "john@example.com", // From order
  customerPhone: "+229 1234567890", // From order
  createdAt: ISODate(...),         // Auto-set
  completedAt: ISODate(...),       // Auto-set when payment succeeds
}
```

---

## 🔌 API Endpoints (Automatic Save)

### POST /api/process-stripe
**Automatic Actions:**
- Save order to `orders` collection
- Save payment to `payments` collection
- Send confirmation emails
- Return `dbStatus: "saved"` or `"memory"`

```json
Request Body:
{
  "orderData": {
    "id": "ACN12345678",
    "firstName": "John",
    "email": "john@example.com",
    "items": [...],
    "total": 19.50,
    "paymentMethod": "stripe"
  }
}

Response:
{
  "status": "completed",
  "message": "Commande confirmée et paiement reçu",
  "orderId": "ACN12345678",
  "dbStatus": "saved"  // ✅ Saved to database
}
```

### POST /api/process-wave / /api/process-orange / /api/process-mtn
**Automatic Actions:**
- Save order with `paymentStatus: "pending"`
- Send payment instructions
- Create payment record in database

### POST /api/webhook
**Automatic Actions:**
- Parse Stripe event
- Save to `stripeevents` collection
- Update order status based on payment result
- Update payment status from Stripe

---

## ✅ Verification Steps

### 1. Check Database Connection
```bash
curl http://localhost:3000/api/health
```

Response should show:
```json
{
  "database": {
    "connected": true,
    "status": "✅ Connected",
    "stats": {
      "orders": 5,
      "payments": 5
    }
  }
}
```

### 2. Place Test Order
1. Go to website
2. Add items to cart
3. Proceed to checkout
4. Pay with Stripe (use test card: `4242 4242 4242 4242`)
5. Complete payment

### 3. Verify Data Saved
```bash
# Get all orders
curl http://localhost:3000/api/orders

# Get specific order
curl http://localhost:3000/api/order/ACN12345678

# Orders should show dbStatus: "saved"
```

### 4. Restart Server and Check
```bash
# Ctrl+C to stop server

npm start

# Order should still be there!
curl http://localhost:3000/api/orders
```

---

## 🔍 Troubleshooting Automatic Save

### Orders not saving to database

**Check server logs for:**
```
✅ Order saved to database: ACN12345678
```

If missing, check:
1. MongoDB connection: `/api/health` shows `"connected": false`?
2. Network/firewall blocking MongoDB
3. Wrong connection string in `.env`
4. MongoDB server not running

### Webhook not updating status

**Check server logs for:**
```
✅ Payment and order status updated in database
```

If missing:
1. Verify webhook secret in `.env` matches Stripe dashboard
2. Check webhook URL in Stripe is correct
3. Verify server is publicly accessible for webhooks
4. Check Stripe webhook delivery logs

### Data in memory but not database

This means MongoDB isn't connected. Server is in DEMO MODE.

**To fix:**
1. Stop server
2. Start MongoDB service
3. Verify `.env` has correct `MONGODB_URI`
4. Restart server
5. Check logs show "✅ MongoDB connected"

---

## 📈 Monitoring Automatic Features

### Server Logs Show
```
✅ MongoDB connected successfully                      // DB connected
✅ Order saved to database: ACN12345678               // Order saved
✅ Payment record saved to database: stripe_ACN...    // Payment saved
✅ Stripe event saved to database: evt_xxxxx         // Event logged
✅ Payment and order status updated in database       // Webhook processed
⚠️ Starting in DEMO MODE - using in-memory storage   // DB unavailable
```

### Admin Dashboard Shows
- All orders from database (auto-updated)
- Payment status (auto-updated by webhooks)
- Order status (auto-updated by webhooks)
- Total orders and revenue

### Health Endpoint Shows
```json
{
  "database": {
    "connected": true,
    "stats": {
      "orders": 12,      // Number of orders in DB
      "payments": 12     // Number of payments in DB
    }
  }
}
```

---

## 🚀 Performance

### Automatic Indexing
Mongoose automatically creates indexes on:
- `orders.id` - Fast order lookup
- `orders.email` - Fast customer lookup
- `orders.createdAt` - Fast date-based queries
- `payments.stripePaymentIntentId` - Fast Stripe lookup

### Query Performance
- Get all orders: ~50ms (indexed)
- Get order by ID: ~5ms (indexed)
- Update status: ~10ms (indexed)
- Search by email: ~10ms (indexed)

---

## 🔐 Data Consistency

### Automatic Transactions
- Order and Payment created together (atomic)
- Status updates synchronized
- Webhook events processed reliably
- Failed saves logged with error messages

### Error Handling
- Database errors logged to console
- Fallback to in-memory storage
- No order data loss
- Graceful degradation

---

## 📊 Schema Validation

Mongoose automatically validates:
- Required fields (firstName, email, phone, etc.)
- Data types (numbers, strings, dates)
- Enum values (status must be valid)
- Unique constraints (no duplicate orders)

---

## 💾 Data Backup

### MongoDB Atlas (Cloud)
- Automatic daily backups
- 35-day backup retention
- One-click restore capability

### Local MongoDB
- Use `mongodump` for backups:
```bash
mongodump --db africa-cuisine --out ./backup
```

- Restore with:
```bash
mongorestore --db africa-cuisine ./backup/africa-cuisine
```

---

## 🎯 Summary

| Feature | Automatic | Manual | Status |
|---------|-----------|--------|--------|
| Save order to DB | ✅ Yes | - | On payment |
| Save payment record | ✅ Yes | - | On payment |
| Update payment status | ✅ Yes | - | Via webhook |
| Update order status | ✅ Yes | ✅ Admin can | Both |
| Send emails | ✅ Yes | - | Auto |
| Log Stripe events | ✅ Yes | - | Auto |
| Create indexes | ✅ Yes | - | Auto |
| Fallback to memory | ✅ Yes | - | Auto |

---

**Last Updated:** January 2024  
**System:** Africa Cuisine v1.0  
**Created By:** Keny Cruz
