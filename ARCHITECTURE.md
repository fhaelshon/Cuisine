# Architecture Diagram - Stripe ↔ MongoDB Integration

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE (Browser)                            │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ index.html - Restaurant Website                                   │   │
│  │ - Menu display with EUR/CFA pricing                              │   │
│  │ - Shopping cart                                                   │   │
│  │ - Checkout form                                                   │   │
│  │ - Payment gateway selector                                        │   │
│  │ - Admin panel (password protected)                                │   │
│  │                                                                    │   │
│  │ js/main.js - Frontend Logic                                       │   │
│  │ - Form validation                                                 │   │
│  │ - API requests to backend                                         │   │
│  │ - Stripe.js integration                                           │   │
│  │ - Currency conversion (EUR ↔ XOF)                                 │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────┬──────────────────────────────────────────────────┘
                      │ HTTP/JSON
                      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                       BACKEND (Node.js/Express)                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ server.js - API Endpoints (900 lines)                            │   │
│  │ ├─ Payment Processing                                            │   │
│  │ │ ├─ POST /api/process-stripe          ─→ saves to DB ✅       │   │
│  │ │ ├─ POST /api/process-bank-transfer   ─→ saves to DB ✅       │   │
│  │ │ ├─ POST /api/process-wave            ─→ saves to DB ✅       │   │
│  │ │ ├─ POST /api/process-orange          ─→ saves to DB ✅       │   │
│  │ │ └─ POST /api/process-mtn             ─→ saves to DB ✅       │   │
│  │ │                                                                 │   │
│  │ ├─ Order Management                                              │   │
│  │ │ ├─ GET /api/orders                   ← queries from DB ✅    │   │
│  │ │ ├─ GET /api/order/:id                ← queries from DB ✅    │   │
│  │ │ └─ PUT /api/order/:id/status         → updates DB ✅        │   │
│  │ │                                                                 │   │
│  │ ├─ Stripe Integration                                            │   │
│  │ │ ├─ GET /api/stripe-key                                        │   │
│  │ │ ├─ POST /api/create-payment-intent                            │   │
│  │ │ ├─ POST /api/confirm-payment                                  │   │
│  │ │ └─ POST /api/webhook                 ← saves events ✅       │   │
│  │ │                                                                 │   │
│  │ ├─ Admin                                                          │   │
│  │ │ └─ POST /api/admin/login                                      │   │
│  │ │                                                                 │   │
│  │ ├─ System                                                         │   │
│  │ │ ├─ GET /api/health                   ← DB status ✅          │   │
│  │ │ └─ POST /api/send-order-email                                 │   │
│  │ │                                                                 │   │
│  │ └─ EMAIL SERVICE (Nodemailer)                                   │   │
│  │   └─ Sends to: kenycruz701@gmail.com                            │   │
│  │                                                                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                                           │
│  ┌────────────────┬──────────┼──────────┬──────────────────────────┐    │
│  │                │          │          │                          │    │
│  ↓                ↓          ↓          ↓                          ↓    │
│                                                                         │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │ Stripe API      │  │ Email Service    │  │ Node.js Process  │      │
│  │ (Real/Demo)     │  │ (Gmail SMTP)     │  │ Management       │      │
│  └─────────────────┘  └──────────────────┘  └──────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
         ↓ Webhook                    ↓ Confirmation
         │                           │
         │                      Customer Email
         │
         ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    STRIPE PAYMENT GATEWAY (Cloud)                        │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Stripe Services                                                   │   │
│  │ ├─ Payment Intent Processing                                     │   │
│  │ ├─ Card Tokenization                                             │   │
│  │ ├─ Payment Confirmation                                          │   │
│  │ ├─ Webhook Events                                                │   │
│  │ │  ├─ payment_intent.succeeded  ─→ /api/webhook ✅             │   │
│  │ │  ├─ payment_intent.payment_failed                             │   │
│  │ │  └─ charge.refunded                                            │   │
│  │ ├─ Customer Records (optional)                                   │   │
│  │ └─ Transaction History                                           │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
         ↑ Payment Events
         │
         └──────────────────────────────────┐
                                            │
                                            ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                      DATABASE (MongoDB) ✅ NEW                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Collections (Auto-Created)                                        │   │
