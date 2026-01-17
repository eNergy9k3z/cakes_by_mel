// Shopping Cart System
let cart = JSON.parse(localStorage.getItem('cakesbymel_cart')) || [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    updateCart();
    initHeroSlideshow();
});

// Hero Slideshow
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    const slideInterval = 4000; // 4 seconds per slide

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].classList.add('active');
    }

    // Auto-advance slides
    setInterval(nextSlide, slideInterval);
}

// Toggle Chat
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('active');
}

// Toggle Cart Modal
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.toggle('active');
}

// Add to Cart Function
function addToCart(productName, price) {
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`${productName} added to cart!`);
}

// Update Cart Display
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Start adding delicious treats!</p>';
        cartTotal.textContent = '£0.00';
        return;
    }

    let cartHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>£${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity(${index}, -1)"><i class="fas fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)"><i class="fas fa-plus"></i></button>
                    <button class="remove-btn" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
                </div>
                <div class="cart-item-total">£${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });

    cartItems.innerHTML = cartHTML;
    cartTotal.textContent = `£${total.toFixed(2)}`;

    // Save cart to localStorage
    localStorage.setItem('cakesbymel_cart', JSON.stringify(cart));
}

// Update Quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCart();
    }
}

// Remove from Cart
function removeFromCart(index) {
    const item = cart[index];
    cart.splice(index, 1);
    updateCart();
    showNotification(`${item.name} removed from cart`);
}

// Checkout Function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Save cart and redirect to checkout page
    localStorage.setItem('cakesbymel_cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Product Filter System
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter products
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'flex';
            setTimeout(() => {
                product.style.opacity = '1';
                product.style.transform = 'scale(1)';
            }, 10);
        } else {
            product.style.opacity = '0';
            product.style.transform = 'scale(0.8)';
            setTimeout(() => {
                product.style.display = 'none';
            }, 300);
        }
    });
}

// FAQ Toggle
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Open clicked FAQ if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Chat functionality
const chatBody = document.querySelector('.chat-body');
const chatInput = document.querySelector('.chat-footer input');
const sendBtn = document.querySelector('.send-btn');

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';

    // Simulate bot response
    setTimeout(() => {
        const botResponse = getBotResponse(message);
        addMessage(botResponse, 'bot');
    }, 1000);
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "Our cakes start from £22! Check out our menu for full pricing. 🎂";
    } else if (lowerMessage.includes('delivery')) {
        return "We deliver throughout Aylesbury! Delivery fees vary based on distance. 🚚";
    } else if (lowerMessage.includes('order') || lowerMessage.includes('custom')) {
        return "You can place a custom order through our Custom Order form! Scroll down to find it. ✨";
    } else if (lowerMessage.includes('muffin')) {
        return "Our muffins are freshly baked daily! We have blueberry and chocolate chip varieties. 🧁";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! 👋 How can I help you today?";
    } else if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
        return "You're welcome! Have a sweet day! 😊";
    } else {
        return "That sounds yummy! 🍰 Feel free to check our menu or ask me anything else!";
    }
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Custom Order Form
const customOrderForm = document.getElementById('customOrderForm');
if (customOrderForm) {
    customOrderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your custom order request! We will contact you within 24 hours to discuss your vision.');
        customOrderForm.reset();
    });
}

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Thanks for subscribing! Check your email for special offers! 💌');
        newsletterForm.reset();
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    const cartModal = document.getElementById('cartModal');
    if (e.target === cartModal) {
        toggleCart();
    }
});

console.log('🎂 Cakes by Mel - Enhanced Website Loaded!');
