const BASE_URL = 'http://localhost:8000/users/signup'

const form = document.getElementById('signupForm')
const emailInput = document.getElementById('email')
const emailError = document.getElementById('emailError')

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
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        })
        const result = await response.json()
        if (response.ok) {
            console.log('Sign-up success', result)
            form.reset()
        } else if (response.status === 403) {
            showEmailError(result.error)   // shows "User with x@x.com already exists" under the email field
        } else {
            console.log('Sign-up failed', result)
        }
    } catch (error) {
        console.log(error)
    }
})