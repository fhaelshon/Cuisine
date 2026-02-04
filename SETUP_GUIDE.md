# 🛠️ Africa Cuisine - Setup & Configuration Guide

**Creator: Keny Cruz**  
**Email: kenycruz701@gmail.com**  
**Phone: +229 0143515312**

---

## 📋 Table of Contents

1. [Initial Setup](#initial-setup)
2. [Stripe Configuration](#stripe-configuration)
3. [Email Configuration](#email-configuration)
4. [Running the Application](#running-the-application)
5. [Testing Payments](#testing-payments)
6. [Deployment Guide](#deployment-guide)

---

## 🚀 Initial Setup

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org)
- **npm** (comes with Node.js)
- **Git** (optional) - [Download](https://git-scm.com)
- **Browser** (Chrome, Firefox, Safari, Edge)

### Step 1: Navigate to Project Directory

```bash
cd c:\Users\User\Desktop\cruz
```

### Step 2: Install Dependencies

```bash
cd server
npm install
```

This will install:
- express (web framework)
- stripe (payment processing)
- nodemailer (email sending)
- cors (cross-origin requests)
- dotenv (environment variables)
- body-parser (request parsing)

### Step 3: Create Environment File

```bash
# Copy the example file
cp .env.example .env

# Or on Windows:
copy .env.example .env
```

### Step 4: Configure Environment Variables

Edit the `.env` file with your information:

```env
# Server
PORT=3000
NODE_ENV=development

# Your Stripe Keys (get from stripe.com)
STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY

# Email Configuration
EMAIL_USER=kenycruz701@gmail.com
EMAIL_PASSWORD=your_app_password

# Restaurant Info
OWNER_EMAIL=kenycruz701@gmail.com
OWNER_PHONE=+229 0143515312
```

---

## 💳 Stripe Configuration

### 1. Create Stripe Account

1. Go to https://stripe.com
2. Click "Sign up"
3. Fill in your details
4. Verify your email
5. Complete identity verification

### 2. Get Your API Keys

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click "Developers" in the sidebar
3. Click "API Keys"
4. You'll see:
   - **Publishable Key**: `pk_test_...`
   - **Secret Key**: `sk_test_...`

### 3. Add Keys to .env

```env
STRIPE_PUBLIC_KEY=pk_test_52g8...
STRIPE_SECRET_KEY=sk_test_9f2k...
```

### 4. Get Webhook Secret (Optional)

For production webhooks:

1. Click "Webhooks" in Developers menu
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/webhook`
4. Events: Select payment_intent events
5. Copy the signing secret
6. Add to .env: `STRIPE_WEBHOOK_SECRET=whsec_...`

### 5. Test with Stripe Test Cards

Stripe provides test cards for development:

| Card Number | Exp Date | CVC | Result |
|-------------|----------|-----|--------|
| 4242 4242 4242 4242 | 12/25 | 123 | Success |
| 4000 0000 0000 0002 | 12/25 | 123 | Decline |
| 4000 0025 0000 3155 | 12/25 | 123 | Require Auth |

---

## 📧 Email Configuration

### Option 1: Gmail (Recommended)

#### Step 1: Enable 2-Factor Authentication

1. Go to [Google Account](https://myaccount.google.com)
2. Click "Security" in the sidebar
3. Scroll down to "2-Step Verification"
4. Follow the setup process

#### Step 2: Create App Password

1. Go to [Google Account Security](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer"
3. Google generates a 16-character password
4. Copy it (it has spaces, that's normal)

#### Step 3: Configure .env

```env
EMAIL_USER=kenycruz701@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

#### Step 4: Test Email

1. Start the server
2. Place a test order
3. Check both customer and admin emails
4. Verify HTML formatting

### Option 2: SendGrid

1. Sign up at [SendGrid](https://sendgrid.com)
2. Create API key
3. Install `@sendgrid/mail`: `npm install @sendgrid/mail`
4. Update server.js to use SendGrid instead

### Option 3: Mailgun

1. Sign up at [Mailgun](https://www.mailgun.com)
2. Get your domain and API key
3. Install nodemailer Mailgun transport
4. Configure in server.js

---

## ▶️ Running the Application

### Development Mode

```bash
cd server
npm run dev
```

This uses Nodemon for auto-reload on file changes.

### Production Mode

```bash
cd server
npm start
```

### Access the Application

Open your browser:
```
http://localhost:3000
```

---

## 🧪 Testing Payments

### Test Stripe Payment

1. Open http://localhost:3000
2. Browse menu and add items to cart
3. Click shopping cart icon
4. Click "Passer la Commande"
5. Select "Carte Bancaire (Stripe)"
6. Fill in customer details:
   - First Name: John
   - Last Name: Doe
   - Email: test@example.com
   - Phone: +229 1234567890
   - Address: Test Street
   - City: Test City
   - Postal: 12345
   - Country: Benin

7. Enter test card: 4242 4242 4242 4242
8. Expiry: 12/25
9. CVC: 123
10. Click "Confirmer le Paiement"
11. See success confirmation
12. Check email for order confirmation

### Test Bank Transfer

1. Repeat steps 1-6 above
2. Select "Virement Bancaire Direct"
3. View bank details in form
4. Fill customer info
5. Click "Confirmer le Paiement"
6. See success with bank details
7. Check email for instructions

### Test Cart Functionality

- Add multiple items
- Increase/decrease quantities
- Remove items
- Verify local storage persistence
- Close browser and reopen
- Cart should still have items

---

## 🌐 Deployment Guide

### Deploy to Heroku

#### 1. Create Heroku Account

- Go to https://www.heroku.com
- Sign up for free account

#### 2. Install Heroku CLI

```bash
# Download from: https://devcenter.heroku.com/articles/heroku-cli
# Then login:
heroku login
```

#### 3. Create Heroku App

```bash
cd c:\Users\User\Desktop\cruz
heroku create your-app-name
```

#### 4. Set Environment Variables

```bash
heroku config:set STRIPE_PUBLIC_KEY=pk_test_...
heroku config:set STRIPE_SECRET_KEY=sk_test_...
heroku config:set EMAIL_USER=kenycruz701@gmail.com
heroku config:set EMAIL_PASSWORD=your_app_password
```

#### 5. Deploy

```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

#### 6. View Logs

```bash
heroku logs --tail
```

### Deploy to Other Platforms

#### Netlify (Frontend Only)

1. Build frontend files
2. Drag and drop to netlify.com
3. Configure backend URL in .env

#### AWS/Azure/Google Cloud

1. Install CLI tools
2. Create compute instance
3. Upload project files
4. Run npm install && npm start
5. Configure domain and SSL

### Update Production Variables

```bash
# Stripe (Use production keys, not test keys)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_password

# Domain
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Use production Stripe keys (pk_live_, sk_live_)
- [ ] Enable HTTPS/SSL certificate
- [ ] Set secure environment variables
- [ ] Enable CORS for specific domains
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Add request logging
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test payment flow
- [ ] Test email notifications
- [ ] Review error messages (don't expose secrets)

---

## 🐛 Common Issues & Solutions

### Issue: Stripe Key Not Found

**Error**: `Stripe key not found` or undefined

**Solution**:
1. Check .env file exists
2. Verify spelling: `STRIPE_PUBLIC_KEY`
3. Restart server after changing .env
4. Check keys are correct from Stripe dashboard

### Issue: Emails Not Sending

**Error**: `Email failed to send`

**Solution**:
1. Verify Gmail 2FA is enabled
2. Check app password is 16 characters
3. Remove spaces from password
4. Test SMTP with: `telnet smtp.gmail.com 587`
5. Check firewall/antivirus isn't blocking

### Issue: Payment Not Processing

**Error**: `Payment intent error`

**Solution**:
1. Check Stripe keys are test keys (pk_test_)
2. Verify card number (use 4242...)
3. Check internet connection
4. Look at Stripe dashboard for errors
5. Check browser console for JavaScript errors

### Issue: CORS Error

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
1. Check CORS is enabled in server.js
2. Verify frontend and backend URLs match
3. Check browser console for exact error
4. Add `Access-Control-Allow-Origin: *` for testing

### Issue: Server Won't Start

**Error**: `Port already in use` or other startup error

**Solution**:
```bash
# Check what's using the port
netstat -ano | findstr :3000

# Or change port in .env
PORT=3001

# Restart server
npm start
```

---

## 📞 Support

For issues or questions:

**Keny Cruz**
- Email: kenycruz701@gmail.com
- Phone: +229 0143515312
- WhatsApp: +229 0143515312

---

## ✅ Checklist for First Run

- [ ] Node.js installed and working
- [ ] Project files in correct location
- [ ] Dependencies installed (`npm install` run)
- [ ] .env file created and configured
- [ ] Stripe keys added to .env
- [ ] Email configured in .env
- [ ] Server starts without errors (`npm start`)
- [ ] Can access http://localhost:3000
- [ ] Menu displays correctly
- [ ] Can add items to cart
- [ ] Cart persists after page reload
- [ ] Can proceed to checkout
- [ ] Can complete order with test data
- [ ] Confirmation emails received

---

**Happy ordering! 🍽️ Created with ❤️ by Keny Cruz**
