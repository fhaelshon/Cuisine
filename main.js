// ============================================
// AFRICA CUISINE - MAIN JAVASCRIPT
// Designed by: Keny Cruz
// Email: kenycruz701@gmail.com
// ============================================

let stripe;
let elements;
let cardElement;
let currentOrder = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize Stripe
async function initializeStripe() {
    const response = await fetch('/api/stripe-key');
    const { publishableKey } = await response.json();
    stripe = Stripe(publishableKey);
    elements = stripe.elements();
    cardElement = elements.create('card');
}

// Small helper: ensure i18n JSONs load early if requested
document.addEventListener('DOMContentLoaded', () => {
    const currentLang = localStorage.getItem('siteLang') || (navigator.language || 'fr').slice(0,2);
    loadTranslations(currentLang).catch(()=>{});
});

// Currency conversion constant
const EUR_TO_XOF = 655.957;

// Helper function to format prices in both currencies
function formatDualPrice(eurPrice) {
    const xofPrice = eurPrice * EUR_TO_XOF;
    return `${eurPrice.toFixed(2)}€ / ${xofPrice.toFixed(0)} XOF`;
}

// Display menu items
function displayMenu() {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="menu-item-image" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'">
            <div class="menu-item-content">
                <h3 class="menu-item-name">${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">${formatDualPrice(item.price)}</span>
                    <button class="menu-item-btn" onclick="openMenuModal(${item.id})">Détails</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(menuItem);
    });
}

// Filter menu items
function filterMenu(category) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '';
    
    const filtered = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    filtered.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="menu-item-image" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'">
            <div class="menu-item-content">
                <h3 class="menu-item-name">${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">${formatDualPrice(item.price)}</span>
                    <button class="menu-item-btn" onclick="openMenuModal(${item.id})">Détails</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(menuItem);
    });
}

// Open menu item modal
function openMenuModal(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    
    document.getElementById('modalTitle').textContent = item.name;
    document.getElementById('modalImage').src = item.image;
    document.getElementById('modalDescription').textContent = item.details;
    document.getElementById('modalOrigin').textContent = item.description;
    document.getElementById('modalIngredients').textContent = item.ingredients;
    document.getElementById('modalPrep').textContent = item.preparation;
    document.getElementById('modalCountries').textContent = item.countries.join(', ');
    document.getElementById('modalPrice').textContent = formatDualPrice(item.price);
    document.getElementById('modalQuantity').value = 1;
    document.getElementById('addToCartBtn').onclick = () => addToCart(id);

    // Load rating and favorite status
    const rating = getDishRating(id);
    const isFavorited = isDishFavorited(id);
    
    // Set star rating display
    const starsContainer = document.getElementById('dishRating');
    const ratingDisplay = document.getElementById('ratingDisplay');
    document.querySelectorAll('.star').forEach(star => {
        const val = parseInt(star.getAttribute('data-value'));
        if (val <= rating) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
        star.onclick = () => setDishRating(id, val, starsContainer);
    });
    ratingDisplay.textContent = rating > 0 ? `${rating}/5` : 'Non noté';
    
    // Set favorite button
    const favBtn = document.getElementById('favoriteBtn');
    favBtn.classList.toggle('favorited', isFavorited);
    favBtn.onclick = () => toggleFavorite(id, favBtn);
    
    // Load similar dishes
    displaySimilarDishes(item);
    
    const modal = document.getElementById('menuModal');
    modal.classList.add('show');
}

// Rating and Favorites Functions
function getDishRating(id) {
    const ratings = JSON.parse(localStorage.getItem('dishRatings') || '{}');
    return ratings[id] || 0;
}

function setDishRating(id, rating, starsContainer) {
    const ratings = JSON.parse(localStorage.getItem('dishRatings') || '{}');
    ratings[id] = rating;
    localStorage.setItem('dishRatings', JSON.stringify(ratings));
    document.querySelectorAll('.star').forEach(star => {
        const val = parseInt(star.getAttribute('data-value'));
        val <= rating ? star.classList.add('filled') : star.classList.remove('filled');
    });
    document.getElementById('ratingDisplay').textContent = `${rating}/5`;
    showNotification(`Merci! Vous avez noté ${rating}/5.`, 'success');
}

function isDishFavorited(id) {
    const favorites = JSON.parse(localStorage.getItem('favoriteDishes') || '[]');
    return favorites.includes(id);
}

function toggleFavorite(id, btn) {
    const favorites = JSON.parse(localStorage.getItem('favoriteDishes') || '[]');
    const idx = favorites.indexOf(id);
    if (idx > -1) {
        favorites.splice(idx, 1);
        btn.classList.remove('favorited');
        showNotification('Retiré des favoris.', 'success');
    } else {
        favorites.push(id);
        btn.classList.add('favorited');
        showNotification('Ajouté aux favoris!', 'success');
    }
    localStorage.setItem('favoriteDishes', JSON.stringify(favorites));
}

