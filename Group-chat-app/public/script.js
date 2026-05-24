const BASE_URL = 'http://localhost:8000/api'




function showChatWindow(calledDest) {
    const chatUi = document.getElementById('chatWindow')
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    if (calledDest === 'login') {
        loginForm.classList.add('hidden')
        chatUi.classList.remove('hidden')
    }
    if (calledDest === 'signup') {
        signupForm.classList.add('hidden')
        chatUi.classList.remove('hidden')
    }
}


function switchForm(formType) {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const formTitle = document.getElementById('formTitle');

    // Clear any leftover error states when toggling views
    clearErrors();

    if (formType === 'login') {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        formTitle.textContent = 'Welcome Back';
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        formTitle.textContent = 'Create Account';
    }
}

// Password visibility toggler mechanism
function togglePassword(inputId, openEyeId, closeEyeId) {
    const passwordInput = document.getElementById(inputId);
    const eyeOpen = document.getElementById(openEyeId);
    const eyeClose = document.getElementById(closeEyeId);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeOpen.classList.add('hidden');
        eyeClose.classList.remove('hidden');
    } else {
        passwordInput.type = 'password';
        eyeOpen.classList.remove('hidden');
        eyeClose.classList.add('hidden');
    }
}

// Utility to display animated inline visual error alerts
function displayError(elementId, message) {
    const errorContainer = document.getElementById(elementId);
    if (!errorContainer) return;

    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden');

    errorContainer.classList.add('animate-bounce');
    setTimeout(() => {
        errorContainer.classList.remove('animate-bounce');
    }, 1000);
}

function clearErrors() {
    const errors = ['signupError', 'loginError'];
    errors.forEach(id => {
        const errEl = document.getElementById(id);
        if (errEl) {
            errEl.textContent = '';
            errEl.classList.add('hidden');
        }
    });
}

// Helper function to handle parsing safely and prevent "Unexpected end of JSON input"
async function safeParseJson(response) {
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

// 1. Signup Form Submission Listener
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('number').value.trim();
    const password = document.getElementById('password').value;

    if (!name || !email || !phone || !password) {
        displayError('signupError', '⚠️ Please fill out all configuration fields.');
        return;
    }

    if (password.length < 6) {
        displayError('signupError', '⚠️ Password must be at least 6 characters long.');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/users/sign-up`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // CHANGED: "phoneNumber" now matches the backend key requirement
            body: JSON.stringify({ name, email, phoneNumber: phone, password })
        });

        const data = await safeParseJson(response);

        if (!response.ok) {
            displayError('signupError', data.message || 'An error occurred during verification.');
            return;
        }

        displayError('loginError', '✅ Account created successfully! Please login.');
        showChatWindow('signup')
        document.getElementById('loginError').classList.replace('text-red-500', 'text-indigo-400');

    } catch (err) {
        console.error(err);
        displayError('signupError', '🛑 Server connectivity failed. Try again later.');
    }
});

// 2. Login Form Submission Listener
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    document.getElementById('loginError').classList.replace('text-indigo-400', 'text-red-500');

    const emailOrPhone = document.getElementById('emailOrPhone').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!emailOrPhone || !password) {
        displayError('loginError', '⚠️ Please enter your credentials.');
        return;
    }

    const loginPayload = { password };
    if (emailOrPhone.includes('@')) {
        loginPayload.email = emailOrPhone;
    } else {
        loginPayload.phoneNumber = emailOrPhone;
    }

    try {
        const response = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginPayload)
        });

        const data = await safeParseJson(response);

        if (!response.ok) {
            displayError('loginError', data.message || 'Invalid identification coordinates.');
            return;
        }

        localStorage.setItem('accessToken', data.token || data.accessToken);

        const authCardContent = document.querySelector('#signupForm').parentNode;

        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('signupForm').classList.add('hidden');
        authCardContent.querySelector('div.flex').classList.add('hidden'); 

        const chatWindow = document.getElementById('chatWindow');
        if (chatWindow) {
            chatWindow.classList.remove('hidden');
            // Auto-scroll chat view to bottom for fresh stream experience
            const chatStream = chatWindow.querySelector('.chat-scrollbar');
            if (chatStream) chatStream.scrollTop = chatStream.scrollHeight;
        }

    } catch (err) {
        console.error(err);
        displayError('loginError', '🛑 Connection error. Is your backend server active?');
    }
});
