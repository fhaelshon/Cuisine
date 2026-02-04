# Africa Cuisine Phase 2 - Testing & Deployment Guide

## 🧪 Testing Procedures

### Setup Testing Environment
```bash
cd c:\Users\User\Desktop\cruz\server
npm install
node server.js
```

Expected output:
```
============================================
Africa Cuisine Server
============================================
Server running on port 3000

Created by: Keny Cruz
Email: kenycruz701@gmail.com
Phone: +229 0143515312
WhatsApp: +229 0143515312

http://localhost:3000
============================================
```

Open browser to: `http://localhost:3000`

---

## 📝 Test Case 1: Mobile Money Payment Flow

### Steps:
1. **Browse Menu**
   - [ ] Click "Accueil" to view all menu items (43 items should display)
   - [ ] Click on a menu item to see details

2. **Add to Cart**
   - [ ] Click "Détails" on any item
   - [ ] Verify modal opens with full details
   - [ ] Change quantity to 2
   - [ ] Click "Ajouter au Panier"
   - [ ] Verify notification shows "Article ajouté au panier!"
   - [ ] Check cart count in navbar increased

3. **Checkout**
   - [ ] Click cart icon to open cart
   - [ ] Click "Passer la Commande" (Checkout)
   - [ ] Fill in form:
     - First Name: "Jean"
     - Last Name: "Dupont"
     - Email: "jean@example.com"
     - Phone: "+229 0143515312"
     - Address: "123 Rue Paris"
     - City: "Cotonou"
     - Postal: "00229"
     - Country: "Benin"

4. **Test Wave Mobile Money**
   - [ ] Select "📱 Wave Money" radio button
   - [ ] Verify mobile-money-details section appears
   - [ ] Check it shows:
     - Wave Money header with icon
     - Payment number: +229 0143515312
     - Instructions for payment
     - Steps to confirm
   - [ ] Click "Confirmer le Paiement"
   - [ ] Verify success page appears
   - [ ] Check order number is generated (ACN format)
   - [ ] Close modal

5. **Verify Email**
   - [ ] Check email (jean@example.com) received confirmation
   - [ ] Verify email contains:
     - Order details
     - Customer info
     - Wave Money instructions
     - Contact information

### Expected Results:
✅ Mobile money form displays correctly  
✅ Payment is processed successfully  
✅ Success page shows with order details  
✅ Email sent to customer  
✅ Email sent to admin  

---

## 🔒 Test Case 2: Admin Panel Access & Orders

### Steps:
1. **Login as Admin**
   - [ ] Click 🔒 lock icon in navbar
   - [ ] Verify admin modal appears
   - [ ] Type wrong password "wrong123"
   - [ ] Click "Se Connecter"
   - [ ] Verify error notification appears
   - [ ] Clear and type correct password "admin2024"
   - [ ] Click "Se Connecter"
   - [ ] Verify admin panel displays

2. **View All Orders**
   - [ ] Verify "Toutes" button is active
   - [ ] Check orders list shows all orders
   - [ ] Verify each order displays:
     - Order ID (ACN format)
     - Status badge
     - Customer name
     - Contact info
     - Delivery address
     - Items with prices
     - Total amount
     - Payment method icon

3. **Filter Orders by Status**
   - [ ] Click "En Attente" (Pending)
   - [ ] Verify only pending orders display
   - [ ] Click "Complétées" (Completed)
   - [ ] Verify no orders show (none completed yet)
   - [ ] Click "Annulées" (Cancelled)
   - [ ] Verify no cancelled orders show
   - [ ] Click "Toutes" (All)
   - [ ] Verify all orders display again

4. **Logout**
   - [ ] Click "Déconnexion" button
   - [ ] Verify admin panel closes
   - [ ] Verify login form reappears

### Expected Results:
✅ Admin login works with correct password  
✅ Wrong password rejected with error  
✅ Orders display with complete information  
✅ Filter buttons work for each status  
✅ Logout properly closes admin panel  

---

## 💳 Test Case 3: All Payment Methods