│  │                                                                    │   │
│  │ 📦 orders (Main Order Data)                                       │   │
│  │   ├─ id: "ACN12345678"                                            │   │
│  │   ├─ firstName, lastName, email, phone                           │   │
│  │   ├─ address, city, postal, country                              │   │
│  │   ├─ items: [product details]                                    │   │
│  │   ├─ total: 19.50 (EUR)                                          │   │
│  │   ├─ paymentMethod: "stripe|bank|wave|orange|mtn"               │   │
│  │   ├─ status: "pending|confirmed|processing|completed"           │   │
│  │   ├─ stripePaymentId: "pi_xxxxx"                                 │   │
│  │   ├─ createdAt, updatedAt, completedAt                           │   │
│  │   └─ ipAddress, userAgent                                         │   │
│  │   INDEXES: id ✓ email ✓ createdAt ✓ status ✓                    │   │
│  │                                                                    │   │
│  │ 💳 payments (Payment Records)                                     │   │
│  │   ├─ paymentId: "stripe_ACN12345678"                             │   │
│  │   ├─ orderId: "ACN12345678"                                      │   │
│  │   ├─ stripePaymentIntentId: "pi_xxxxx"                           │   │
│  │   ├─ amount: 19.50                                                │   │
│  │   ├─ status: "completed|failed|refunded"                         │   │
│  │   ├─ stripeStatus: "succeeded|requires_action|..."              │   │
│  │   ├─ createdAt, completedAt                                      │   │
│  │   └─ errorMessage (if failed)                                    │   │
│  │   INDEXES: paymentId ✓ orderId ✓ stripePaymentIntentId ✓       │   │
│  │                                                                    │   │
│  │ 🔔 stripeevents (Event Logging)                                  │   │
│  │   ├─ stripeEventId: "evt_xxxxx"                                  │   │
│  │   ├─ eventType: "payment_intent.succeeded"                       │   │
│  │   ├─ paymentIntentId, customerId                                 │   │
│  │   ├─ eventData: {...}                                            │   │
│  │   ├─ processed: true/false                                        │   │
│  │   └─ receivedAt                                                   │   │
│  │   INDEXES: stripeEventId ✓ eventType ✓ receivedAt ✓             │   │
│  │                                                                    │   │
│  │ 👤 customers (Customer Profiles - Optional)                      │   │
│  │   ├─ customerId                                                   │   │
│  │   ├─ email, phone, address                                        │   │
│  │   ├─ totalOrders, totalSpent                                      │   │
│  │   └─ lastOrderDate                                                │   │
│  │   INDEXES: email ✓ customerId ✓                                  │   │
│  │                                                                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Connection Options:                                                     │
│  ├─ MongoDB Atlas (Cloud): mongodb+srv://...                           │
│  └─ Local MongoDB: mongodb://localhost:27017                           │
│                                                                           │
│  Fallback: In-Memory Storage (DEMO MODE) if DB unavailable             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Stripe Payment Flow (Automatic)

```
Customer                Backend              MongoDB               Stripe
   │                      │                     │                   │
   ├─ Submit Payment ─────→│                     │                   │
   │                       ├─ POST /api/         │                   │
   │                       │ process-stripe      │                   │
   │                       │                     │                   │
   │                       ├─ Save Order ────────→│                   │
   │                       │ (auto) ✅            │                   │
   │                       │                     │                   │
   │                       ├─ Save Payment ──────→│                   │
   │                       │ (auto) ✅            │                   │
   │                       │                     │                   │
   │                       ├─ Send Confirmation  │                   │
   │                       │ Email               │                   │
   │                       │                     │                   │
   │                       │                 (Data Persists)         │
   │                       │                     │                   │
   │                       │                     │    ← Webhook ─────┤
   │                       │←────────────────────┤   (event)         │
   │                       │   Update Status     │                   │
   │                       │   (auto) ✅         │                   │
   │                       │                     │                   │
   │← Confirmation ────────┤                     │                   │
│(success)            │                     │                   │
   │                       │                     │                   │
   │              (Server Restart)               │                   │
   │              Data Still There! ✅           │                   │
```

