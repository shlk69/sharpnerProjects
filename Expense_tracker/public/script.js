const BASE_URL = 'http://localhost:8000'

// Stores the JWT token for the duration of the session
let authToken = null

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
const premiumBtn = document.getElementById("buy-membership-btn");


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
            // Store the JWT token — userId is encrypted inside it
            authToken = result.token

            alert('User logged in successfully!')

            loginWrapper.classList.remove('show')
            loginWrapper.classList.add('hide')
            expenseWrapper.classList.remove('hide')
            expenseWrapper.classList.add('show')

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
            // No userId here — the server reads it from the token
        }

        const response = await fetch(`${BASE_URL}/expenses/add-expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`   // JWT sent in header
            },
            body: JSON.stringify(expenseData)
        })
        const result = await response.json()
        if (response.ok) {
            alert('Expense created successfully')
            expenseForm.reset()
            fetchAndDisplayExpenses()
        } else {
            alert('Something went wrong!, try again after some time')
            console.log(result.error)
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
                'Authorization': `Bearer ${authToken}`   // JWT sent in header
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
                            'Authorization': `Bearer ${authToken}`   // JWT sent in header
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





// const premiumBtn = document.getElementById("buy-membership-btn");

premiumBtn.addEventListener("click", async () => {
    try {
        const response = await fetch(`${BASE_URL}/premium/create-order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });

        const data = await response.json();
        console.log("create-order response:", data);

        if (!response.ok || !data.paymentSessionId) {
            alert("Unable to create payment order");
            return;
        }

        const cashfree = Cashfree({ mode: "sandbox" });

        const result = await cashfree.checkout({
            paymentSessionId: data.paymentSessionId,
            redirectTarget: "_modal"
        });

        console.log("checkout result:", result);

        // user closed / sdk error
        if (result?.error) {
            alert("Payment window error");
            return;
        }

        // verify only after checkout attempt
        const verifyRes = await fetch(`${BASE_URL}/premium/verify-payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ orderId: data.orderId })
        });

        const verifyData = await verifyRes.json();
        console.log("verify response:", verifyData);

        if (verifyData.success) {
            alert("Transaction Successful");
            premiumBtn.innerText = "👑 Premium User";
            premiumBtn.disabled = true;
        } else {
            alert("TRANSACTION FAILED");
        }

    } catch (error) {
        console.error(error);
        alert("Something went wrong");
    }
});