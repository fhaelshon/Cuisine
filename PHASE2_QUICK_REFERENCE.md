# Africa Cuisine - Phase 2 Quick Reference Guide

## 🎯 Quick Start

### Admin Access
1. Click the **🔒 Lock Icon** in the top-right navbar
2. Enter password: `admin2024`
3. Click "Se Connecter" (Login)
4. View and manage all orders

### Mobile Money Payment
1. Select menu items and proceed to checkout
2. Choose **Wave**, **Orange**, or **MTN** payment method
3. Follow the displayed payment instructions
4. Send payment to: **+229 0143515312**
5. Screenshot payment confirmation
6. Send proof via WhatsApp to the same number

---

## 📱 Payment Methods (Updated)

### Available Payment Options

| Method | Status | Requirements |
|--------|--------|--------------|
| 💳 Stripe Card | Active | Card details, live processing |
| 🏦 Bank Transfer | Active | Manual transfer, screenshot proof |
| 👋 Wave | New | Mobile app, screenshot proof |
| 🟠 Orange Money | New | Mobile app, screenshot proof |
| 🟡 MTN Money | New | Mobile app, screenshot proof |

### Mobile Money Instructions
All mobile money methods follow the same process:

1. **Payment Step:**
   - Open your Wave/Orange/MTN app
   - Send money to: **+229 0143515312**
   - Amount: Shown in checkout

2. **Confirmation Step:**
   - Take screenshot of successful transaction
   - Send to WhatsApp: **+229 0143515312**
   - Include order number (ACN format)

3. **Status Update:**
   - Admin verifies payment
   - Order marked as "Completed"
   - Confirmation email sent

---

## 👨‍💼 Admin Panel Features

### Login
- **Password:** `admin2024`
- **Access:** 24/7 available
- **Logout:** Click "Déconnexion" button

### View Orders
Filter by status:
- **Toutes** - All orders
- **En Attente** - Pending payment
- **Complétées** - Paid/confirmed
- **Annulées** - Cancelled orders

### Order Details
Each order shows:
- Order ID (ACN format)
- Customer name & contact
- Delivery address
- Items ordered (with prices)
- Payment method used
- Current status
- Order date & time

### Manage Orders
- Monitor payment status
- Verify payment proofs
- Update order status
- Track deliveries
- Contact customers

---

## 📧 Email System

### Automatic Emails

**Sent to Customer:**
- Order confirmation
- Payment method instructions
- Delivery address confirmation
- Contact information

**Sent to Admin:**
- All customer details
- Order items and total
- Customer contact info
- Payment method used
- IP address & timestamp

### Email Content Includes
✓ Order number  
✓ Customer details  
✓ Items ordered  
✓ Total price  
✓ Delivery address  
✓ Payment instructions  
✓ Contact information  
✓ Creator attribution  

---

## 💳 Payment Status Guide

### Status Meanings

**Pending** (🕐)
- Order received
- Awaiting payment confirmation
- Action: Admin verifies payment proof

**Completed** (✅)
- Payment confirmed
- Order ready for fulfillment
- Action: Prepare and deliver order

**Cancelled** (❌)
- Customer requested cancellation
- Payment not required
- Action: Contact customer

---

## 📞 Customer Support

**Contact Information:**
- 📱 Phone: +229 0143515312
- 💬 WhatsApp: +229 0143515312
- 📧 Email: kenycruz701@gmail.com

**Created by:** Keny Cruz

---

## 🔧 Configuration

### Change Admin Password
Edit `server/server.js` or set environment variable:
```
ADMIN_PASSWORD=your_new_password
```

### Change Payment Number
Update in `js/main.js` and `server/server.js`:
- Search for `+229 0143515312`
- Replace with your number
- Update in all payment method sections

### Email Configuration
Set environment variables:
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

---

## 📊 Order Information

