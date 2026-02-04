# 📑 Africa Cuisine - File Index & Quick Reference

**Creator: Keny Cruz**  
**Email: kenycruz701@gmail.com**  
**Phone: +229 0143515312**

---

## 📂 File Directory

### Root Directory (`c:\Users\User\Desktop\cruz\`)

| File | Type | Purpose | Size |
|------|------|---------|------|
| `index.html` | HTML | Main website file - 43 menu items, responsive, animations | 500+ lines |
| `README.md` | Markdown | Complete documentation and feature guide | 3000+ words |
| `SETUP_GUIDE.md` | Markdown | Detailed setup and configuration instructions | 2000+ words |
| `QUICK_START.md` | Markdown | 5-minute quick start guide | 500+ words |
| `PROJECT_SUMMARY.md` | Markdown | Overview of entire project | 2000+ words |
| `FILE_INDEX.md` | Markdown | This file - quick reference | |

### CSS Directory (`css/`)

| File | Purpose | Features |
|------|---------|----------|
| `styles.css` | All styling and animations | 800+ lines, 15+ animations, 4 responsive breakpoints |

### JavaScript Directory (`js/`)

| File | Purpose | Features |
|------|---------|----------|
| `main.js` | Frontend logic and interactions | Cart, checkout, Stripe integration, 400+ lines |
| `menu-data.js` | Menu database | 43 African dishes with all details |

### Images Directory (`images/`)

| File | Purpose |
|------|---------|
| (empty) | Placeholder for dish images |

### Server Directory (`server/`)

| File | Type | Purpose | Features |
|------|------|---------|----------|
| `server.js` | JavaScript | Express.js backend server | Stripe, email, payments, 300+ lines |
| `package.json` | JSON | Node.js dependencies | Express, Stripe, Nodemailer, Cors, etc. |
| `.env.example` | Config | Environment variable template | All configurable settings |

---

## 📖 Documentation Map

### For First-Time Users
→ Start with **QUICK_START.md** (5 minutes)

### For Detailed Setup
→ Follow **SETUP_GUIDE.md** (30 minutes)

### For Understanding Features
→ Read **README.md** (30-45 minutes)

### For Project Overview
→ See **PROJECT_SUMMARY.md** (15 minutes)

### For Using This Guide
→ See **FILE_INDEX.md** (This file)

---

## 🎯 What Each File Does

### `index.html`
**Main website file**
- Navigation bar with cart
- Hero section with CTA
- Menu grid with 43 items
- Filter buttons (6 categories)
- Item detail modals
- Shopping cart modal
- Checkout form
- About section
- Contact section
- Footer

**Key Elements**:
```
<nav> - Sticky navigation
<section id="home"> - Hero
<section id="menu"> - Menu display
<div id="menuModal"> - Item details
<div id="cartModal"> - Shopping cart
<section id="checkout"> - Checkout form
<section id="about"> - About us
<section id="contact"> - Contact form
<footer> - Footer
```

### `css/styles.css`
**Complete styling**
- 800+ lines of CSS
- 15+ keyframe animations
- CSS variables for theming
- Responsive design (4 breakpoints)
- Mobile-first approach
- Gradient backgrounds
- Shadow effects
- Hover states
- Active states
- Print styles

**Key Sections**:
- Global styles
- Animations & keyframes
- Navbar styling
- Hero section
- Menu & filtering
- Modals
- Cart display
- Checkout form
- About & contact
- Footer
- Responsive media queries

### `js/main.js`
**Frontend interactivity**
- Menu display and filtering
- Modal management
- Cart operations (add, remove, update)
- Checkout process
- Payment method handling
- Stripe integration setup
- Email form handling
- Local storage management
- Form validation
- Smooth scrolling

**Key Functions**:
- `displayMenu()` - Show all items
- `filterMenu(category)` - Filter by category
- `openMenuModal(id)` - Show item details
- `addToCart(id)` - Add to shopping cart
- `openCart()` - Display cart
- `goToCheckout()` - Start checkout
- `processStripePayment()` - Handle Stripe
- `processBankTransfer()` - Handle bank payment
- `completeOrder()` - Finish order

### `js/menu-data.js`
**Menu database**
- 43 African dishes
- Categorized (6 categories)
- Each item includes:
  - ID
  - Name (French)
  - Category
  - Price (in EUR)
  - Image URL
  - Short description
  - Long description
  - Ingredients list
  - Preparation time
  - Countries of origin

**Menu Items**: 43 total

### `server/server.js`
**Backend server**
- Express.js application
- Stripe payment processing
- Email notifications
- RESTful API endpoints
- CORS configuration
- Error handling
- Webhook support

**API Routes**:
- `GET /api/health` - Server status
- `GET /api/stripe-key` - Stripe public key
- `POST /api/create-payment-intent` - Create payment
- `POST /api/confirm-payment` - Confirm payment
- `POST /api/send-order-email` - Send confirmation
- `POST /api/process-bank-transfer` - Bank payment
- `POST /api/webhook` - Stripe webhooks

### `server/package.json`
**Node.js configuration**
- Project metadata
- Scripts (start, dev)
- Dependencies:
  - express
  - stripe
  - nodemailer
  - cors
  - body-parser
  - dotenv
- Dev dependencies:
  - nodemon

### `server/.env.example`
**Configuration template**
Copy to `.env` and fill in your values

**Sections**:
- Server configuration
- Stripe keys
- Email settings
- Restaurant info
- Database (optional)
- API settings
- Payment settings
- Security keys
- Social media

---

## 🔍 Quick Lookup