### Test Bank Transfer:
1. [ ] Select "🏦 Virement Bancaire"
2. [ ] Verify bank details section appears
3. [ ] Complete checkout
4. [ ] Verify success page mentions bank transfer
5. [ ] Check order saved with payment method "bank"

### Test Orange Money:
1. [ ] Select "🟠 Orange Money"
2. [ ] Verify mobile money section appears with Orange branding
3. [ ] Complete checkout
4. [ ] Verify email sent with Orange Money instructions

### Test MTN Money:
1. [ ] Select "🟡 MTN Mobile Money"
2. [ ] Verify mobile money section appears with MTN branding
3. [ ] Complete checkout
4. [ ] Verify email sent with MTN instructions

### Test Stripe Card:
1. [ ] Select "💳 Carte Bancaire"
2. [ ] Verify card element appears (or payment form)
3. [ ] Complete checkout
4. [ ] Verify success page mentions card payment

---

## 📧 Test Case 4: Email System

### Verify Customer Email:
1. [ ] Place order via any payment method
2. [ ] Check customer email (used in form)
3. [ ] Verify email contains:
   - [ ] HTML formatted template
   - [ ] Order number
   - [ ] Customer name and details
   - [ ] All items ordered with prices
   - [ ] Delivery address
   - [ ] Payment method instructions
   - [ ] Keny Cruz contact information
   - [ ] Company footer with copyright

### Verify Admin Email:
1. [ ] Check admin email (kenycruz701@gmail.com)
2. [ ] Verify admin email contains:
   - [ ] All customer information
   - [ ] Order details
   - [ ] Payment method used
   - [ ] Customer phone number
   - [ ] Timestamp of order

---

## 🔄 Test Case 5: Complete Order Flow

### Full Flow Test:
1. [ ] Clear all cookies/localStorage (fresh session)
2. [ ] Browse multiple menu items
3. [ ] Filter by different categories (Appetizers, Mains, etc.)
4. [ ] Add 3-4 different items to cart
5. [ ] Verify cart count increases
6. [ ] Open cart and verify all items show
7. [ ] Go to checkout
8. [ ] Fill all form fields correctly
9. [ ] Select mobile money payment method
10. [ ] Verify mobile money form displays
11. [ ] Submit order
12. [ ] Verify success page shows
13. [ ] Verify email received
14. [ ] Login as admin
15. [ ] Verify new order appears in admin
16. [ ] Verify order shows correct:
    - [ ] Customer name and email
    - [ ] Phone number
    - [ ] Delivery address
    - [ ] All items and prices
    - [ ] Payment method (mobile money icon)
    - [ ] Status (pending)
17. [ ] Filter orders and verify filtering works
18. [ ] Logout from admin

### Expected Results:
✅ Complete flow executes without errors  
✅ Cart persists across page refreshes  
✅ Form validation works (all required fields)  
✅ Email sends to both customer and admin  
✅ Order appears in admin panel immediately  
✅ Order has all correct details  

---

## 🔍 Test Case 6: Responsive Design

### Test on Different Devices:

**Mobile (375px width):**
1. [ ] Admin button visible in navbar
2. [ ] Mobile money form displays correctly
3. [ ] Admin modal responsive
4. [ ] Order list readable on small screen
5. [ ] All buttons clickable without overlapping
6. [ ] Form fields properly sized

**Tablet (768px width):**
1. [ ] Layout looks proportional
2. [ ] Menu grid shows 2 items per row
3. [ ] Admin panel filters show in column
4. [ ] Text readable without zoom

**Desktop (1200px+ width):**
1. [ ] Menu grid shows 3-4 items per row
2. [ ] Admin filters in single row
3. [ ] All elements properly spaced
4. [ ] Smooth animations work

---

## 🐛 Error Testing

### Test Error Handling:

**Network Errors:**
1. [ ] Stop server
2. [ ] Try to place order
3. [ ] Verify error message shows (not crash)
4. [ ] Start server again
5. [ ] Retry order (should work)

**Invalid Admin Password:**
1. [ ] Try empty password → error
2. [ ] Try spaces "   " → error
3. [ ] Try wrong password → error
4. [ ] Try correct password → success

