const BASE_URL = 'http://localhost:8000/api';

const authContainer = document.getElementById('authContainer');
const chatWindow = document.getElementById('chatWindow');

const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

const formTitle = document.getElementById('formTitle');

const send = document.getElementById('sendButton');


// ----------------------------
// UI STATE
// ----------------------------

function openChat() {

    authContainer.classList.add('hidden');

    chatWindow.classList.remove('hidden');
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

    return text ? JSON.parse(text) : {};
}


// ----------------------------
// SIGNUP
// ----------------------------

signupForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    clearErrors();

    const name = document.getElementById('name').value.trim();

    const email = document.getElementById('email').value.trim();

    const phoneNumber =
        document.getElementById('number').value.trim();

    const password =
        document.getElementById('password').value;

    if (!name || !email || !phoneNumber || !password) {

        displayError(
            'signupError',
            'Please fill all fields'
        );

        return;
    }

    try {

        const response = await fetch(
            `${BASE_URL}/users/sign-up`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    name,
                    email,
                    phoneNumber,
                    password
                })
            }
        );

        const data = await safeParseJson(response);

        if (!response.ok) {

            displayError(
                'signupError',
                data.message || 'Signup failed'
            );

            return;
        }

        const token = data.accessToken;

        saveLogin(token);

        openChat();

    } catch (error) {

        console.error(error);

        displayError(
            'signupError',
            'Server error'
        );
    }
});


// ----------------------------
// LOGIN
// ----------------------------

loginForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    clearErrors();

    const emailOrPhone =
        document
            .getElementById('emailOrPhone')
            .value
            .trim();

    const password =
        document
            .getElementById('loginPassword')
            .value;

    if (!emailOrPhone || !password) {

        displayError(
            'loginError',
            'Please enter credentials'
        );

        return;
    }

    const payload = { password };

    if (emailOrPhone.includes('@')) {

        payload.email = emailOrPhone;

    } else {

        payload.phoneNumber = emailOrPhone;
    }

    try {

        const response = await fetch(
            `${BASE_URL}/users/login`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(payload)
            }
        );

        const data = await safeParseJson(response);

        if (!response.ok) {

            displayError(
                'loginError',
                data.message || 'Login failed'
            );

            return;
        }

        const token =
            data.accessToken || data.token;

        saveLogin(token);

        openChat();

    } catch (error) {

        console.error(error);

        displayError(
            'loginError',
            'Server connection failed'
        );
    }
});


// ----------------------------
// CREATE CHAT
// ----------------------------

send.addEventListener('click', async () => {

    const message =
        document.getElementById('chatBox').value.trim();

    if (!message) return;

    try {

        const response = await fetch(
            `${BASE_URL}/chats`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    message
                })
            }
        );

        const data = await safeParseJson(response);

        if (!response.ok) {

            alert(data.message || 'Unable to send');

            return;
        }

        document.getElementById('chatBox').value = '';

        console.log('Message sent');

    } catch (error) {

        console.error(error);
    }
});


// ----------------------------
// APP INIT
// ----------------------------

window.addEventListener(
    'DOMContentLoaded',
    restoreSession
);