function displaySimilarDishes(dish) {
    const grid = document.getElementById('similarDishesGrid');
    if (!grid) return;
    
    // Find dishes with same category or region
    const similar = menuItems.filter(item => 
        item.id !== dish.id && 
        (item.category === dish.category || item.countries.some(c => dish.countries.includes(c)))
    ).slice(0, 6);
    
    grid.innerHTML = '';
    similar.forEach((s, idx) => {
        const card = document.createElement('div');
        card.className = 'similar-dish-card';
        card.style.animationDelay = `${idx * 0.08}s`;
        card.innerHTML = `
            <img src="${s.image}" alt="${s.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop'">
            <h5>${s.name}</h5>
            <p>${s.category}</p>
        `;
        card.addEventListener('click', () => {
            closeModal();
            openMenuModal(s.id);
        });
        grid.appendChild(card);
    });
}

// Close modal
function closeModal() {
    document.getElementById('menuModal').classList.remove('show');
}

// Add item to cart
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    const quantity = parseInt(document.getElementById('modalQuantity').value);
    
    if (!item) return;
    
    const existingItem = cart.find(c => c.id === id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    closeModal();
    
    // Show success message
    showNotification('Article ajouté au panier!', 'success');
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
}

// Open cart
function openCart() {
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Votre panier est vide</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            const itemTotal = item.price * item.quantity;
            const itemTotalXOF = itemTotal * EUR_TO_XOF;
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <div class="cart-item-qty">
                        <input type="number" min="1" max="20" value="${item.quantity}" 
                            onchange="updateQuantity(${item.id}, this.value)">
                    </div>
                    <div class="cart-item-price">${itemTotal.toFixed(2)}€ / ${itemTotalXOF.toFixed(0)} XOF</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    updateCartSummary();
    cartModal.classList.add('show');
}

// Close cart
function closeCart() {
    document.getElementById('cartModal').classList.remove('show');
}

