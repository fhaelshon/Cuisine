# Email & Order Management System Setup Guide

**Created**: January 31, 2026
**Project**: Africa Cuisine Restaurant Ordering System
**Author**: Keny Cruz
**Email**: kenycruz701@gmail.com

---

## Current System Status

✅ **Order Management System**: FULLY OPERATIONAL
- Orders automatically saved when placed (all payment methods)
- Admin dashboard to view and manage all orders
- Order status tracking (pending, completed, cancelled)

✅ **Email Notification System**: CONFIGURED & READY
- Emails sent to both customer and admin automatically
- Beautiful HTML email templates with order details
- Payment method-specific information included

⚠️ **Gmail Configuration**: REQUIRES YOUR ACTION
- `.env` file created with placeholder values
- You must add your Gmail App Password

---

## Step 1: Set Up Gmail App Password

### Why App Password?
Gmail blocks third-party apps from using your regular password for security reasons. You need to create an "App Password" instead.

### Steps:

1. **Go to Google Account Security**
   - Visit: https://myaccount.google.com/security

2. **Enable 2-Factor Authentication (if not already enabled)**
   - This is required before creating app passwords
   - Click "2-Step Verification" and follow the prompts

3. **Create App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" from the dropdown
   - Select "Windows Computer" (or your device type)
   - Click "Generate"
   - Google will show you a 16-character password (e.g., `abcd efgh ijkl mnop`)

4. **Copy the App Password**
   - Copy the 16 characters (WITHOUT the spaces)
   - Example: `abcdefghijklmnop`

---

## Step 2: Update the .env File

The `.env` file is located at: `server/.env`

Open it and update this line:

```
EMAIL_PASSWORD=your_app_password_here
```

Replace `your_app_password_here` with your 16-character Google App Password (no spaces).

**Example**:
```
EMAIL_PASSWORD=abcdefghijklmnop
```

**IMPORTANT**: 
- Do NOT share this password with anyone
- Do NOT commit it to GitHub
- It's already in `.gitignore` for protection

---

## Step 3: Verify Other Environment Variables

Check that these values in `.env` are correct:

```
EMAIL_USER=kenycruz701@gmail.com
OWNER_EMAIL=kenycruz701@gmail.com
ADMIN_PASSWORD=admin2024
```

All emails will be sent from `kenycruz701@gmail.com` and administrative notifications will also go to this address.

---

## How It Works

### Order Flow:

1. **Customer Places Order**
   - Fills out checkout form with details
   - Selects payment method (Stripe, Bank, Wave, Orange, MTN)
   - Submits form

2. **Order Saved to System**
   - Backend automatically saves order to memory (in production, use a database)
   - Assigned unique Order ID (format: `ACN` + timestamp)
   - Status: `pending` by default

3. **Confirmation Emails Sent**
   - **To Customer**: Order confirmation with details, delivery address, payment info
   - **To Admin** (kenycruz701@gmail.com): 
     - Full order details
     - Customer phone number
     - Customer IP address
     - Timestamp

4. **Admin Manages Order**
   - Log in to admin dashboard (password: `admin2024`)
   - View all orders with status
   - Update status: pending → completed → cancelled
   - Track delivery information

---

## Email Details

### Customer Receives:
- ✅ Order number and confirmation
- ✅ Itemized list with prices
- ✅ Delivery address confirmation
- ✅ Payment method details
- ✅ Contact information for support
- ✅ WhatsApp and phone numbers for quick contact

### Admin (You) Receives:
- ✅ All customer order details
- ✅ Customer contact phone
- ✅ Customer IP address
- ✅ Exact timestamp of order

