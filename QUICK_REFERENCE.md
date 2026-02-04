# Quick Reference Card - Stripe ↔ MongoDB Integration

## 🚀 Get Started in 5 Minutes

### 1. Choose MongoDB Setup
```
Option A: MongoDB Atlas (Cloud)
→ Go to mongodb.com/cloud/atlas
→ Create free account
→ Create cluster
→ Get connection string

Option B: Local MongoDB
→ Install from mongodb.com/try/download
→ Start MongoDB service
→ Connection: mongodb://localhost:27017/africa-cuisine
```

### 2. Update .env
```bash
# MongoDB Atlas
MONGODB_URI=mongodb+srv://africacuisine:PASSWORD@cluster.mongodb.net/africa-cuisine?retryWrites=true&w=majority

# Or Local
MONGODB_URI=mongodb://localhost:27017/africa-cuisine
```

### 3. Install Dependencies
```bash
cd server
npm install
```

### 4. Start Server
```bash
npm start
```

### 5. Verify Connection
```
Visit: http://localhost:3000/api/health
Should show: "connected": true
```

---

## 📍 File Locations

| File | Purpose | Lines |
|------|---------|-------|
| `server/models.js` | Database schemas | 277 |
| `server/server.js` | API endpoints + DB integration | 900+ |
| `server/package.json` | Dependencies (added mongoose) | 50 |
| `server/.env` | Configuration (update MONGODB_URI) | 62 |
| `MONGODB_SETUP.md` | Full setup guide | 320 |
| `AUTOMATIC_FEATURES.md` | Features reference | 380 |
| `IMPLEMENTATION_COMPLETE.md` | Implementation summary | 450 |
| `ARCHITECTURE.md` | Architecture diagrams | 380 |

---

## 🔑 Key Endpoints

### Orders
```
GET  /api/orders              # Get all orders
GET  /api/order/:id           # Get specific order
PUT  /api/order/:id/status    # Update order status
```

### Payments
```
POST /api/process-stripe       # Stripe payment
POST /api/process-bank-transfer # Bank payment
POST /api/process-wave         # Wave payment
POST /api/process-orange       # Orange Money
POST /api/process-mtn          # MTN payment
```

### System
```
GET  /api/health              # Database status
POST /api/webhook             # Stripe webhooks
POST /api/admin/login         # Admin login
```

---

## 💾 Database Collections

### orders
```javascript
{
  id: "ACN12345678",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  items: [...],
  total: 19.50,
  paymentMethod: "stripe",
  status: "confirmed",
  createdAt: ISODate(...),
  ...
}
```

### payments
```javascript
{
  paymentId: "stripe_ACN12345678",
  orderId: "ACN12345678",
  stripePaymentIntentId: "pi_xxx",
  amount: 19.50,
  status: "completed",
  stripeStatus: "succeeded",
  ...
}
```

### stripeevents
```javascript
{
  stripeEventId: "evt_xxx",
  eventType: "payment_intent.succeeded",
  eventData: {...},
  processed: true,
  ...
}
```

---

## 🧪 Testing

### Test Stripe Payment
```
1. Go to http://localhost:3000
2. Add items to cart
3. Checkout
4. Use test card: 4242 4242 4242 4242
5. Check /api/orders to verify saved
```

### Test Persistence
```
1. Place order
2. Verify in /api/orders
3. Stop server (Ctrl+C)
4. Restart server
5. Check /api/orders
   → Order still there! ✅
```

### Test Admin Panel
```
1. Go to http://localhost:3000
2. Click "Admin Panel"
3. Password: admin2024
4. View orders from database
5. Update order status
```

---

## 🐛 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| "MongoDB connection error" | Check: Is MongoDB running? Is MONGODB_URI correct? |
| Orders not saving | Run `/api/health` → Check `"connected": true` |
| Cannot find module 'mongoose' | Run `npm install` in server folder |
| Webhooks not working | Verify webhook secret in .env matches Stripe |
| Email not sending | Check email credentials in .env |
| Orders lost after restart | You're in DEMO MODE - configure MongoDB |

---

## 📊 Monitoring Commands

### Check Database Status
```bash
curl http://localhost:3000/api/health
```

### Get All Orders
```bash
curl http://localhost:3000/api/orders
```

### Get Specific Order
```bash
curl http://localhost:3000/api/order/ACN12345678
```

### Update Order Status
```bash
curl -X PUT http://localhost:3000/api/order/ACN12345678/status \
  -H "Content-Type: application/json" \
  -d '{"status":"processing"}'
```