// Update quantity
function updateQuantity(id, quantity) {
    const item = cart.find(c => c.id === id);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity));
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        openCart();
    }
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    openCart();
    showNotification('Article supprimé du panier', 'success');
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 2.50;
    const total = subtotal + shipping;
    const subtotalXOF = subtotal * EUR_TO_XOF;
    const shippingXOF = shipping * EUR_TO_XOF;
    const totalXOF = total * EUR_TO_XOF;
    
    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)}€ / ${subtotalXOF.toFixed(0)} XOF`;
    document.getElementById('shipping').textContent = `2.50€ / ${shippingXOF.toFixed(0)} XOF`;
    document.getElementById('total').textContent = `${total.toFixed(2)}€ / ${totalXOF.toFixed(0)} XOF`;
}

// Go to checkout
function goToCheckout() {
    if (cart.length === 0) {
        showNotification('Votre panier est vide', 'error');
        return;
    }
    
    closeCart();
    document.getElementById('menuModal').classList.remove('show');
    document.querySelector('.checkout-section').classList.remove('hidden');
    document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
    
    updateOrderSummary();
    setupPaymentMethods();
}

// Back to cart
function backToCart() {
    document.querySelector('.checkout-section').classList.add('hidden');
    openCart();
}

// Update order summary
function updateOrderSummary() {
    const summary = document.getElementById('orderSummary');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    summary.innerHTML = '';
    cart.forEach(item => {
        const line = document.createElement('div');
        line.className = 'order-item';
        const itemTotal = item.price * item.quantity;
        const itemTotalXOF = itemTotal * EUR_TO_XOF;
        line.innerHTML = `
            <span class="order-item-name">${item.name} x ${item.quantity}</span>
            <span class="order-item-price">${itemTotal.toFixed(2)}€ / ${itemTotalXOF.toFixed(0)} XOF</span>
        `;
        summary.appendChild(line);
    });
    
    const shipping = 2.50;
    const checkoutTotal = total + shipping;
    const checkoutTotalXOF = checkoutTotal * EUR_TO_XOF;
    document.getElementById('checkoutTotal').textContent = `${checkoutTotal.toFixed(2)}€ / ${checkoutTotalXOF.toFixed(0)} XOF`;
}

// Setup payment methods
function setupPaymentMethods() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    setupPaymentUI(paymentMethod);
    
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', (e) => setupPaymentUI(e.target.value));
    });
}

// Setup payment UI
function setupPaymentUI(method) {
    const stripeElement = document.getElementById('stripe-card-element');
    const bankDetails = document.getElementById('bank-details');
    
    // Handle mobile money
    if (['wave', 'orange', 'mtn'].includes(method)) {
        stripeElement.style.display = 'none';
        bankDetails.style.display = 'none';
        setupMobileMoneyUI(method);
    } else if (method === 'stripe') {
        stripeElement.style.display = 'block';
        bankDetails.style.display = 'none';
        const mobileMoneyDetails = document.getElementById('mobile-money-details');
        if (mobileMoneyDetails) {
            mobileMoneyDetails.classList.remove('show');
        }
        if (!cardElement) {
            initCardElement();
        }
    } else {
        stripeElement.style.display = 'none';
        bankDetails.style.display = 'block';
        const mobileMoneyDetails = document.getElementById('mobile-money-details');
        if (mobileMoneyDetails) {
            mobileMoneyDetails.classList.remove('show');
        }
    }
}

// Initialize card element
function initCardElement() {
    try {
        if (stripe && elements && !cardElement) {
            cardElement = elements.create('card');
            cardElement.mount('#stripe-card-element');
            cardElement.addEventListener('change', (e) => {
                const errors = document.getElementById('card-errors');
                if (e.error) {
                    errors.textContent = e.error.message;
                } else {
                    errors.textContent = '';
                }
            });
        }
    } catch (error) {
        console.log('Card element setup - Stripe not available for demo');
    }
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

let adminAuthenticated = false;
let orders = [];

// Open admin modal
function openAdminModal() {
    document.getElementById('adminModal').classList.add('show');
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
    adminAuthenticated = false;
}

// Close admin modal
function closeAdminModal() {
    document.getElementById('adminModal').classList.remove('show');
    adminAuthenticated = false;
}

// Authenticate admin
async function authenticateAdmin() {
    const password = document.getElementById('adminPassword').value;
    
    // Hardcoded admin password (in production, use backend authentication)
    const correctPassword = 'admin2024';
    
    if (password === correctPassword) {
        adminAuthenticated = true;
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        
        // Fetch orders from backend
        await fetchOrders();
        showNotification('Authentification réussie!', 'success');
        document.getElementById('adminPassword').value = '';
    } else {
        showNotification('Mot de passe incorrect!', 'error');
        document.getElementById('adminPassword').value = '';
    }
}

// Fetch orders from backend
async function fetchOrders() {
    try {
        const response = await fetch('/api/orders');
        if (response.ok) {
            orders = await response.json();
            displayOrders('all');
        } else {
            // Demo mode - use local orders
            displayOrders('all');
        }
    } catch (error) {
        console.log('Using demo orders:', error);
        displayOrders('all');
    }
}

// Display orders
function displayOrders(status = 'all') {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    ordersList.innerHTML = '';
    
    let filteredOrders = orders;
    if (status !== 'all') {
        filteredOrders = orders.filter(order => order.status === status);
    }
    
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; color: var(--text-color);">Aucune commande trouvée.</p>';
        return;
    }
    
    filteredOrders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';
        orderElement.innerHTML = `
            <div class="order-header">
                <div class="order-number">#${order.id || 'N/A'}</div>
                <span class="order-status status-${order.status || 'pending'}">${order.status || 'En attente'}</span>
            </div>
            <div class="order-details">
                <p><strong>Client:</strong> ${order.firstName} ${order.lastName}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Téléphone:</strong> ${order.phone}</p>
                <p><strong>Adresse:</strong> ${order.address}, ${order.postal} ${order.city}</p>
                <p><strong>Méthode de paiement:</strong> ${getPaymentMethodLabel(order.paymentMethod)}</p>
                
                <div class="order-items-list">
                    <strong>Articles:</strong>
                    ${order.items.map(item => {
                        const itemTotal = item.price * item.quantity;
                        const itemTotalXOF = itemTotal * EUR_TO_XOF;
                        return `
                        <div class="order-item-entry">
                            <span>${item.name} x ${item.quantity}</span>
                            <span>${itemTotal.toFixed(2)}€ / ${itemTotalXOF.toFixed(0)} XOF</span>
                        </div>
                    `;
                    }).join('')}
                    <div class="order-total">Total: ${order.total.toFixed(2)}€ / ${(order.total * EUR_TO_XOF).toFixed(0)} XOF</div>
                </div>
            </div>
        `;
        ordersList.appendChild(orderElement);
    });
}

// Filter orders by status
function filterOrdersByStatus(status) {
    document.querySelectorAll('.status-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayOrders(status);
}

// Logout admin
function logoutAdmin() {
    adminAuthenticated = false;
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    showNotification('Déconnexion réussie!', 'success');
}

// Get payment method label
function getPaymentMethodLabel(method) {
    const labels = {
        'stripe': '💳 Carte Bancaire (Stripe)',
        'bank': '🏦 Virement Bancaire',
        'wave': '📱 Wave Mobile Money',
        'orange': '📱 Orange Money',
        'mtn': '📱 MTN Mobile Money'
    };
    return labels[method] || method;
}

// ============================================
// MOBILE MONEY FUNCTIONS
// ============================================

// Handle mobile money payment method selection
function setupMobileMoneyUI(method) {
    const mobileMoneyDetails = document.getElementById('mobile-money-details');
    if (!mobileMoneyDetails) return;
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (['wave', 'orange', 'mtn'].includes(paymentMethod)) {
        mobileMoneyDetails.classList.add('show');
        mobileMoneyDetails.innerHTML = generateMobileMoneyForm(paymentMethod);
    } else {
        mobileMoneyDetails.classList.remove('show');
    }
}

// Generate mobile money form
function generateMobileMoneyForm(method) {
    const providers = {
        'wave': {
            name: '📱 Wave Money',
            number: '+229 0143515312',
            instruction: 'Envoyez un virement via Wave à ce numéro',
            icon: '👋'
        },
        'orange': {
            name: '🟠 Orange Money',
            number: '+229 0143515312',
            instruction: 'Envoyez un virement via Orange Money à ce numéro',
            icon: '🟠'
        },
        'mtn': {
            name: '🟡 MTN Mobile Money',
            number: '+229 0143515312',
            instruction: 'Envoyez un virement via MTN Mobile Money à ce numéro',
            icon: '🟡'
        }
    };
    
    const provider = providers[method];
    
    return `
        <div class="mobile-money-header">
            <span>${provider.icon}</span>
            <span>${provider.name}</span>
        </div>
        
        <div class="mobile-money-info">
            <h4>Instructions de paiement:</h4>
            <p>${provider.instruction}</p>
            
            <div class="info-highlight">
                ${provider.number}
            </div>
            
            <p><strong>Après paiement:</strong></p>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>Prendre une capture d'écran du virement confirmé</li>
                <li>Envoyer la preuve via WhatsApp: ${provider.number}</li>
                <li>Votre commande sera confirmée à la réception du paiement</li>
            </ul>
        </div>
    `;
}

// Process mobile money payment
async function processMobileMoneyPayment(orderData, provider) {
    try {
        showNotification('Traitement du paiement ' + provider + '...', 'success');
        
        const response = await fetch(`/api/process-${provider}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderData })
        });
        
        if (response.ok) {
            const result = await response.json();
            setTimeout(() => {
                completeOrder(orderData, provider);
            }, 1500);
        } else {
            showNotification('Erreur lors du traitement du paiement', 'error');
        }
    } catch (error) {
        console.error('Erreur lors du paiement mobile money:', error);
        // For demo, complete order anyway
        setTimeout(() => {
            completeOrder(orderData, provider);
        }, 1500);
    }
}