### Email Format:
- Beautiful HTML with Africa Cuisine branding
- Gradient header with red (#e74c3c) and orange (#f39c12)
- Professional layout with clear sections
- Mobile-responsive design

---

## Testing the System

### 1. Start the Server

```bash
cd server
npm install  # Only needed once
npm start
```

You should see:
```
✓ Server running on http://localhost:3000
✓ Email transporter configured
```

### 2. Place a Test Order

1. Open the website: http://localhost:3000
2. Add items to cart
3. Click "Passer la Commande" (Go to Checkout)
4. Fill in details:
   - Name: Test Name
   - Email: **your-email@gmail.com** (use YOUR email to receive test)
   - Phone: +229 0143515312
   - Address: Test Address
   - City: Test City
5. Select payment method
6. Submit order

### 3. Verify Emails Received

You should receive 2 emails:

**Email 1**: Confirmation to your test email
- Subject: `✓ Commande Confirmée - Africa Cuisine`
- Contains: Order details, items, delivery address

**Email 2**: Admin notification to kenycruz701@gmail.com
- Subject: `Nouvelle Commande Reçue - Africa Cuisine`
- Contains: Same order details + Admin info box with phone/IP/timestamp

### 4. Check Admin Dashboard

1. Click the lock icon in top-right corner
2. Enter password: `admin2024`
3. You should see your test order in the list
4. Try changing status: pending → completed → cancelled

---

## Troubleshooting

### Problem: Emails not sending

**Check 1: Gmail App Password**
- Verify you entered the correct 16-character password (no spaces)
- Verify 2-Step Verification is enabled on your Google Account
- Try regenerating a new App Password

**Check 2: .env File**
- Make sure `.env` file exists in `server/` folder
- Make sure EMAIL_PASSWORD is not empty
- Make sure there are no extra spaces

**Check 3: Node.js Version**
- Verify Node.js version >= 14.0.0
- Run: `node --version`

**Check 4: Dependencies**
- Verify `nodemailer` is installed
- Run: `npm list nodemailer`
- If missing, run: `npm install`

### Problem: Server won't start

**Check 1: Port 3000 already in use**
```bash
# Change port in .env
PORT=3001
```

**Check 2: Missing dependencies**
```bash
cd server
npm install
```

### Problem: Admin Dashboard won't load

**Check 1: Clear browser cache**
- Press `Ctrl+Shift+Delete` (or Cmd+Shift+Delete on Mac)
- Clear cached files

**Check 2: Wrong password**
- Default password: `admin2024`
- Can be changed in `.env` file: `ADMIN_PASSWORD=newpassword`

---

## Order Storage

Currently, orders are stored in **memory** (RAM). This means:

✅ **Works for testing** - see orders in admin dashboard
✅ **Orders visible during session** - while server is running

⚠️ **Orders lost on restart** - when you restart the server, orders clear

### For Production Database:

To keep orders permanently, upgrade to MongoDB or another database:

1. Install MongoDB
2. Update `server/server.js` to use MongoDB instead of `let orders = []`
3. Uncomment DATABASE_URL in `.env`
4. Add connection code

Current implementation provides examples for migrating to a database.

---

## API Endpoints

### Order Submission (Automatic)

All payment methods trigger one of these endpoints:

| Payment Method | Endpoint | Status |
|---|---|---|
| Bank Transfer | `POST /api/process-bank-transfer` | pending |
| Wave | `POST /api/process-wave` | pending |
| Orange Money | `POST /api/process-orange` | pending |
| MTN Money | `POST /api/process-mtn` | pending |
| Stripe | Direct to Stripe API | pending |

### Email Sending (Automatic)

- **Endpoint**: `POST /api/send-order-email`
- **Triggered**: After order payment is confirmed
- **Recipients**: Customer email + kenycruz701@gmail.com
- **Automatic**: No manual action needed

### Admin Management

| Action | Endpoint | Method |
|---|---|---|
| View all orders | `GET /api/orders` | GET |
| View specific order | `GET /api/order/:id` | GET |
| Update order status | `PUT /api/order/:id/status` | PUT |
| Admin login | `POST /api/admin/login` | POST |

---

## Important Notes

### Security:
- ✅ Email password stored in `.env` (not in code)
- ✅ `.env` file in `.gitignore` (won't be committed to Git)
- ✅ Admin password can be changed in `.env`
- ⚠️ Don't share your `.env` file with anyone

### Email Limits:
- Gmail allows ~100 emails/hour for testing
- Production: Consider upgrading to SendGrid, AWS SES, or similar

### Order Limit:
- Current: Stores orders in RAM (limited by available memory)
- Test limit: ~1000 orders before potential slowdown
- Production: Migrate to database

---

## Next Steps

1. ✅ Create `.env` file (DONE)
2. ⏳ **Add your Gmail App Password to `.env`** (YOU DO THIS)
3. ⏳ Start the server: `npm start`
4. ⏳ Test with a sample order
5. ⏳ Verify emails arrive in your inbox
6. ⏳ Check admin dashboard shows the order

---

## Quick Reference

**File Locations:**
- Website: `index.html`
- Styles: `css/styles.css`
- Frontend Logic: `js/main.js`
- Backend Server: `server/server.js`
- Configuration: `server/.env`
- Menu Data: `js/menu-data.js`

**Important URLs:**
- Gmail App Passwords: https://myaccount.google.com/apppasswords
- Admin Dashboard: Click lock icon in top-right → password: `admin2024`
- Server: http://localhost:3000

**Key Credentials:**
- Email: kenycruz701@gmail.com
- Phone: +229 0143515312
- WhatsApp: +229 0143515312
- Admin Password: admin2024

---

## Support

If you need help:
1. Check the troubleshooting section above
2. Verify your Gmail App Password is correct
3. Check server logs for error messages
4. Ensure all dependencies are installed: `npm install`

**System is ready to use!** 🚀

Once you add your Gmail App Password, orders will automatically:
- ✅ Appear in the order management system
- ✅ Send confirmation emails to customers
- ✅ Send notifications to kenycruz701@gmail.com

---

**Document Version**: 1.0
**Last Updated**: January 31, 2026
**Created by**: Keny Cruz
**Email**: kenycruz701@gmail.com
**Phone**: +229 0143515312
