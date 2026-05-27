const BASE_URL = 'http://localhost:8000/api';

const authContainer = document.getElementById('authContainer');
const chatWindow = document.getElementById('chatWindow');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const formTitle = document.getElementById('formTitle');


// ----------------------------
// UI STATE
// ----------------------------

function openChat() {
    authContainer.classList.add('hidden');
    chatWindow.classList.remove('hidden');
    loadChats();
}

function openAuth() {
    authContainer.classList.remove('hidden');
    chatWindow.classList.add('hidden');
}


// ----------------------------
// LOGIN PERSISTENCE
// ----------------------------

function saveLogin(token) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('isLoggedIn', 'true');
}

function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isLoggedIn');
    openAuth();
    loginForm.reset();
}

function restoreSession() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('accessToken');
    if (isLoggedIn === 'true' && token) {
        openChat();
    } else {
        openAuth();
    }
}


// ----------------------------
// FORM SWITCHING
// ----------------------------

function switchForm(type) {
    clearErrors();
    if (type === 'login') {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        formTitle.textContent = 'Welcome Back';
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        formTitle.textContent = 'Create Account';
    }
}


// ----------------------------
// ERROR HANDLING
// ----------------------------

function displayError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
}

function clearErrors() {
    ['signupError', 'loginError'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = '';
        el.classList.add('hidden');
    });
}

async function safeParseJson(response) {
    const text = await response.text();
    try {
        return text ? JSON.parse(text) : {};
    } catch {
        console.error('Non-JSON response:', text.slice(0, 100));
        return {};
    }
}


// ----------------------------
// RENDER MESSAGE
// ----------------------------

function renderMessage(message) {
    const container = document.getElementById('messagesContainer');

    const wrapper = document.createElement('div');
    wrapper.classList.add('flex', 'justify-end');

    const bubble = document.createElement('div');
    bubble.classList.add(
        'bg-indigo-600', 'text-white', 'text-sm',
        'px-4', 'py-2', 'rounded-xl', 'max-w-xs', 'break-words'
    );
    bubble.textContent = message;

    wrapper.appendChild(bubble);
    container.appendChild(wrapper);

    container.scrollTop = container.scrollHeight;
}


// ----------------------------
// LOAD CHATS FROM DB
// ----------------------------

async function loadChats() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
        const response = await fetch(`${BASE_URL}/chats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await safeParseJson(response);
        if (!response.ok) return;

        const container = document.getElementById('messagesContainer');
        container.innerHTML = '';

        data.chats.forEach(chat => renderMessage(chat.message));

    } catch (error) {
        console.error('Load chats error:', error);
    }
}


// ----------------------------
// SIGNUP
// ----------------------------

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('number').value.trim();
    const password = document.getElementById('password').value;

    if (!name || !email || !phoneNumber || !password) {
        displayError('signupError', 'Please fill all fields');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/users/sign-up`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phoneNumber, password })
        });

        const data = await safeParseJson(response);

        if (!response.ok) {
            displayError('signupError', data.message || 'Signup failed');
            return;
        }

        saveLogin(data.accessToken);
        openChat();

    } catch (error) {
        displayError('signupError', 'Server error');
    }
});


// ----------------------------
// LOGIN
// ----------------------------

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const emailOrPhone = document.getElementById('emailOrPhone').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!emailOrPhone || !password) {
        displayError('loginError', 'Please enter credentials');
        return;
    }

    const payload = { password };
    if (emailOrPhone.includes('@')) {
        payload.email = emailOrPhone;
    } else {
        payload.phoneNumber = emailOrPhone;
    }

    try {
        const response = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await safeParseJson(response);

        if (!response.ok) {
            displayError('loginError', data.message || 'Login failed');
            return;
        }

        saveLogin(data.accessToken || data.token);
        openChat();

    } catch (error) {
        displayError('loginError', 'Server connection failed');
    }
});


// ----------------------------
// SEND CHAT
// ----------------------------

window.addEventListener('DOMContentLoaded', () => {

    restoreSession();

    document.getElementById('chatForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const chatBox = document.getElementById('chatBox');
        const message = chatBox.value.trim();
        if (!message) return;

        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const response = await fetch(`${BASE_URL}/chats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message })
            });

            const data = await safeParseJson(response);

            if (!response.ok) {
                alert(data.message || 'Unable to send');
                return;
            }

            renderMessage(message); // ✅ show in UI
            chatBox.value = '';     // ✅ clear input

        } catch (error) {
            console.error('Send error:', error);
        }
    });

});