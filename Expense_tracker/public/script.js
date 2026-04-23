const BASE_URL = 'http://localhost:8000'

let authToken = localStorage.getItem("token") || null

const form = document.getElementById('signupForm')
const loginForm = document.getElementById('login-form')
const emailInput = document.getElementById('email')
const emailError = document.getElementById('emailError')
const signupWrapper = document.querySelector('.form-container')
const loginWrapper = document.querySelector('.login-wrapper')
const loginError = document.querySelector('.error')
const expenseWrapper = document.querySelector('.app-wrapper')
expenseWrapper.classList.add('hide')

const expenseForm = document.getElementById('expense-form')
const premiumBtn = document.getElementById("buy-membership-btn")
const premiumBox = document.querySelector('.premium-header')

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




function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]))
    } catch (error) {
        return null
    }
}

function showPremiumUI() {
    premiumBtn.innerText = "👑 Premium User"
    premiumBtn.disabled = true

    if (!document.getElementById("leaderboard-btn")) {
        const leaderBoard = document.createElement("button")
        leaderBoard.id = "leaderboard-btn"
        leaderBoard.innerText = "Show Leaderboard"
        leaderBoard.addEventListener("click", handleLeaderboard)
        premiumBox.appendChild(leaderBoard)
    }
}

function showApp() {
    loginWrapper.classList.remove('show')
    loginWrapper.classList.add('hide')

    signupWrapper.classList.remove('show')
    signupWrapper.classList.add('hide')

    expenseWrapper.classList.remove('hide')
    expenseWrapper.classList.add('show')
}

function logout() {
    localStorage.removeItem("token")
    authToken = null
    location.reload()
}


form.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearEmailError()

    try {
        const userData = {
            name: document.getElementById('name').value,
            email: emailInput.value,
            password: document.getElementById('password').value
        }

        const response = await fetch(`${BASE_URL}/users/signup`, {
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
        } else {
            showEmailError(result.error || 'Signup failed')
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

        const response = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        })

        const result = await response.json()

        if (response.ok) {
            authToken = result.token
            localStorage.setItem("token", result.token)

            alert('User logged in successfully!')

            showApp()

            const decoded = parseJwt(authToken)
            if (decoded?.isPremiumUser) {
                showPremiumUI()
            }

            loginForm.reset()
            fetchAndDisplayExpenses()
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



expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    try {
        const expenseData = {
            amount: document.getElementById('amount').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value
        }

        const response = await fetch(`${BASE_URL}/expenses/add-expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(expenseData)
        })

        const result = await response.json()

        if (response.ok) {
            alert('Expense created successfully')
            expenseForm.reset()
            fetchAndDisplayExpenses()
        } else {
            alert(result.error || 'Something went wrong')
        }

    } catch (error) {
        console.log('Server error ', error.message)
    }
})


async function fetchAndDisplayExpenses() {
    const tableBody = document.getElementById('expense-table-body')
    const emptyMessage = document.querySelector('.table-container span')

    try {
        const response = await fetch(`${BASE_URL}/expenses/all-expenses`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })

        const expenses = await response.json()

        if (expenses.length === 0) {
            emptyMessage.style.display = 'block'
            tableBody.innerHTML = ''
            return
        }

        emptyMessage.style.display = 'none'
        tableBody.innerHTML = ''

        expenses.forEach(expense => {
            const row = document.createElement('tr')
            const amountClass = expense.category === 'Salary' ? 'text-green' : ''

            row.innerHTML = `
                <td>${expense.description || 'No description'}</td>
                <td><span class="category-tag">${expense.category}</span></td>
                <td class="align-right ${amountClass}">$${expense.amount}</td>
                <td class="align-right">
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `

            tableBody.appendChild(row)
        })

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id')

                try {
                    const response = await fetch(`${BASE_URL}/expenses/delete/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    })

                    const result = await response.json()

                    if (response.ok) {
                        fetchAndDisplayExpenses()
                    } else {
                        alert(result.error)
                    }

                } catch (error) {
                    console.log('Delete error:', error.message)
                }
            })
        })

    } catch (error) {
        console.error('Error fetching expenses:', error)
        emptyMessage.textContent = 'Failed to load expenses.'
    }
}

/* =========================
   PREMIUM PAYMENT
========================= */

premiumBtn.addEventListener("click", async () => {
    try {
        const response = await fetch(`${BASE_URL}/premium/create-order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        })

        const data = await response.json()

        if (!response.ok || !data.paymentSessionId) {
            alert("Unable to create payment order")
            return
        }

        const cashfree = Cashfree({ mode: "sandbox" })

        const result = await cashfree.checkout({
            paymentSessionId: data.paymentSessionId,
            redirectTarget: "_modal"
        })

        if (result?.error) {
            alert("Payment window error")
            return
        }

        const verifyRes = await fetch(`${BASE_URL}/premium/verify-payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ orderId: data.orderId })
        })

        const verifyData = await verifyRes.json()

        if (verifyData.success) {
            alert("Transaction Successful")

            // updated premium token from backend
            if (verifyData.token) {
                authToken = verifyData.token
                localStorage.setItem("token", verifyData.token)
            }

            showPremiumUI()
        } else {
            alert("TRANSACTION FAILED")
        }

    } catch (error) {
        console.error(error)
        alert("Something went wrong")
    }
})



async function handleLeaderboard() {
    try {
        const response = await fetch(`${BASE_URL}/premium/leaderboard`, {
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        })

        const data = await response.json()

        const tableBody = document.getElementById('expense-table-body')
        const emptyMessage = document.querySelector('.table-container span')

        tableBody.innerHTML = ''
        emptyMessage.style.display = 'none'

        data.forEach((expense, index) => {
            const row = document.createElement('tr')

            row.innerHTML = `
                <td>#${index + 1} - ${expense.name}</td>
                <td><span class="category-tag">${expense.category}</span></td>
                <td class="align-right">$${expense.amount}</td>
                <td class="align-right">${expense.description}</td>
            `

            tableBody.appendChild(row)
        })

    } catch (error) {
        console.log(error)
    }
}



window.addEventListener("DOMContentLoaded", () => {
    if (!authToken) return

    showApp()

    const decoded = parseJwt(authToken)

    if (decoded?.isPremiumUser) {
        showPremiumUI()
    }

    fetchAndDisplayExpenses()
})