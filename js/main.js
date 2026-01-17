console.log("Cakes by Mel - Website Loaded");

let cartCount = 0;

function addToCart(productName) {
    cartCount++;
    document.querySelector('.cart-badge').textContent = cartCount;

    // Simple feedback in console
    console.log(`Yummy! You added ${productName} to your cart.`);

    // Animation for the cart icon
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = "scale(1.2)";
    setTimeout(() => {
        cartIcon.style.transform = "scale(1)";
    }, 200);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Fudgy Chatbot Logic
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function () {
    const sendBtn = document.querySelector('.send-btn');
    const chatInput = document.querySelector('.chat-footer input');
    const chatBody = document.querySelector('.chat-body');

    if (sendBtn && chatInput && chatBody) {
        function sendMessage() {
            const txt = chatInput.value.trim();
            if (txt === "") return;

            // 1. Add User Message
            const userMsgDiv = document.createElement('div');
            userMsgDiv.className = 'message user-message';
            userMsgDiv.innerText = txt;
            chatBody.appendChild(userMsgDiv);

            // Clear input
            chatInput.value = "";
            chatBody.scrollTop = chatBody.scrollHeight;

            // 2. Simulate Bot Response
            setTimeout(() => {
                const botResponses = [
                    "That sounds yummy! 🍰",
                    "I can definitely help with that.",
                    "Have you tried our Lemon Meringue?",
                    "I'm just a little bot, but I love cake! 🤖",
                    "Sweet choice!"
                ];
                const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

                const botMsgDiv = document.createElement('div');
                botMsgDiv.className = 'message bot-message';
                botMsgDiv.innerText = randomResponse;
                chatBody.appendChild(botMsgDiv);
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 1000);
        }

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