// Handle checkout form submission
document.getElementById('checkoutForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const formData = new FormData(document.getElementById('checkoutForm'));
    
    const orderData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postal: document.getElementById('postal').value,
        country: document.getElementById('country').value,
        paymentMethod: paymentMethod,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 2.50,
        id: generateOrderNumber(),
        status: 'pending',
        date: new Date().toISOString()
    };
    
    if (paymentMethod === 'stripe') {
        await processStripePayment(orderData);
    } else if (['wave', 'orange', 'mtn'].includes(paymentMethod)) {
        await processMobileMoneyPayment(orderData, paymentMethod);
    } else {
        processBankTransfer(orderData);
    }
});

// Process Stripe payment
async function processStripePayment(orderData) {
    const paymentBtn = document.getElementById('paymentBtn');
    paymentBtn.disabled = true;
    paymentBtn.innerHTML = '<span class="loading"></span> Traitement...';
    
    try {
        // Call backend to save order and send emails
        const response = await fetch('/api/process-stripe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderData })
        });

        if (response.ok) {
            // Order saved and emails sent
            setTimeout(() => {
                completeOrder(orderData, 'stripe');
                paymentBtn.disabled = false;
                paymentBtn.textContent = 'Confirmer le Paiement';
            }, 1500);
        } else {
            showNotification('Erreur lors du traitement du paiement', 'error');
            paymentBtn.disabled = false;
            paymentBtn.textContent = 'Confirmer le Paiement';
        }
    } catch (error) {
        console.error('Erreur lors du paiement Stripe:', error);
        // For demo, complete order anyway
        setTimeout(() => {
            completeOrder(orderData, 'stripe');
            paymentBtn.disabled = false;
            paymentBtn.textContent = 'Confirmer le Paiement';
        }, 1500);
    }
}

// Process bank transfer
function processBankTransfer(orderData) {
    showNotification(
        'Commande reçue! Nous vous enverrons les coordonnées bancaires par email. ' +
        'Vous pouvez aussi nous contacter au +229 0143515312 ou par WhatsApp.',
        'success'
    );
    
    setTimeout(() => {
        completeOrder(orderData, 'bank');
    }, 1500);
}

// Complete order
function completeOrder(orderData, method) {
    currentOrder = orderData;
    
    // Send confirmation email via backend
    sendOrderEmail(orderData, method);
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    
    // Show success page
    document.querySelector('.checkout-section').classList.add('hidden');
    showOrderSuccess(orderData, method);
}

// Send order email with method details
async function sendOrderEmail(orderData, method) {
    try {
        // Call backend to send email based on payment method
        const response = await fetch('/api/send-order-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                orderData: {
                    ...orderData,
                    paymentMethod: method
                }
            })
        });
        
        if (response.ok) {
            console.log('Email de confirmation envoyé:', method);
        } else {
            console.log('Email not sent via backend, using frontend confirmation');
        }
    } catch (error) {
        console.log('Email sending via backend failed, continuing with frontend confirmation:', error);
        // Continue anyway - order is already confirmed
    }
}

