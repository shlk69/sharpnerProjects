const BASE_URL = 'http://localhost:8000/api';
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const signupError = document.getElementById('signupError');

// Toggling the eye icon
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeOpen = document.getElementById('eyeOpen');
    const eyeClose = document.getElementById('eyeClose');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeClose.classList.remove('hidden');
        eyeOpen.classList.add('hidden');
    } else {
        passwordInput.type = 'password';
        eyeOpen.classList.remove('hidden');
        eyeClose.classList.add('hidden');
    }
}

// To switch b/w login and signup
function switchForm(target) {
    const formTitle = document.getElementById('formTitle');

    // Clear any lingering errors when switching screens
    signupError.textContent = '';
    signupError.classList.add('hidden');

    if (target === 'login') {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        formTitle.innerText = 'Welcome Back !';
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        formTitle.innerText = 'Create Account';
    }
}

// Signup submission handler
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    signupError.textContent = '';
    signupError.classList.add('hidden');

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('number').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!name || !email || !phoneNumber || !password) {
        signupError.textContent = 'All fields are required.';
        signupError.classList.remove('hidden');
        return;
    }

    const user = {
        name,
        email,
        phoneNumber,
        password
    };
    try {
        const response = await fetch(`${BASE_URL}/users/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error( 'Something went wrong')
        }
        alert('User created successfully')
        switchForm('login')
    } catch (error) {
        console.error('Signup Error:', error);
        signupError.textContent = 'Network error. Please try again later.';
        signupError.classList.remove('hidden');
    }
});