**Form Validation:**
1. [ ] Try submit checkout with empty fields → error
2. [ ] Try invalid email format → error
3. [ ] Enter all valid fields → success

**Email Errors:**
1. [ ] If email fails to send → order still completes
2. [ ] Check console for error message
3. [ ] Order saves in admin regardless

---

## 📊 Performance Testing

### Load Testing:
1. [ ] Place 10 orders quickly
2. [ ] Verify all orders appear in admin
3. [ ] Check admin panel still responsive
4. [ ] Filter orders still works smoothly
5. [ ] No memory leaks or crashes

### Speed Testing:
1. [ ] Admin login: < 1 second
2. [ ] Admin page load: < 2 seconds
3. [ ] Order placement: < 5 seconds
4. [ ] Email sending: < 30 seconds

---

## 🚀 Pre-Deployment Checklist

### Code Quality:
- [ ] No console errors
- [ ] No console warnings
- [ ] All functions working
- [ ] No broken links
- [ ] Mobile responsive
- [ ] Animations smooth

### Features:
- [ ] All payment methods work
- [ ] Admin panel functional
- [ ] Orders save correctly
- [ ] Emails send properly
- [ ] Mobile money forms display
- [ ] Filtering works

### Browser Compatibility:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

### Security:
- [ ] Admin password set
- [ ] No hardcoded secrets
- [ ] CORS configured
- [ ] Input validation works
- [ ] Error messages safe

### Documentation:
- [ ] README.md updated
- [ ] SETUP_GUIDE.md current
- [ ] QUICK_START.md works
- [ ] Phase 2 docs complete
- [ ] Code comments present

---

## 🌐 Deployment Steps

### Step 1: Prepare Server
```bash
cd /path/to/cruz/server
npm install
```

### Step 2: Set Environment Variables
Create `.env` file:
```
PORT=3000
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
ADMIN_PASSWORD=admin2024
```

### Step 3: Start Server
```bash
node server.js
```

### Step 4: Test in Browser
Open: `http://localhost:3000`

### Step 5: Test All Features
- [ ] Menu displays
- [ ] Cart works
- [ ] All payment methods available
- [ ] Mobile money forms show
- [ ] Admin login works
- [ ] Orders appear in admin
- [ ] Emails send

### Step 6: Production Deploy
```bash
npm install -g pm2
pm2 start server.js --name "africa-cuisine"
pm2 save
pm2 startup
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Server won't start:**
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000
# Kill process and restart
node server.js
```

**Emails not sending:**
- Check EMAIL_USER and EMAIL_PASSWORD
- Verify Gmail app password (not regular password)
- Check email service is enabled in .env

**Orders not appearing in admin:**
- Check server is running
- Reload admin panel
- Check browser console for errors
- Verify orders saved in server memory

**Mobile money form not showing:**
- Ensure radio button is properly selected
- Check browser console
- Reload page and try again
- Clear browser cache

---

## ✅ Final Verification

Before going live:

1. **Functionality**
   - [ ] All features work as documented
   - [ ] No broken functionality
   - [ ] All endpoints respond

2. **Performance**
   - [ ] Page loads quickly (< 3 seconds)
   - [ ] No memory leaks
   - [ ] Smooth animations

3. **Security**
   - [ ] Passwords protected
   - [ ] No sensitive data exposed
   - [ ] Input validation active
   - [ ] CORS properly configured

4. **User Experience**
   - [ ] Clear instructions for payment
   - [ ] Responsive on all devices
   - [ ] Error messages helpful
   - [ ] Success confirmations clear

5. **Testing**
   - [ ] All test cases passed
   - [ ] No critical bugs
   - [ ] Documentation complete
   - [ ] Support procedures documented

---

## 🎉 Launch Checklist

- [ ] All features tested
- [ ] Documentation complete
- [ ] Server running stable
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Support team trained
- [ ] Launch announcement ready

**Ready to Deploy!** 🚀

---

**Created by:** Keny Cruz  
**Email:** kenycruz701@gmail.com  
**Phone:** +229 0143515312  
**Last Updated:** 2024