### 2. Mobile Money Flow (Automatic)

```
Customer              Backend             MongoDB
   │                   │                   │
   ├─ Select Mobile ───→│                   │
   │  Money             │                   │
   │                    ├─ Save Order ─────→│ (status: pending)
   │                    │ (auto) ✅          │
   │                    │                   │
   │                    ├─ Save Payment ───→│ (status: pending)
   │                    │ (auto) ✅          │
   │                    │                   │
   │                    ├─ Send Instructions│
   │                    │ Email              │
   │                    │                   │
   │← Payment Details ──┤                   │
   │                    │                   │
   │                    │               (Awaiting Payment)
   │                    │
(Customer sends money)    
   │                    │
   │              (Admin Dashboard)
   │─ Admin Updates ────→│ PUT /api/order/:id/status
   │  Status            │                   │
   │                    ├─ Update DB ──────→│ (status: completed)
   │                    │                   │
   │← Confirmation ─────┤                   │
   │                    │                   │
```

### 3. Webhook Processing Flow (Automatic)

```
Stripe          Network         Backend         MongoDB
   │               │               │              │
   ├─ Event ───────→│               │              │
   │ (payment.      │               │              │
   │  succeeded)    │               │              │
   │                ├─ POST /api/ ──→│              │
   │                │ webhook        │              │
   │                │                │              │
   │                │                ├─ Verify ─┐  │
   │                │                │ Signature │  │
   │                │                │           ↓  │
   │                │                │           ✅ │
   │                │                │              │
   │                │                ├─ Save Event →│
   │                │                │ (auto) ✅    │
   │                │                │              │
   │                │                ├─ Update ────→│
   │                │                │ Order Status │
   │                │                │ (auto) ✅    │
   │                │                │              │
   │                │                ├─ Update ────→│
   │                │                │ Payment Status│
   │                │                │ (auto) ✅    │
   │                │                │              │
   │                │← 200 OK ───────┤              │
   │                │                │              │
```

---

## Component Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Frontend (HTML/CSS/JS)                                         │
│  └─ Communicates via REST API (JSON)                            │
│     │                                                            │
│     ├─ /api/orders           ← Reads order history              │
│     ├─ /api/order/:id        ← Gets order details               │
│     ├─ /api/process-stripe   → Submits payment                  │
│     ├─ /api/process-bank     → Selects payment method           │
│     ├─ /api/process-wave     → Selects payment method           │
│     ├─ /api/admin/login      → Admin authentication             │
│     └─ /api/health           → Checks DB status                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Backend (Express.js + Node.js)                                │
│  └─ Handles all business logic                                  │
│     │                                                            │
│     ├─ Authentication (Admin)                                   │
│     ├─ Order validation                                         │
│     ├─ Payment processing                                       │
│     ├─ Email notifications                                      │
│     ├─ Database operations                                      │
│     └─ Webhook processing                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
         │              │              │
         ↓              ↓              ↓
┌──────────────┐  ┌──────────────┐  ┌─────────────────┐
│   Stripe     │  │   MongoDB    │  │  Email Service  │
│   (Payment)  │  │  (Database)  │  │  (Nodemailer)   │
└──────────────┘  └──────────────┘  └─────────────────┘
```

---

## Database Schema Relationships

```
┌────────────────────────────────┐
│         orders                  │
│  ┌────────────────────────────┐ │
│  │ _id (ObjectId)             │ │
│  │ id (String) - Unique Index │ │
│  │ firstName                   │ │
│  │ lastName                    │ │
│  │ email - Index               │ │
│  │ phone                       │ │
│  │ items[]                     │ │
│  │ total                       │ │
│  │ paymentMethod               │ │
│  │ status - Index              │ │
│  │ stripePaymentId ────┐       │ │
│  │ createdAt - Index   │       │ │
│  │ updatedAt           │       │ │
│  └────────────────────────────┘ │
└────────────────────────────────┘
                │
                │ References
                ↓
