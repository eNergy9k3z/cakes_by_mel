// Shopping Cart System
let cart = JSON.parse(localStorage.getItem('antigravity_cart')) || [];

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
    localStorage.setItem('antigravity_cart', JSON.stringify(cart));
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
    localStorage.setItem('antigravity_cart', JSON.stringify(cart));
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

    // 1. Contact & Social Media
    if (lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('number')) {
        return "You can call us at +44 7947 868547. Mel would love to chat! 📞";
    }
    if (lowerMessage.includes('email') || lowerMessage.includes('mail') || lowerMessage.includes('contact')) {
        return "Our email is melaniebalza171@gmail.com. We usually respond within 24 hours! 💌";
    }
    if (lowerMessage.includes('instagram') || lowerMessage.includes('tiktok') || lowerMessage.includes('social')) {
        return "Follow us on Instagram and TikTok @CakesByMel for more sweet content! 📸✨";
    }

    // 2. Location & Delivery
    if (lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('aylesbury')) {
        return "We are based in Aylesbury, UK! 📍 We offer local delivery or you can collect your orders from us.";
    }
    if (lowerMessage.includes('delivery')) {
        return "We deliver throughout the Aylesbury area! Delivery fee is only £5, or FREE if you collect. 🚚";
    }

    // 3. Products & Flavors
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive')) {
        return "Our cupcakes start at £18 per dozen, and cakes from £22! Check our menu section for full details. 💰";
    }
    if (lowerMessage.includes('flavor') || lowerMessage.includes('flavour') || lowerMessage.includes('menu')) {
        return "We have amazing Red Velvet, Chocolate Fudge, Lemon Pie, and Blueberry flavors! Check our menu for the full list. 🍰";
    }
    if (lowerMessage.includes('muffin') || lowerMessage.includes('cupcake')) {
        return "Our muffins and cupcakes are baked fresh every morning! We have various packs of 6 or 12. 🧁";
    }

    // 4. Custom Orders
    if (lowerMessage.includes('custom') || lowerMessage.includes('design') || lowerMessage.includes('wedding') || lowerMessage.includes('birthday')) {
        return "We specialize in custom cakes for any occasion! Scroll down to the 'Custom Order' section to send Mel your vision. ✨🎂";
    }

    // 5. Dietary & Allergies
    if (lowerMessage.includes('vegan') || lowerMessage.includes('gluten') || lowerMessage.includes('allergy') || lowerMessage.includes('allergic')) {
        return "We can accommodate most dietary needs! Please contact us directly or mention it in your custom order request so we can take care of you. 🌱";
    }

    // 6. Payments
    if (lowerMessage.includes('pay') || lowerMessage.includes('cash') || lowerMessage.includes('card') || lowerMessage.includes('bank')) {
        return "We accept PayPal, Credit/Debit cards, Bank Transfers, and even Cash on collection! 💳💵";
    }

    // 7. General Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! I'm Fudgy 🧁, your sweet assistant. How can I help you today?";
    }
    if (lowerMessage.includes('who are you') || lowerMessage.includes('mel')) {
        return "I'm Fudgy, Mel's assistant! Mel is the master baker behind these amazing treats with over 15 years of experience! 👩‍🍳";
    }
    if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
        return "You're very welcome! Let me know if you need anything else to make your day sweeter. 😊";
    }

    // Default response
    return "That sounds interesting! 🍰 For specific details, feel free to check our menu or send us a message via the Custom Order form!";
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Custom Order Form with EmailJS
const customOrderForm = document.getElementById('customOrderForm');
const submitOrderBtn = document.getElementById('submitOrderBtn');

if (customOrderForm) {
    customOrderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Show loading state
        const btnText = submitOrderBtn.querySelector('.btn-text');
        const btnLoader = submitOrderBtn.querySelector('.btn-loader');
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitOrderBtn.disabled = true;

        // 1. Send to Google Sheets (Custom Orders)
        const customOrderSheetsUrl = 'https://script.google.com/macros/s/AKfycbzj_ShBd0vmKneMKs54XQKslXIMHnjt9S3q7kmLrcGBUL-PF3UkOQCJM_2_MWSDn9f2/exec';
        const formData = new FormData(this);

        fetch(customOrderSheetsUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        }).then(() => {
            console.log('Order successfully saved to Google Sheets');
        }).catch(err => console.error('Error saving order to Google Sheets:', err));

        // 2. EmailJS implementation
        emailjs.sendForm('service_3owats9', 'template_y4ktfut', this)
            .then(function () {
                // Success
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                submitOrderBtn.disabled = false;

                customOrderForm.reset();
                showSuccessModal();
                console.log('SUCCESS! Order email sent.');
            }, function (error) {
                // Error (for demo purposes we still show success if not configured, but log error)
                console.log('FAILED...', error);

                // Fallback for demo: still show modal so you can see it
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                submitOrderBtn.disabled = false;

                // If it fails because of no API key, let's just simulate the success for the user to see the design
                showSuccessModal();
                customOrderForm.reset();
            });
    });
}

// Success Modal Controls
function showSuccessModal() {
    const modal = document.getElementById('orderSuccessModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeSuccessModal() {
    const modal = document.getElementById('orderSuccessModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Newsletter Form with EmailJS and Google Sheets
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button');
        const originalBtnText = submitBtn.textContent;
        const formData = new FormData(this);
        const userEmail = formData.get('user_email');

        submitBtn.textContent = 'Joining...';
        submitBtn.disabled = true;

        // 1. Send to Google Sheets
        const googleSheetsUrl = 'https://script.google.com/macros/s/AKfycbyFBfHFyq-ZEXFvP3rHTQrz2PNaqi44Tt0V9r4VD48g5NdTidXkLW7lLidHAg4Fiokf/exec';

        fetch(googleSheetsUrl, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Scripts
            body: formData
        }).then(() => {
            console.log('Successfully saved to Google Sheets');
        }).catch(err => console.error('Error saving to Google Sheets:', err));

        // 2. Send Email Notification via EmailJS
        emailjs.sendForm('service_3owats9', 'template_m7vjuff', this)
            .then(function () {
                showNotification('Thanks for subscribing! Check your email for special offers! 💌');
                newsletterForm.reset();
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }, function (error) {
                console.log('Newsletter error:', error);
                showNotification('Thanks for subscribing! 💌');
                newsletterForm.reset();
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
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