// Show order success
function showOrderSuccess(orderData, method) {
    const modal = document.getElementById('menuModal');
    modal.classList.add('show');
    
    const total = orderData.total.toFixed(2);
    const paymentInfo = method === 'stripe' 
        ? 'Paiement par carte bancaire confirmé'
        : 'Veuillez envoyer votre virement à: kenycruz701@gmail.com';
    
    document.getElementById('modalTitle').textContent = '✓ Commande Confirmée!';
    document.querySelector('.modal-header').style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
    
    const successHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 3rem; color: #27ae60; margin-bottom: 20px;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 style="color: #27ae60; margin-bottom: 20px;">Merci pour votre commande!</h2>
            <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Numéro de commande:</strong> ${generateOrderNumber()}</p>
                <p><strong>Nom:</strong> ${orderData.firstName} ${orderData.lastName}</p>
                <p><strong>Email:</strong> ${orderData.email}</p>
                <p><strong>Total:</strong> ${total}€</p>
                <p style="margin-top: 15px;"><strong>Méthode de paiement:</strong></p>
                <p>${paymentInfo}</p>
            </div>
            <p style="color: var(--text-color); line-height: 1.8;">
                <strong>Contactez-nous:</strong><br>
                📱 Téléphone: +229 0143515312<br>
                💬 WhatsApp: +229 0143515312<br>
                📧 Email: kenycruz701@gmail.com
            </p>
        </div>
    `;
    
    document.getElementById('modalBody').innerHTML = successHTML;
    document.getElementById('modalBody').style.textAlign = 'center';
    document.querySelector('.modal-footer').innerHTML = `
        <button class="btn-add-to-cart" onclick="returnHome()">Retour à l'accueil</button>
    `;
}

// Generate order number
function generateOrderNumber() {
    return 'ACN' + Date.now().toString().slice(-8);
}

// Return home
function returnHome() {
    closeModal();
    document.querySelector('.checkout-section').classList.add('hidden');
    document.querySelector('.modal-header').style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
    displayMenu();
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `${type}-message`;
    notification.style.position = 'fixed';
    notification.style.top = '80px';
    notification.style.right = '20px';
    notification.style.zIndex = '3000';
    notification.style.maxWidth = '300px';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Display menu
    displayMenu();
    updateCartUI();
    
    // Setup filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterMenu(e.target.dataset.filter);
        });
    });
    
    // Setup cart button
    document.getElementById('cartBtn').addEventListener('click', openCart);
    
    // Setup payment method radio buttons
    document.querySelectorAll('input[name="paymentMethod"]')?.forEach(radio => {
        radio.addEventListener('change', (e) => setupPaymentUI(e.target.value));
    });
    
    // Setup modal close
    document.querySelector('.close')?.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('menuModal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Setup contact form
    document.getElementById('contactForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Merci! Nous vous recontacterons bientôt.', 'success');
        e.target.reset();
    });
    
    // Setup admin button
    document.getElementById('adminBtn')?.addEventListener('click', openAdminModal);
    
    // Setup admin modal close
    const adminModal = document.getElementById('adminModal');
    if (adminModal) {
        const adminClose = adminModal.querySelector('.admin-modal-close');
        if (adminClose) {
            adminClose.addEventListener('click', closeAdminModal);
        }
        
        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === adminModal) {
                closeAdminModal();
            }
        });
    }
    
    // Setup admin login
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            authenticateAdmin();
        });
    }
    
    // Setup admin password input (allow Enter to submit)
    document.getElementById('adminPassword')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            authenticateAdmin();
        }
    });
    
    // Setup status filter buttons
    document.querySelectorAll('.status-filter-btn')?.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterOrdersByStatus(btn.dataset.status);
        });
    });
    
    // Setup logout button
    document.getElementById('logoutBtn')?.addEventListener('click', logoutAdmin);
    
    // Initialize Stripe (optional - will fail gracefully if no key)
    initializeStripe().catch(() => {
        console.log('Stripe demo mode - no real payments processed');
    });

    // Workshop modal open/close
    const openWorkshopBtn = document.getElementById('openWorkshopBtn');
    const workshopModal = document.getElementById('workshopModal');
    const workshopClose = document.querySelector('.workshop-close');
    const workshopCancel = document.querySelector('.workshop-cancel');

    if (openWorkshopBtn && workshopModal) {
        openWorkshopBtn.addEventListener('click', () => {
            workshopModal.classList.add('show');
            // initialize payment UI defaults
            setupWorkshopPaymentUI();
        });
    }
    if (workshopClose) workshopClose.addEventListener('click', () => workshopModal.classList.remove('show'));
    if (workshopCancel) workshopCancel.addEventListener('click', () => workshopModal.classList.remove('show'));

    // Workshop form wiring
    const wsForm = document.getElementById('workshopForm');
    if (wsForm) {
        // update amount when option or participants change
        const wsOption = document.getElementById('wsOption');
        const wsParticipants = document.getElementById('wsParticipants');
        const wsAmountEl = document.getElementById('wsAmount');

        function updateWorkshopAmount(){
            const option = wsOption.options[wsOption.selectedIndex];
            const base = parseFloat(option.getAttribute('data-price')) || 0;
            const participants = parseInt(wsParticipants.value) || 1;
            const total = option.value === 'private' ? base : base * participants;
            wsAmountEl.textContent = total.toFixed(2) + '€';
        }

        wsOption.addEventListener('change', updateWorkshopAmount);
        wsParticipants.addEventListener('input', updateWorkshopAmount);
        updateWorkshopAmount();

        // payment method radios
        document.querySelectorAll('input[name="wsPayment"]').forEach(radio => {
            radio.addEventListener('change', () => setupWorkshopPaymentUI());
        });

        wsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById('wsName').value,
                email: document.getElementById('wsEmail').value,
                phone: document.getElementById('wsPhone').value,
                date: document.getElementById('wsDate').value,
                participants: parseInt(document.getElementById('wsParticipants').value) || 1,
                option: document.getElementById('wsOption').value,
                paymentMethod: document.querySelector('input[name="wsPayment"]:checked').value
            };

            // compute amount client-side as a fallback
            const opt = document.getElementById('wsOption').options[document.getElementById('wsOption').selectedIndex];
            const base = parseFloat(opt.getAttribute('data-price')) || 0;
            const total = opt.value === 'private' ? base : base * data.participants;
            data.amount = total;

            // Send registration to backend (backend should create payment intent when needed)
            try {
                const resp = await fetch('/api/workshop/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await resp.json().catch(() => ({}));

                if (resp.ok && result.status === 'requires_payment' && data.paymentMethod === 'stripe' && result.clientSecret) {
                    // Confirm payment using Stripe
                    if (!stripe) {
                        await initializeStripe();
                    }
                    try {
                        const confirm = await stripe.confirmCardPayment(result.clientSecret, {
                            payment_method: { card: cardElement }
                        });
                        if (confirm.error) {
                            showNotification('Paiement échoué: ' + confirm.error.message, 'error');
                        } else if (confirm.paymentIntent && confirm.paymentIntent.status === 'succeeded') {
                            showNotification('Inscription et paiement confirmés! Merci.', 'success');
                            workshopModal.classList.remove('show');
                        }
                    } catch (err) {
                        showNotification('Erreur lors de la confirmation du paiement.', 'error');
                        console.error(err);
                    }
                } else if (resp.ok) {
                    // For non-stripe or server-side flows, show confirmation
                    showNotification('Inscription reçue. Suivez les instructions de paiement envoyées par email.', 'success');
                    workshopModal.classList.remove('show');
                } else {
                    showNotification('Erreur lors de l\'inscription. Veuillez réessayer.', 'error');
                }
            } catch (error) {
                console.error('Workshop registration error:', error);
                showNotification('Impossible de contacter le serveur. Essayez plus tard.', 'error');
            }
        });
    }

    // Helper to show/hide payment UI inside workshop modal
    function setupWorkshopPaymentUI(){
        const method = document.querySelector('input[name="wsPayment"]:checked')?.value || 'stripe';
        const stripeArea = document.getElementById('stripePaymentArea');
        const mobileArea = document.getElementById('mobileMoneyDetails');
        const bankArea = document.getElementById('bank-details');

        if (stripeArea) stripeArea.style.display = method === 'stripe' ? 'block' : 'none';
        if (mobileArea) mobileArea.style.display = ['wave','orange','mtn'].includes(method) ? 'block' : 'none';
        if (bankArea) bankArea.style.display = method === 'bank' ? 'block' : 'none';

        if (method === 'stripe') {
            // ensure Stripe card element is mounted
            try { initCardElement(); } catch(e){ /* graceful */ }
        }
    }
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease-out';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.menu-item, .contact-item, .info-card').forEach(el => {
    observer.observe(el);
});
// ============================================
// Currency Converter - EUR to XOF (CFA Franc)
// ============================================

const EUR_TO_XOF_RATE = 655.957; // Official exchange rate EUR to CFA Franc (XOF)

function initCurrencyConverter() {
    const eurInput = document.getElementById('eurAmount');
    const cfaInput = document.getElementById('cfaAmount');
    const swapBtn = document.getElementById('swapBtn');
    const exchangeRateDisplay = document.getElementById('exchangeRate');
    const updateTimeDisplay = document.getElementById('updateTime');
    
    // Initialize with default rate
    exchangeRateDisplay.textContent = EUR_TO_XOF_RATE.toFixed(3);
    updateTimeDisplay.textContent = new Date().toLocaleDateString('fr-FR');
    
    // Convert EUR to XOF
    function convertEurToXof() {
        const eurAmount = parseFloat(eurInput.value) || 0;
        const xofAmount = eurAmount * EUR_TO_XOF_RATE;
        cfaInput.value = xofAmount.toFixed(2);
    }
    
    // Convert XOF to EUR
    function convertXofToEur() {
        const xofAmount = parseFloat(cfaInput.value) || 0;
        const eurAmount = xofAmount / EUR_TO_XOF_RATE;
        eurInput.value = eurAmount.toFixed(2);
    }
    
    // Event listeners for conversion
    eurInput.addEventListener('input', convertEurToXof);
    cfaInput.addEventListener('input', convertXofToEur);
    
    // Swap currencies functionality
    swapBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Swap input values
        const tempValue = eurInput.value;
        eurInput.value = cfaInput.value;
        cfaInput.value = tempValue;
        
        // Trigger conversion
        convertEurToXof();
    });
    
    // Initialize with default conversion
    convertEurToXof();
}

// ============================================
// SERVICE BUTTON & PANEL
// ============================================

function displayFeaturedDishes() {
    const grid = document.getElementById('featuredDishesGrid');
    if (!grid || typeof africanDishes === 'undefined') return;

    // Display 12 random featured dishes
    const featured = africanDishes.slice(0, 12);
    grid.innerHTML = '';

    featured.forEach(dish => {
        const card = document.createElement('div');
        card.className = 'featured-dish-card';
        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}" class="featured-dish-image" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'">
            <div class="featured-dish-content">
                <div>
                    <span class="featured-dish-region">${dish.region}</span>
                    <span class="featured-dish-country">${dish.country}</span>
                </div>
                <div class="featured-dish-name">${dish.name}</div>
                <div class="featured-dish-desc">${dish.description}</div>
                <div class="featured-dish-cultural">
                    <strong>Culture:</strong> ${dish.cultural_note}
                </div>
                <div class="featured-dish-details">
                    <strong>Occasions:</strong> ${dish.occasions}<br>
                    <strong>Temps:</strong> ${dish.prep_time}
                </div>
                <div class="featured-dish-footer">
                    <span class="featured-dish-price">${dish.price.toFixed(2)}€</span>
                    <button class="featured-dish-btn" onclick="addToCart({id: ${dish.id}, name: '${dish.name}', price: ${dish.price}})">Ajouter</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function initServicePanel() {
    const serviceBtn = document.getElementById('serviceBtn');
    const servicePanel = document.getElementById('servicePanel');
    const servicePanelClose = document.getElementById('servicePanelClose');

    // Open service panel
    if (serviceBtn) {
        serviceBtn.addEventListener('click', () => {
            servicePanel.classList.add('active');
            displayFeaturedDishes(); // Load dishes when panel opens
        });
    }

    // Close service panel
    if (servicePanelClose) {
        servicePanelClose.addEventListener('click', () => {
            servicePanel.classList.remove('active');
        });
    }

    // Close panel when clicking outside
    if (servicePanel) {
        servicePanel.addEventListener('click', (e) => {
            if (e.target === servicePanel) {
                servicePanel.classList.remove('active');
            }
        });
    }

    // Close panel when clicking on a service link (except in-panel buttons that open sub-views)
    const serviceLinks = document.querySelectorAll('.service-btn-link');
    const keepOpenIds = ['openCateringBtn','openWorkshopBtn','openRecipesBtn'];
    serviceLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (keepOpenIds.includes(link.id)) return; // these open sub-views instead of closing panel
            servicePanel.classList.remove('active');
        });
    });

    // Catering details open/close handlers (in-panel)
    const openCateringBtn = document.getElementById('openCateringBtn');
    const cateringDetails = document.getElementById('cateringDetails');
    const closeCateringBtn = document.getElementById('closeCateringDetails');
    if (openCateringBtn && cateringDetails) {
        openCateringBtn.addEventListener('click', (ev) => {
            ev.preventDefault();
            cateringDetails.style.display = 'block';
            cateringDetails.setAttribute('aria-hidden', 'false');
            // ensure visible inside the service panel
            cateringDetails.scrollIntoView({behavior: 'smooth', block: 'center'});
        });
    }
    if (closeCateringBtn && cateringDetails) {
        closeCateringBtn.addEventListener('click', () => {
            cateringDetails.style.display = 'none';
            cateringDetails.setAttribute('aria-hidden', 'true');
        });
    }

    // Recipes button (open recipes tab)
    const openRecipesBtn = document.getElementById('openRecipesBtn');
    if (openRecipesBtn) {
        openRecipesBtn.addEventListener('click', (ev) => {
            ev.preventDefault();
            // ensure panel is open
            servicePanel.classList.add('active');
            // activate recipes tab
            const recipesTabBtn = Array.from(tabButtons).find(b => b.getAttribute('data-tab') === 'recipes');
            if (recipesTabBtn) recipesTabBtn.click();
        });
    }

    // Recipes display function
    function displayRecipes() {
        const grid = document.getElementById('recipesGrid');
        if (!grid) return;
        const source = (typeof africanDishes !== 'undefined' && africanDishes.length) ? africanDishes : (typeof menuItems !== 'undefined' ? menuItems : []);
        const items = source.slice(0, 12);
        grid.innerHTML = '';
        items.forEach(d => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            const img = d.image || '';
            const short = (d.description && d.description.length>120) ? d.description.slice(0,117)+'...' : (d.description||'');
            card.innerHTML = `
                <img src="${img}" alt="${d.name}">
                <div class="recipe-content">
                    <div class="recipe-title">${d.name}</div>
                    <div class="recipe-desc">${short}</div>
                    <div class="recipe-meta">${d.region || ''} • ${d.country || ''} • ${d.prep_time || ''}</div>
                    <div style="margin-top:8px"><button class="service-btn-link" data-recipe-id="${d.id}">Voir la recette</button></div>
                </div>
            `;
            grid.appendChild(card);
            // wire the button
            const btn = card.querySelector('button[data-recipe-id]');
            if (btn) btn.addEventListener('click', () => openRecipeModal(d));
        });
    }

    // Open recipe in the existing modal structure
    function openRecipeModal(dish) {
        if (!dish) return;
        // Use the menu modal to show recipe details
        document.getElementById('modalTitle').textContent = dish.name || '';
        document.getElementById('modalImage').src = dish.image || '';
        document.getElementById('modalDescription').textContent = dish.description || dish.cultural_note || '';
        document.getElementById('modalOrigin').textContent = dish.origin || dish.country || '';
        document.getElementById('modalIngredients').textContent = Array.isArray(dish.ingredients) ? dish.ingredients.join(', ') : (dish.ingredients || '');
        document.getElementById('modalPrep').textContent = dish.preparation || dish.details || '';
        document.getElementById('modalCountries').textContent = dish.country || '';
        document.getElementById('modalPrice').textContent = dish.price ? formatDualPrice(dish.price) : '';
        document.getElementById('modalQuantity').value = 1;
        document.getElementById('addToCartBtn').onclick = () => {
            if (dish.id) addToCart(dish.id);
            else addToCart({ id: Date.now(), name: dish.name, price: dish.price || 0, quantity:1 });
        };
        const modal = document.getElementById('menuModal');
        modal.classList.add('show');
    }

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.service-tab-btn');
    const tabContents = document.querySelectorAll('.service-tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const tabName = btn.getAttribute('data-tab');
            const tabContent = document.getElementById(`tab-${tabName}`);
            if (tabContent) {
                tabContent.classList.add('active');
                // Load content for specific tabs
                if (tabName === 'dishes') {
                    displayFeaturedDishes();
                }
                if (tabName === 'recipes') {
                    displayRecipes();
                }
                if (tabName === 'culture') {
                    displayCultureStories();
                }
            }
        });
    });

    // Culture tab: display stories and wire interactions
    function displayCultureStories(){
        const grid = document.getElementById('cultureGrid');
        if (!grid) return;
        const filter = document.getElementById('cultureRegionFilter')?.value || 'all';
        const source = (typeof africanDishes !== 'undefined' && africanDishes.length) ? africanDishes : (typeof menuItems !== 'undefined' ? menuItems : []);
        const stories = source.filter(s => filter === 'all' ? true : (s.region === filter));
        grid.innerHTML = '';
        stories.slice(0,12).forEach(s => {
            const card = document.createElement('div');
            card.className = 'culture-card';
            card.innerHTML = `
                <img src="${s.image||''}" alt="${s.name}">
                <div>
                    <div style="font-weight:700">${s.name || s.title || 'Récit anonyme'}</div>
                    <div class="culture-meta">${s.country || s.region || ''} • ${s.category || ''}</div>
                    <p style="margin-top:6px; color:#444">${(s.cultural_note||s.description||'').slice(0,140)}${(s.cultural_note||s.description||'').length>140? '...':''}</p>
                    <div style="margin-top:8px"><button class="service-btn-link" data-culture-id="${s.id}">Lire</button></div>
                </div>
            `;
            grid.appendChild(card);
            const btn = card.querySelector('button[data-culture-id]');
            if (btn) btn.addEventListener('click', () => openCultureModal(s));
        });
    }

    // open culture story in modal (reuse menuModal)
    function openCultureModal(s){
        document.getElementById('modalTitle').textContent = s.name || s.title || 'Récit';
        document.getElementById('modalImage').src = s.image || '';
        document.getElementById('modalDescription').textContent = s.history || s.cultural_note || s.description || '';
        document.getElementById('modalOrigin').textContent = `${s.country || ''} • ${s.region || ''}`;
        document.getElementById('modalIngredients').textContent = s.ingredients ? (Array.isArray(s.ingredients)? s.ingredients.join(', '): s.ingredients) : '';
        document.getElementById('modalPrep').textContent = s.details || s.preparation || '';
        document.getElementById('modalCountries').textContent = s.country || '';
        document.getElementById('modalPrice').textContent = s.price ? formatDualPrice(s.price) : '';
        document.getElementById('addToCartBtn').style.display = 'none';
        document.getElementById('menuModal').classList.add('show');
        // restore add button when modal closed via close handler elsewhere
    }

    // wire region filter change
    const cultureFilter = document.getElementById('cultureRegionFilter');
    if (cultureFilter) cultureFilter.addEventListener('change', displayCultureStories);
}

// Initialize converter when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initCurrencyConverter();
    initServicePanel();
    // INTERNATIONALIZATION (i18n) & Background music
    // Language selector wiring: load saved language or default
    const langSelectEl = document.getElementById('langSelect');
    const savedLang = localStorage.getItem('siteLang') || (navigator.language || 'fr').slice(0,2);
    if (langSelectEl) {
        if (Array.from(langSelectEl.options).some(o => o.value === savedLang)) {
            langSelectEl.value = savedLang;
        }
        langSelectEl.addEventListener('change', (e) => {
            const v = e.target.value;
            localStorage.setItem('siteLang', v);
            loadTranslations(v);
        });
    }
    // load initial translations
    loadTranslations(savedLang).catch(()=>{});

    // Background music toggle and preference
    const musicToggle = document.getElementById('musicToggle');
    const bgAudio = document.getElementById('bgAudio');
    const audioPref = localStorage.getItem('bgAudioPlaying') !== 'false'; // default to true for continuous play
    if (bgAudio && musicToggle) {
        // Start with music on (muted by default due to browser policy, unmute on first user interaction)
        bgAudio.muted = true;
        bgAudio.play().catch(()=>{}); // attempt autoplay
        
        // Unmute on first user interaction (click, key press, etc.)
        const unmuteOnInteraction = () => {
            bgAudio.muted = false;
            bgAudio.play().catch(()=>{});
            document.removeEventListener('click', unmuteOnInteraction);
            document.removeEventListener('keydown', unmuteOnInteraction);
        };
        document.addEventListener('click', unmuteOnInteraction);
        document.addEventListener('keydown', unmuteOnInteraction);
        
        // Toggle button reflects actual state
        musicToggle.setAttribute('aria-pressed', bgAudio.paused ? 'false' : 'true');
        
        musicToggle.addEventListener('click', () => {
            if (bgAudio.paused) {
                bgAudio.muted = false;
                bgAudio.play().catch(() => { showNotification('Le navigateur a bloqué la lecture. Essayez à nouveau.', 'error'); });
                musicToggle.setAttribute('aria-pressed','true');
                localStorage.setItem('bgAudioPlaying','true');
            } else {
                bgAudio.pause();
                musicToggle.setAttribute('aria-pressed','false');
                localStorage.setItem('bgAudioPlaying','false');
            }
        });
        
        // Keep music playing across page navigations (refresh/reload)
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('bgAudioPlaying', !bgAudio.paused ? 'true' : 'false');
        });
    }

});