### Captured Data
- Customer name (first & last)
- Email address
- Phone number
- Full delivery address (street, city, postal, country)
- Order items (name, quantity, price)
- Total amount (items + shipping)
- Payment method used
- Order date & time

### Not Captured
- Credit card details (Stripe handles)
- Passwords or sensitive data
- Unnecessary personal information

---

## 🚀 New Features Summary

### Mobile Money Integration
- Wave Money support
- Orange Money support
- MTN Mobile Money support
- Automated payment instructions
- Screenshot verification process

### Admin Dashboard
- Real-time order viewing
- Status filtering (4 statuses)
- Complete customer information
- Order tracking
- Admin authentication

### Email Automation
- Automatic customer confirmation
- Admin order notifications
- Payment method specific instructions
- HTML formatted emails
- Multi-recipient support

---

## ⚙️ Technical Details

### API Endpoints

**Admin:**
- POST /api/admin/login
- GET /api/orders
- GET /api/order/:id
- PUT /api/order/:id/status

**Payments:**
- POST /api/process-wave
- POST /api/process-orange
- POST /api/process-mtn
- POST /api/process-bank-transfer
- POST /api/create-payment-intent (Stripe)

**Utility:**
- POST /api/send-order-email
- GET /api/health
- GET /api/stripe-key

### Data Storage
- Orders: In-memory (upgrade to database for production)
- Cart: Browser localStorage
- Configuration: Environment variables

---

## 🎓 Training

### For Admin Staff
1. Click lock icon to access admin panel
2. Enter password when prompted
3. Review pending orders
4. Verify payment screenshots
5. Update order status to "Completed"
6. Monitor completed orders for fulfillment

### For Customers
1. Browse menu items by category
2. View details for each dish
3. Add items to cart
4. Proceed to checkout
5. Fill delivery information
6. Choose payment method
7. Follow payment instructions
8. Receive confirmation email
9. Wait for order fulfillment

---

## 🐛 Troubleshooting

### Admin Login Issues
**Problem:** Password not working  
**Solution:** Check password is `admin2024`, verify environment variable if changed

**Problem:** Can't see orders  
**Solution:** Check if orders have been placed, server is running on port 3000

### Payment Issues
**Problem:** Mobile money details not showing  
**Solution:** Ensure payment method radio button is properly selected, refresh page

**Problem:** Email not received  
**Solution:** Check spam folder, verify EMAIL_USER and EMAIL_PASSWORD configuration

**Problem:** Order not showing in admin  
**Solution:** Refresh admin panel, ensure server is receiving POST requests from frontend

---

## 📋 Checklist

### For First-Time Setup
- [ ] Run server: `npm install && node server.js`
- [ ] Visit website: http://localhost:3000
- [ ] Test menu browsing
- [ ] Add items to cart
- [ ] Go to checkout
- [ ] Select payment method
- [ ] Verify mobile money form displays
- [ ] Log in as admin (password: admin2024)
- [ ] Check if test orders appear
- [ ] Verify email configuration

### For Production Deployment
- [ ] Set environment variables
- [ ] Configure email credentials
- [ ] Test Stripe integration
- [ ] Set secure admin password
- [ ] Configure SSL/HTTPS
- [ ] Set up database for orders
- [ ] Test all payment methods
- [ ] Verify email sending
- [ ] Test admin panel
- [ ] Set up automated backups

---

## 📚 Additional Resources

### Documentation Files
- `README.md` - Complete feature documentation
- `SETUP_GUIDE.md` - Installation and configuration
- `QUICK_START.md` - 5-minute quick start
- `PROJECT_SUMMARY.md` - Project overview
- `FILE_INDEX.md` - File reference guide
- `PHASE2_COMPLETION_SUMMARY.md` - Phase 2 details

### Support
For questions or issues:
- Email: kenycruz701@gmail.com
- Phone: +229 0143515312
- WhatsApp: +229 0143515312

---

**Last Updated:** 2024  
**Created by:** Keny Cruz  
**Version:** 2.0 (Phase 2 Complete)
