# 🍽️ Africa Cuisine - Restaurant Ordering System

A modern, fully-featured restaurant ordering platform for African cuisine with Stripe payment integration, beautiful animations, and a complete backend system.

## 👨‍💻 Creator & Designer

**Keny Cruz**
- Email: kenycruz701@gmail.com
- Phone: +229 0143515312
- WhatsApp: +229 0143515312

---

## ✨ Features

### Frontend
- 🎨 **Beautiful Responsive Design** - Works perfectly on all devices (mobile, tablet, desktop)
- ⚡ **Smooth Animations** - Fade, slide, scale, bounce, and glow animations throughout
- 🔍 **Menu Filtering** - Filter by category: Appetizers, Mains, Desserts, Beverages, Sauces
- 🛒 **Shopping Cart** - Add items, adjust quantities, remove items with persistent storage
- 📱 **Mobile-First** - Fully responsive navigation and layout
- ♿ **Accessibility** - Proper semantic HTML and ARIA labels

### Backend (Node.js/Express)
- 💳 **Stripe Integration** - Complete payment processing setup
- 🏦 **Bank Transfer Support** - Alternative payment method
- 📧 **Email Notifications** - Automated order confirmations
- 🔐 **Secure Processing** - Payment intent creation and validation
- 🌐 **CORS Enabled** - Ready for multi-origin requests
- 📊 **Webhook Support** - Stripe event handling

### Payment Methods
1. **Stripe Card Payments** - Direct bank card processing with Stripe
2. **Bank Transfer** - Manual wire transfer with contact details
3. **WhatsApp** - Direct communication option

### Menu Items
- 43 authentic African dishes
- Detailed descriptions and origins
- Ingredients and preparation times
- Country of origin information
- Multiple photos for each dish
- Organized by category (Appetizers, Mains, Desserts, Beverages, Sauces)

---

## 📋 Menu Categories

### Appetizers (Entrées)
- Lentilles à la Marocaine
- Batata Mchermla
- Zaalouk Marocain
- Crevettes Pil Pil
- Kachumbari (African Salad)
- Foutou Banane
- Foufou de Manioc
- Alloco (Fried Plantains)
- Sauce Verte
- Msemen
- Injera
- And more...

### Main Courses (Plats)
- Bakbouka (Tripe Stew)
- Tajine Tunisien au Poulet
- Couscous Marocain
- Garba (Ivorian Fish Dish)
- Doro Wat (Ethiopian Chicken)
- Boulettes Kefta
- Sauce Gombo
- Sauce Graine
- Jollof Rice
- Thieboudienne (Senegalese Fish & Rice)
- Bobotie (South African)
- Mafé (Peanut Sauce Dishes)
- Poulet Yassa
- And more...

### Desserts
- Harcha Marocaine
- Baghrir (Thousand Hole Crepes)
- Mbouraké
- Thiakry (Millet Dessert)

### Beverages
- Bouye (Baobab Juice)
- Gnamankoudji (Ginger Juice)
- Jus de Tamarin
- Bissap (Hibiscus Juice)

### Sauces
- Sauce Arachide (Peanut Sauce)
- Piri Piri (Hot Sauce)

---

## 🚀 Getting Started

### Installation

1. **Clone or download the project**
```bash
cd c:\Users\User\Desktop\cruz
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=3000
NODE_ENV=development
STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
EMAIL_USER=kenycruz701@gmail.com
EMAIL_PASSWORD=your_app_password
```

4. **Start the server**
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

---

## 📁 Project Structure

```
cruz/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styles with animations
├── js/
│   ├── main.js            # Frontend logic
│   └── menu-data.js       # Menu items database
├── images/                # Placeholder for images
├── server/
│   ├── server.js          # Express.js backend
│   ├── package.json       # Node.js dependencies
│   └── .env.example       # Environment template
└── README.md              # This file
```

---

## 🎯 How to Use

### For Customers

1. **Browse Menu**
   - Scroll through all dishes or filter by category
   - Click "Détails" on any dish to see full information

2. **View Dish Details**
   - See ingredients, preparation time, and origin
   - Choose quantity and view price
   - Click "Ajouter au panier" to add to cart

3. **Shopping Cart**
   - Click the shopping cart icon in the navbar
   - Adjust quantities or remove items
   - View total with delivery fee

4. **Checkout**
   - Enter delivery information
   - Choose payment method:
     - Stripe Card Payment
     - Bank Transfer (with manual details)
   - Complete order and receive confirmation email

### For Administrators

1. **View Orders**
   - Orders are emailed to: kenycruz701@gmail.com
   - Include customer details, items, and payment method

2. **Process Payments**
   - Stripe orders: Automatically processed
   - Bank transfers: Manual confirmation via WhatsApp/Email

3. **Contact Customers**
   - Email: kenycruz701@gmail.com
   - Phone: +229 0143515312
   - WhatsApp: +229 0143515312

---

## 💳 Payment Integration

### Stripe Setup

1. **Create Stripe Account**
   - Go to: https://stripe.com
   - Sign up and get API keys