### "I want to change the menu"
→ Edit `js/menu-data.js`

### "I want to change colors"
→ Edit CSS variables in `css/styles.css` (top of file)

### "I want to add an animation"
→ Add keyframe in `css/styles.css` and use in `js/main.js`

### "I want to change the layout"
→ Modify `index.html` structure

### "I want to add more features"
→ Update `server/server.js` for backend
→ Update `js/main.js` for frontend

### "I want to configure Stripe"
→ Edit `server/.env` with your keys

### "I want to change contact info"
→ Search and replace "kenycruz701@gmail.com" in all files
→ Search and replace "+229 0143515312" in all files

### "I want to test locally"
→ Follow **QUICK_START.md**

### "I want to deploy to production"
→ Follow **SETUP_GUIDE.md** → Deployment section

---

## 📋 File Checklist

Before deploying, ensure all files exist:

- [ ] `index.html` - Main website
- [ ] `css/styles.css` - Styling
- [ ] `js/main.js` - Frontend logic
- [ ] `js/menu-data.js` - Menu items
- [ ] `server/server.js` - Backend
- [ ] `server/package.json` - Dependencies
- [ ] `server/.env.example` - Config template
- [ ] `README.md` - Documentation
- [ ] `SETUP_GUIDE.md` - Setup help
- [ ] `QUICK_START.md` - Quick reference
- [ ] `PROJECT_SUMMARY.md` - Project overview
- [ ] `FILE_INDEX.md` - This file

---

## 🚀 Getting Started Checklist

1. [ ] Download/clone project to: `c:\Users\User\Desktop\cruz\`
2. [ ] Check all files exist (see checklist above)
3. [ ] Open `QUICK_START.md` for 5-minute setup
4. [ ] Install Node.js from nodejs.org
5. [ ] Run `npm install` in server folder
6. [ ] Copy `.env.example` to `.env`
7. [ ] Get Stripe keys from stripe.com
8. [ ] Add keys to `.env`
9. [ ] Run `npm start`
10. [ ] Open `http://localhost:3000`

---

## 📊 Statistics

### Files
- **Total Files**: 12
- **Documentation**: 4 markdown files
- **Code Files**: 6 (HTML, CSS, 2x JS, 2x Server)
- **Config**: 2 (package.json, .env.example)

### Lines of Code
- **HTML**: 300+ lines
- **CSS**: 800+ lines
- **JavaScript (Frontend)**: 400+ lines
- **JavaScript (Backend)**: 300+ lines
- **Total**: 1800+ lines of code

### Features
- **Menu Items**: 43
- **Animations**: 15+
- **API Endpoints**: 7
- **Payment Methods**: 2
- **Categories**: 6
- **Responsive Breakpoints**: 4

---

## 🎨 Features by File

### `index.html` Contains
- Navigation menu
- Hero section
- Menu grid (43 items)
- Filter buttons (6)
- Modal for details
- Cart modal
- Checkout form
- About section
- Contact form
- Footer

### `css/styles.css` Contains
- Colors & variables
- 15+ animations
- Navbar styles
- Hero styling
- Menu grid layout
- Modal styling
- Cart styling
- Form styling
- Responsive design
- Mobile breakpoints

### `js/main.js` Contains
- Menu display logic
- Category filtering
- Modal management
- Cart operations
- Checkout flow
- Stripe setup
- Email handling
- Local storage
- Event listeners
- Animations

### `server/server.js` Contains
- Express app setup
- CORS configuration
- Route handlers
- Stripe integration
- Email configuration
- Payment processing
- Webhook handling
- Error handling
- API endpoints

---

## 💾 File Sizes (Approximate)

| File | Size |
|------|------|
| index.html | 15 KB |
| css/styles.css | 35 KB |
| js/main.js | 12 KB |
| js/menu-data.js | 20 KB |
| server/server.js | 10 KB |
| server/package.json | 2 KB |
| Documentation | 50 KB |
| **Total** | **~145 KB** |

---

## 🔐 Security Files

### `.env` (Create after copying .env.example)
- Stripe Secret Key - **KEEP SECRET**
- Email Password - **KEEP SECRET**
- Never commit to git
- Add to .gitignore

### `server/server.js`
- Validates inputs
- Doesn't expose secrets
- Uses environment variables
- Error handling

---

## 📝 Format Guide

### HTML
- Semantic tags
- Proper nesting
- Valid HTML5
- Accessible (ARIA labels)

### CSS
- Mobile-first
- CSS variables
- Organized sections
- Comments for sections

### JavaScript
- ES6+ syntax
- Modular functions
- Event-based architecture
- Error handling

### Markdown (Docs)
- Proper headers
- Bullet points
- Code blocks
- Tables for reference

---

## 🎓 Learning Resources

### To understand the code:
1. Start with `index.html` - See structure
2. Then `css/styles.css` - See styling
3. Then `js/main.js` - See interactivity
4. Then `server/server.js` - See backend

### To customize:
1. Read relevant section in README.md
2. Find relevant code in appropriate file
3. Make changes
4. Test in browser/server

### To troubleshoot:
1. Check QUICK_START.md for quick issues
2. Check SETUP_GUIDE.md for configuration
3. Check browser console (F12) for errors
4. Check server logs in terminal

---

## 📞 Support

For questions about any file or feature:

**Contact: Keny Cruz**
- Email: kenycruz701@gmail.com
- Phone: +229 0143515312
- WhatsApp: +229 0143515312

---

**Last Updated**: January 31, 2026  
**Version**: 1.0.0  
**Status**: Complete & Ready ✅

**Created with ❤️ by Keny Cruz**
