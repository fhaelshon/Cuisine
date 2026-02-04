# 🚀 Quick Start Guide - Africa Cuisine

**5-Minute Setup for Africa Cuisine Restaurant Website**

---

## ⚡ Quick Steps

### 1. Install Node.js
Download from: https://nodejs.org (LTS version)

### 2. Navigate to Project
```bash
cd c:\Users\User\Desktop\cruz
cd server
```

### 3. Install Packages
```bash
npm install
```

### 4. Create & Configure .env
```bash
# Copy template
copy .env.example .env

# Edit .env with your Stripe test keys from https://stripe.com
STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
EMAIL_USER=kenycruz701@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 5. Start Server
```bash
npm start
```

### 6. Open Browser
```
http://localhost:3000
```

---

## 🧪 Test It

### Add Items to Cart
1. Scroll menu and click "Détails" on any dish
2. Adjust quantity
3. Click "Ajouter au panier"

### Place Order
1. Click shopping cart icon (top right)
2. Click "Passer la Commande"
3. Fill in details:
   - Name: John Doe
   - Email: your_email@gmail.com
   - Phone: +229 1234567890
   - Address: Test St
   - City: Test City
   - Postal: 12345

### Pay with Test Card
1. Select "Carte Bancaire (Stripe)"
2. Enter card: **4242 4242 4242 4242**
3. Expiry: **12/25**
4. CVC: **123**
5. Click "Confirmer le Paiement"

### Or Use Bank Transfer
1. Select "Virement Bancaire Direct"
2. See bank details on form
3. Click "Confirmer le Paiement"
4. Check email for confirmation

---

## 🛠️ Troubleshooting

### Server won't start?
```bash
# Make sure you're in the right directory
cd server
npm install
npm start
```

### Port 3000 already in use?
Change in .env:
```env
PORT=3001
```

### Can't see website?
1. Check terminal shows "Server running..."
2. Try: http://localhost:3000
3. Check browser console (F12) for errors

### Stripe not working?
1. Check .env has correct keys (pk_test_...)
2. Verify Stripe keys from https://stripe.com/docs/keys

---

## 📧 Email Setup (Optional)

For real email notifications:

1. Use Gmail app password: https://myaccount.google.com/apppasswords
2. Update .env:
```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```
3. Restart server

---

## 📱 Menu Items Available

- **Appetizers**: 11 items
- **Mains**: 18 items  
- **Desserts**: 5 items
- **Beverages**: 4 items
- **Sauces**: 2 items
- **Breads**: 3 items

**Total**: 43 authentic African dishes!

---

## 🎨 Try These Features

✨ **Animations**
- Smooth page scrolling
- Card hover effects
- Button animations
- Modal pop-ups

📦 **Cart Functions**
- Add/remove items
- Change quantities
- Save to browser storage
- See running total

💳 **Payment Options**
- Stripe card payment
- Bank transfer
- Email confirmation

📱 **Responsive Design**
- Open on phone
- Tablet friendly
- Mobile menu

---

## 📞 Contact Info

**Creator & Designer: Keny Cruz**

- Email: kenycruz701@gmail.com
- Phone: +229 0143515312
- WhatsApp: +229 0143515312

---

## 📚 Full Documentation

- **README.md** - Complete documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **server/.env.example** - All environment variables explained

---

## 🎯 Next Steps

1. ✅ Get Stripe test keys: https://stripe.com
2. ✅ Add keys to .env file
3. ✅ Start server: `npm start`
4. ✅ Test with menu items
5. ✅ Process a test payment
6. ✅ Check confirmation email

---

## 🚀 Deployment Ready

When ready for production:
1. Get Stripe **production keys** (pk_live_, sk_live_)
2. Deploy to Heroku/AWS/Google Cloud
3. Update environment variables
4. Enable HTTPS

---

**Enjoy your Africa Cuisine website! 🍽️🌍**

*Made with ❤️ by Keny Cruz*