2. **Get API Keys**
   - Dashboard → Developers → API Keys
   - Copy Publishable Key (pk_test_...)
   - Copy Secret Key (sk_test_...)

3. **Configure Environment**
   ```env
   STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY
   ```

4. **Enable Payments**
   - Test mode cards: Use Stripe test cards
   - Card: 4242 4242 4242 4242
   - Date: Any future date
   - CVC: Any 3 digits

### Bank Transfer Setup

1. Bank account details are shown in checkout
2. Customer sends proof of transfer
3. Order marked as complete when verified
4. Automatic email notifications

---

## 📧 Email Configuration

### Gmail Setup (SMTP)

1. **Enable 2-Factor Authentication**
   - Account → Security → 2-Step Verification

2. **Create App Password**
   - Account → Security → App Passwords
   - Select "Mail" and "Windows Computer"
   - Get 16-character password

3. **Configure .env**
   ```env
   EMAIL_USER=kenycruz701@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

4. **Test Email**
   - Place an order to test
   - Check both customer and admin emails

---

## 🎨 Customization

### Change Colors

Edit `css/styles.css`:
```css
:root {
    --primary-color: #e74c3c;      /* Red */
    --secondary-color: #f39c12;    /* Orange */
    --accent-color: #27ae60;       /* Green */
    --dark-color: #2c3e50;         /* Dark */
    --light-color: #ecf0f1;        /* Light */
}
```

### Add New Menu Items

Edit `js/menu-data.js`:
```javascript
{
    id: 44,
    name: "Dish Name",
    category: "mains",
    price: 12.00,
    image: "https://image-url.com/image.jpg",
    description: "Short description",
    details: "Long description",
    ingredients: "Ingredient 1, Ingredient 2",
    preparation: "30 minutes",
    countries: ["Country 1", "Country 2"]
}
```

### Modify Animations

Edit `css/styles.css` and `js/main.js`:
- Change animation duration: `animation: slideInUp 0.5s ease-out;`
- Add new keyframes in CSS
- Adjust timing and easing functions

---

## 🔒 Security Notes

1. **Never commit .env files** - Keep credentials secret
2. **Use HTTPS in production** - Encrypt data transmission
3. **Validate all inputs** - Server-side validation
4. **Store sensitive data** - Use secure environment variables
5. **Rate limiting** - Prevent abuse (add in production)

---

## 📱 Mobile Responsiveness

The site is fully responsive with breakpoints at:
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

---

## 🧪 Testing

### Test Payment Methods

1. **Stripe Test Mode**
   - Card: 4242 4242 4242 4242
   - Expiry: 12/25
   - CVC: 123
   - Expected: Success

2. **Bank Transfer**
   - Select "Bank Transfer" option
   - View contact details
   - Click confirm

3. **Local Testing**
   ```bash
   http://localhost:3000
   ```

---

## 🐛 Troubleshooting

### Stripe not working
- Check API keys in .env
- Verify CORS settings
- Check browser console for errors

### Emails not sending
- Verify Gmail app password
- Check EMAIL_USER is correct
- Enable "Less secure apps" if needed (deprecated)
- Use 16-character app password

### Cart not persisting
- Check browser localStorage
- Clear cache and try again
- Use incognito mode to test

### Animations not smooth
- Check browser compatibility
- Disable GPU intensive animations if needed
- Test on different browsers

---

## 📊 Performance

- **Lighthouse Score**: Optimized for 90+
- **Page Load**: < 2 seconds
- **Bundle Size**: Minimal (no heavy frameworks)
- **Animations**: GPU-accelerated CSS transforms

---

## 🌐 Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile Browsers (iOS Safari, Chrome Mobile)

---

## 📈 Future Enhancements

- [ ] Add database (MongoDB/PostgreSQL)
- [ ] User accounts and order history
- [ ] Admin dashboard
- [ ] Multiple payment providers
- [ ] Order tracking real-time
- [ ] Loyalty points system
- [ ] Restaurant location/map
- [ ] Opening hours management
- [ ] Special offers/promotions
- [ ] Multi-language support

---

## 📞 Support & Contact

**Creator & Designer: Keny Cruz**

- 📧 Email: kenycruz701@gmail.com
- 📱 Phone: +229 0143515312
- 💬 WhatsApp: +229 0143515312

For support, questions, or feature requests, contact the creator directly.

---

## 📄 License

This project is created and maintained by **Keny Cruz**.

All rights reserved © 2024 Africa Cuisine

---

## 🙏 Acknowledgments

- Stripe for payment processing
- Express.js for backend framework
- Font Awesome for icons
- Unsplash for sample images
- All African cuisine traditions and recipes

---

## 🎯 Quick Command Reference

```bash
# Start server
npm start

# Start development with auto-reload
npm run dev

# Install dependencies
npm install

# View health check
curl http://localhost:3000/api/health

# Test local access
http://localhost:3000
```

---

**Made with ❤️ by Keny Cruz for Africa Cuisine**

*"Discover the authentic tastes of Africa"* 🌍🍽️