┌────────────────────────────────┐
│         payments                │
│  ┌────────────────────────────┐ │
│  │ _id (ObjectId)             │ │
│  │ paymentId - Unique Index   │ │
│  │ orderId ────────────────────╋─────→ orders.id
│  │ stripePaymentIntentId - Idx│ │
│  │ stripeCustomerId           │ │
│  │ amount                      │ │
│  │ currency                    │ │
│  │ paymentMethod               │ │
│  │ status - Index              │ │
│  │ stripeStatus                │ │
│  │ customerEmail               │ │
│  │ createdAt - Index           │ │
│  │ completedAt                 │ │
│  └────────────────────────────┘ │
└────────────────────────────────┘

┌────────────────────────────────┐
│     stripeevents                │
│  ┌────────────────────────────┐ │
│  │ _id (ObjectId)             │ │
│  │ stripeEventId - Unique Idx │ │
│  │ eventType - Index           │ │
│  │ paymentIntentId ────────────╋─────→ payments.stripePaymentIntentId
│  │ customerId                  │ │
│  │ eventData                   │ │
│  │ processed                   │ │
│  │ receivedAt - Index          │ │
│  │ processedAt                 │ │
│  └────────────────────────────┘ │
└────────────────────────────────┘

┌────────────────────────────────┐
│      customers (Optional)       │
│  ┌────────────────────────────┐ │
│  │ _id (ObjectId)             │ │
│  │ customerId                  │ │
│  │ email - Unique Index        │ │
│  │ firstName                   │ │
│  │ lastName                    │ │
│  │ phone                       │ │
│  │ address                     │ │
│  │ totalOrders                 │ │
│  │ totalSpent                  │ │
│  │ lastOrderDate               │ │
│  │ createdAt                   │ │
│  └────────────────────────────┘ │
└────────────────────────────────┘
```

---

## Data Processing Pipeline

```
1. USER INTERACTION LAYER
   ├─ Customer fills checkout form
   ├─ Selects payment method
   └─ Submits payment

2. VALIDATION LAYER
   ├─ Email validation
   ├─ Phone validation
   ├─ Amount validation
   └─ Form completeness check

3. PAYMENT PROCESSING LAYER
   ├─ If Stripe:
   │  ├─ Create Payment Intent
   │  ├─ Process with Stripe.js
   │  └─ Get Stripe payment ID
   │
   ├─ If Mobile Money:
   │  ├─ Generate payment instructions
   │  └─ Show payment details
   │
   └─ If Bank Transfer:
      ├─ Show bank account
      └─ Await manual confirmation

4. DATABASE PERSISTENCE LAYER ✅
   ├─ Create Order document
   ├─ Store customer info
   ├─ Store items and total
   ├─ Create Payment record
   ├─ Store payment method
   ├─ Store payment status
   └─ Auto-index for queries

5. NOTIFICATION LAYER
   ├─ Send customer confirmation email
   ├─ Send admin notification
   └─ Log order to dashboard

6. WEBHOOK PROCESSING LAYER ✅
   ├─ Receive Stripe event
   ├─ Verify event signature
   ├─ Log event to database
   ├─ Update order status
   ├─ Update payment status
   └─ Store completion timestamp

7. PERSISTENCE VERIFICATION
   └─ Order survives server restart ✅
```

---

## Summary

- **3 Layers:** Frontend → Backend → Database
- **Multiple Payment Methods:** Stripe, Bank, Wave, Orange, MTN
- **Automatic Storage:** All orders and payments saved automatically
- **Persistent Data:** Survives server restarts
- **Webhook Integration:** Automatic status updates from Stripe
- **Fallback Mode:** In-memory storage if database unavailable
- **Email Notifications:** Automatic customer and admin emails
- **Admin Dashboard:** View all orders, update statuses, track revenue

**Status:** ✅ FULLY OPERATIONAL