---

## 🔒 Security Checklist

- [ ] Use strong MongoDB password
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Keep .env file private (don't commit)
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS for production
- [ ] Verify Stripe webhook signature
- [ ] Use strong admin password (change from admin2024)
- [ ] Enable database backups

---

## 📈 Performance Tips

1. **Indexes**: Already created automatically on common fields
2. **Queries**: Limited to 500 orders per request
3. **Caching**: Implement for frequently accessed data
4. **Connection Pool**: Mongoose handles automatically
5. **Monitoring**: Use `/api/health` to track DB status

---

## 🎯 Status Codes

| Status | Meaning | Database |
|--------|---------|----------|
| `pending` | Awaiting payment | ✅ Saved |
| `confirmed` | Payment received | ✅ Saved |
| `processing` | Being prepared | ✅ Saved |
| `completed` | Delivered | ✅ Saved |
| `cancelled` | Cancelled | ✅ Saved |
| `refunded` | Money refunded | ✅ Saved |

---

## 📧 Email Automation

### Automatic Emails Sent
- ✅ Customer order confirmation
- ✅ Admin order notification
- ✅ Payment instructions (mobile money)
- ✅ Bank transfer details
- ✅ Error notifications

### Email Configuration
```env
EMAIL_USER=kenycruz701@gmail.com
EMAIL_PASSWORD=your_app_password
```

---

## 💡 Common Tasks

### Add New Order Status
1. Edit `server/models.js` → Order schema → status enum
2. Add to valid statuses in PUT endpoint
3. Restart server

### Change Admin Password
1. Edit `.env` → `ADMIN_PASSWORD=newpassword`
2. Restart server

### Export Orders to CSV
```javascript
// Use MongoDB Compass or:
db.orders.find().pretty()
```

### Query Orders by Date
```javascript
db.orders.find({
  createdAt: {
    $gte: new Date("2024-01-01"),
    $lt: new Date("2024-01-31")
  }
})
```

---

## 📞 Contact & Support

- **Email**: kenycruz701@gmail.com
- **Phone**: +229 0143515312
- **WhatsApp**: +229 0143515312

---

## ✅ Phase 4 Complete Checklist

- [x] Database models created (Order, Payment, StripeEvent, Customer)
- [x] MongoDB connection implemented
- [x] All payment endpoints save to database
- [x] Stripe webhook processing
- [x] Order management endpoints
- [x] Health check endpoint
- [x] Documentation (4 guides)
- [x] Error handling & fallback
- [x] Automatic email notifications
- [x] Database status logging

---

## 🚀 Next Steps

1. **Setup MongoDB** → Follow MONGODB_SETUP.md
2. **Configure .env** → Add MONGODB_URI
3. **Test locally** → Place test orders
4. **Deploy to production** → Set up cloud database
5. **Monitor** → Use `/api/health` endpoint

---

## 📚 Documentation Files

| Document | Purpose | Read Time |
|----------|---------|-----------|
| MONGODB_SETUP.md | Complete setup guide | 20 min |
| AUTOMATIC_FEATURES.md | Features deep-dive | 15 min |
| ARCHITECTURE.md | System diagrams | 10 min |
| IMPLEMENTATION_COMPLETE.md | Implementation summary | 10 min |
| This file | Quick reference | 5 min |

---

## 🎓 Key Technologies

- **Database**: MongoDB (NoSQL document database)
- **ODM**: Mongoose (object modeling)
- **Backend**: Express.js (Node.js framework)
- **Payments**: Stripe API
- **Email**: Nodemailer
- **Storage**: Automatic fallback to in-memory

---

## 🏆 What You Now Have

✅ Persistent order storage
✅ Automatic Stripe payment recording
✅ Complete payment history
✅ Webhook event processing
✅ Order status management
✅ Admin dashboard with database
✅ Fallback to in-memory storage
✅ Production-ready code
✅ Comprehensive documentation

**Data persists across server restarts!**
**Payments are automatically tracked!**
**Orders stored in MongoDB!**

---

## Version Information

- **System**: Africa Cuisine v1.0
- **Phase**: 4 (Stripe ↔ Database Integration)
- **Status**: ✅ COMPLETE
- **Last Updated**: January 2024
- **Node.js**: >= 14.0.0
- **MongoDB**: >= 4.4
- **Stripe API**: v14.0.0+

---

**Ready to deploy! Follow MONGODB_SETUP.md to get started.**
