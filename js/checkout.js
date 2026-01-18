// Checkout JavaScript

// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem('antigravity_cart')) || [];
let deliveryFee = 0;
let grandTotal = 0;

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function () {
    // Check if cart is empty
    if (cart.length === 0) {
        document.querySelector('.checkout-section').style.display = 'none';
        document.getElementById('emptyCartMessage').style.display = 'block';
        return;
    }

    // Render order items
    renderOrderItems();

    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('deliveryDate').min = tomorrow.toISOString().split('T')[0];

    // Generate order reference
    generateOrderReference();

    // Setup event listeners
    setupEventListeners();

    // Initialize PayPal
    initPayPal();
});

// Render order items
function renderOrderItems() {
    const orderItems = document.getElementById('orderItems');
    let subtotal = 0;

    orderItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div class="order-item">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-qty">Qty: ${item.quantity}</div>
                </div>
                <div class="item-price">£${itemTotal.toFixed(2)}</div>
            </div>
        `;
    }).join('');

    updateTotals(subtotal);
}

// Update totals
function updateTotals(subtotal) {
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
    deliveryFee = deliveryType === 'delivery' ? 5.00 : 0;
    grandTotal = subtotal + deliveryFee;

    document.getElementById('subtotal').textContent = `£${subtotal.toFixed(2)}`;
    document.getElementById('deliveryFee').textContent = deliveryFee > 0 ? `£${deliveryFee.toFixed(2)}` : 'FREE';
    document.getElementById('grandTotal').textContent = `£${grandTotal.toFixed(2)}`;
}

// Generate order reference
function generateOrderReference() {
    const ref = 'CBM-' + Date.now().toString(36).toUpperCase().slice(-6);
    document.getElementById('orderReference').textContent = ref;
    return ref;
}

// Setup event listeners
function setupEventListeners() {
    // Delivery type change
    document.querySelectorAll('input[name="deliveryType"]').forEach(input => {
        input.addEventListener('change', function () {
            const addressSection = document.getElementById('deliveryAddressSection');
            if (this.value === 'delivery') {
                addressSection.style.display = 'block';
                document.getElementById('address').required = true;
                document.getElementById('postcode').required = true;
            } else {
                addressSection.style.display = 'none';
                document.getElementById('address').required = false;
                document.getElementById('postcode').required = false;
            }

            // Recalculate totals
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            updateTotals(subtotal);
        });
    });

    // Payment method change
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function () {
            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            this.querySelector('input').checked = true;

            const method = this.dataset.method;

            // Show/hide payment info sections
            document.getElementById('paypal-button-container').style.display = method === 'paypal' || method === 'card' ? 'block' : 'none';
            document.getElementById('card-payment-info').style.display = method === 'card' ? 'block' : 'none';
            document.getElementById('bank-payment-info').style.display = method === 'bank' ? 'block' : 'none';
        });
    });
}

// Validate form
function validateForm() {
    const form = document.getElementById('checkoutForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            field.style.borderColor = '#e0e0e0';
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields.');
    }

    return isValid;
}

// Get order data
function getOrderData() {
    return {
        customer: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        },
        delivery: {
            type: document.querySelector('input[name="deliveryType"]:checked').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postcode: document.getElementById('postcode').value,
            date: document.getElementById('deliveryDate').value
        },
        notes: document.getElementById('notes').value,
        items: cart,
        totals: {
            subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            delivery: deliveryFee,
            total: grandTotal
        },
        reference: document.getElementById('orderReference').textContent
    };
}

// Initialize PayPal
function initPayPal() {
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
        },

        // Create order
        createOrder: function (data, actions) {
            if (!validateForm()) {
                return;
            }

            return actions.order.create({
                purchase_units: [{
                    description: 'Cakes by Mel Order',
                    amount: {
                        currency_code: 'GBP',
                        value: grandTotal.toFixed(2)
                    }
                }]
            });
        },

        // On approve
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                // Payment successful
                const orderData = getOrderData();
                orderData.paymentMethod = 'PayPal';
                orderData.paypalOrderId = data.orderID;

                // Show confirmation
                showConfirmation(orderData);

                // Clear cart
                localStorage.removeItem('antigravity_cart');

                // Send order notification (you would integrate with a backend here)
                console.log('Order completed:', orderData);
            });
        },

        // On error
        onError: function (err) {
            console.error('PayPal Error:', err);
            alert('There was an error processing your payment. Please try again.');
        }
    }).render('#paypal-button-container');
}

// Submit bank transfer order
function submitBankOrder() {
    if (!validateForm()) {
        return;
    }

    const orderData = getOrderData();
    orderData.paymentMethod = 'Bank Transfer';

    // Show confirmation
    showConfirmation(orderData);

    // Clear cart
    localStorage.removeItem('antigravity_cart');

    // Send order notification (you would integrate with a backend here)
    console.log('Order placed (Bank Transfer):', orderData);
}

// Show confirmation modal
function showConfirmation(orderData) {
    document.getElementById('confirmEmail').textContent = orderData.customer.email;
    document.getElementById('confirmOrderRef').textContent = orderData.reference;
    document.getElementById('confirmTotal').textContent = `£${orderData.totals.total.toFixed(2)}`;

    document.getElementById('confirmationModal').classList.add('active');
}

// Close modal on outside click
document.addEventListener('click', function (e) {
    const modal = document.getElementById('confirmationModal');
    if (e.target === modal) {
        // Don't close - force user to click button
    }
});
