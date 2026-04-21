
const BASE_URL = 'http://localhost:8000/users'

const form = document.getElementById('signupForm')
const loginForm = document.getElementById('login-form')
const emailInput = document.getElementById('email')
const emailError = document.getElementById('emailError')
const signupWrapper = document.querySelector('.form-container') 
const loginWrapper = document.querySelector('.login-wrapper')  
const loginError = document.querySelector('.error') 

function showEmailError(message) {
    emailInput.classList.add('error')
    emailError.textContent = message
    emailError.classList.add('show')
}

function clearEmailError() {
    emailInput.classList.remove('error')
    emailError.textContent = ''
    emailError.classList.remove('show')
}

emailInput.addEventListener('input', clearEmailError)
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearEmailError()

    try {
        const userData = {
            name: document.getElementById('name').value,
            email: emailInput.value,
            password: document.getElementById('password').value
        }

        const response = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        })

        const result = await response.json()

        if (response.ok) {
            alert('Account created successfully!')
            form.reset()
            handleLoginClick()
        } else if (response.status === 403) {
            showEmailError(result.error)
        }

    } catch (error) {
        console.log(error)
    }
})



loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    loginError.innerText = ''

    try {
        const loginData = {
            email: document.getElementById('emailLogin').value,
            password: document.getElementById('passwordLogin').value
        }

        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        })

        const result = await response.json()

        if (response.ok) {
            alert('User logged in successfully!')
            loginForm.reset()
        } else {
            loginError.innerText = result.error
        }

    } catch (error) {
        loginError.innerText = 'Server error'
    }
})

function handleLoginClick() {
    signupWrapper.classList.add('hide')
    signupWrapper.classList.remove('show')
    loginWrapper.classList.add('show')
    loginWrapper.classList.remove('hide')
}

function handleSignupClick() {
    loginWrapper.classList.add('hide')
    loginWrapper.classList.remove('show')
    signupWrapper.classList.add('show')
    signupWrapper.classList.remove('hide')
}