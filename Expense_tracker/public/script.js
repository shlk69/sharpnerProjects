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
const forgotPassWrapper = document.getElementById('forgotPasswordCard')

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

    // Enable the Monthly Report button for premium users
    const reportBtn = document.getElementById('monthly-report-btn')
    if (reportBtn) {
        reportBtn.disabled = false
        reportBtn.classList.remove('report-btn-disabled')
        reportBtn.classList.add('report-btn-active')
    }

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

    // Show logged-in user's name in the top-left greeting
    const decoded = parseJwt(authToken)
    if (decoded?.name) {
        document.getElementById('greeting-name').textContent = decoded.name
        document.getElementById('greeting-avatar').textContent = decoded.name.charAt(0).toUpperCase()
    }
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

    const submitBtn = expenseForm.querySelector('.submit-btn')
    submitBtn.disabled = true
    submitBtn.textContent = 'Adding...'

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
    } finally {
        submitBtn.disabled = false
        submitBtn.textContent = 'Add Expense'
    }
})


// --- Pagination state ---
const PAGE_SIZE_KEY = 'expense_page_size'
const ALLOWED_PAGE_SIZES = [5, 10, 20, 40]
let itemsPerPage = parseInt(localStorage.getItem(PAGE_SIZE_KEY)) || 10
// Guard: stored value must be one of the allowed options
if (!ALLOWED_PAGE_SIZES.includes(itemsPerPage)) itemsPerPage = 10
let allExpenses = []
let currentPage = 1

async function fetchAndDisplayExpenses() {
    try {
        const response = await fetch(`${BASE_URL}/expenses/all-expenses`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        })

        allExpenses = await response.json()
        currentPage = 1
        renderExpensePage()

    } catch (error) {
        console.error('Error fetching expenses:', error)
        document.querySelector('.table-container span').textContent = 'Failed to load expenses.'
    }
}

function renderExpensePage() {
    const tableBody = document.getElementById('expense-table-body')
    const emptyMessage = document.querySelector('.table-container span')

    if (allExpenses.length === 0) {
        emptyMessage.style.display = 'block'
        tableBody.innerHTML = ''
        renderPagination(0)
        return
    }

    emptyMessage.style.display = 'none'
    tableBody.innerHTML = ''

    const totalPages = Math.ceil(allExpenses.length / itemsPerPage)
    // Clamp currentPage in case the last item on the last page was deleted
    if (currentPage > totalPages) currentPage = totalPages

    const start = (currentPage - 1) * itemsPerPage
    const pageExpenses = allExpenses.slice(start, start + itemsPerPage)

    pageExpenses.forEach(expense => {
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
                    headers: { 'Authorization': `Bearer ${authToken}` }
                })
                const result = await response.json()

                if (response.ok) {
                    // Remove from local array and re-render without a network call
                    allExpenses = allExpenses.filter(e => String(e.id) !== String(id))
                    renderExpensePage()
                } else {
                    alert(result.error)
                }
            } catch (error) {
                console.log('Delete error:', error.message)
            }
        })
    })

    renderPagination(totalPages)
}

function renderPagination(totalPages) {
    // Remove old pagination if it exists
    const old = document.getElementById('pagination-controls')
    if (old) old.remove()

    // Remove old per-page selector if it exists
    const oldSel = document.getElementById('per-page-selector')
    if (oldSel) oldSel.remove()

    // Always render the per-page selector (even on page 1 with few items)
    const selectorRow = document.createElement('div')
    selectorRow.id = 'per-page-selector'
    selectorRow.className = 'per-page-row'

    const label = document.createElement('label')
    label.htmlFor = 'per-page-select'
    label.textContent = 'Rows per page:'
    label.className = 'per-page-label'

    const select = document.createElement('select')
    select.id = 'per-page-select'
    select.className = 'per-page-select'
        ;[5, 10, 20, 40].forEach(size => {
            const opt = document.createElement('option')
            opt.value = size
            opt.textContent = size
            if (size === itemsPerPage) opt.selected = true
            select.appendChild(opt)
        })

    select.addEventListener('change', () => {
        itemsPerPage = parseInt(select.value)
        localStorage.setItem(PAGE_SIZE_KEY, itemsPerPage)
        currentPage = 1   // EDGE CASE: reset to page 1 so user never lands on a now-nonexistent page
        renderExpensePage()
    })

    selectorRow.appendChild(label)
    selectorRow.appendChild(select)
    document.querySelector('.table-container').appendChild(selectorRow)

    if (totalPages <= 1) return

    const container = document.createElement('div')
    container.id = 'pagination-controls'
    container.className = 'pagination'

    // Prev button
    const prevBtn = document.createElement('button')
    prevBtn.className = 'page-btn' + (currentPage === 1 ? ' page-btn-disabled' : '')
    prevBtn.disabled = currentPage === 1
    prevBtn.innerHTML = '&#8592; Prev'
    prevBtn.addEventListener('click', () => { currentPage--; renderExpensePage() })
    container.appendChild(prevBtn)

    // Page number buttons (show a window of 5 around current page)
    const range = getPaginationRange(currentPage, totalPages)
    range.forEach(item => {
        if (item === '...') {
            const dots = document.createElement('span')
            dots.className = 'page-dots'
            dots.textContent = '...'
            container.appendChild(dots)
        } else {
            const btn = document.createElement('button')
            btn.className = 'page-btn' + (item === currentPage ? ' page-btn-active' : '')
            btn.textContent = item
            btn.addEventListener('click', () => { currentPage = item; renderExpensePage() })
            container.appendChild(btn)
        }
    })

    // Next button
    const nextBtn = document.createElement('button')
    nextBtn.className = 'page-btn' + (currentPage === totalPages ? ' page-btn-disabled' : '')
    nextBtn.disabled = currentPage === totalPages
    nextBtn.innerHTML = 'Next &#8594;'
    nextBtn.addEventListener('click', () => { currentPage++; renderExpensePage() })
    container.appendChild(nextBtn)

    // Page info label
    const info = document.createElement('span')
    info.className = 'page-info'
    const start = (currentPage - 1) * itemsPerPage + 1
    const end = Math.min(currentPage * itemsPerPage, allExpenses.length)
    info.textContent = `Showing ${start}–${end} of ${allExpenses.length} expenses`
    container.appendChild(info)

    document.querySelector('.table-container').appendChild(container)
}

function getPaginationRange(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

    if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
    return [1, '...', current - 1, current, current + 1, '...', total]
}



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
            // Save new premium token FIRST before anything else
            if (verifyData.token) {
                authToken = verifyData.token
                localStorage.setItem("token", verifyData.token)
            }

            alert("🎉 Transaction Successful! Welcome to Premium.")

            // Reload so the page reads the fresh premium token from localStorage
            // and enables all premium UI (report button, leaderboard, etc.) cleanly
            location.reload()

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
                Authorization: `Bearer ${authToken}`
            }
        })

        const data = await response.json()

        const tableHead = document.querySelector('thead')
        const tableBody = document.getElementById('expense-table-body')
        const emptyMessage = document.getElementById('empty-state')

        tableHead.innerHTML = `
            <tr>
                <th>Name</th>
                <th class="align-right">Total Expenses</th>
            </tr>
        `

        tableBody.innerHTML = ''
        emptyMessage.style.display = 'none'

        if (!data.length) {
            emptyMessage.innerText = 'No leaderboard data found.'
            emptyMessage.style.display = 'block'
            return
        }

        data.forEach((user, index) => {
            const row = document.createElement('tr')

            row.innerHTML = `
                <td>#${index + 1} - ${user.name}</td>
                <td class="align-right">$ ${user.totalAmount}</td>
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

function backToLoginHandler() {
    loginWrapper.classList.remove('hide')
    loginWrapper.classList.add('show')
    forgotPassWrapper.classList.remove('show')
    forgotPassWrapper.classList.add('hide')
}

function forgotPassHanlder() {
    forgotPassWrapper.classList.remove('hide')
    forgotPassWrapper.classList.add('show')
    loginWrapper.classList.remove('show')
    loginWrapper.classList.add('hide')

}

document.getElementById('sendResetBtn').addEventListener('click', async () => {
    const resetPassEmail = document.getElementById('forgotEmail').value
    const errorBox = document.getElementById('error')
    errorBox.innerHTML = ''

    if (!resetPassEmail) {
        errorBox.style.color = 'red'
        errorBox.innerText = 'Please enter valid email'
        return
    }
    try {
        const response = await fetch(`${BASE_URL}/users/forgotpassword`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ email: resetPassEmail })
        })
        const result = await response.json()
        if (response.ok) {
            errorBox.style.color = 'lightgreen'
            errorBox.innerText = result.message || 'Reset link sent'
        } else {
            errorBox.style.color = 'red'
            errorBox.innerText = result.message || 'Something went wrong'
        }
    } catch (error) {
        console.log(error)

        errorBox.style.color = 'red'
        errorBox.innerText = 'Server error. Try again later.'
    }

});

const resetBtn = document.getElementById('resetSubmitBtn')
const resetErrBox = document.getElementById('resetError')
const resetPassInpt = document.getElementById('newPassword')

document.addEventListener('DOMContentLoaded', async () => {

    const urlParams = new URLSearchParams(window.location.search)
    const resetBox = document.getElementById('resetPasswordCard')
    const loginWrapper = document.querySelector('.login-wrapper')
    const signupWrapper = document.querySelector('.form-container')

    if (urlParams.get('showlogin') === 'true') {
        signupWrapper.classList.add('hide')
        loginWrapper.classList.remove('hide')
        loginWrapper.classList.add('show')
        return
    }

    const id = urlParams.get('id')
    if (!id) return

    try {
        const response = await fetch(`${BASE_URL}/users/resetpassword/${id}`)
        const result = await response.json()

        if (result.valid) {
            if (loginWrapper) loginWrapper.classList.add('hide')
            if (signupWrapper) signupWrapper.classList.add('hide')
            if (expenseWrapper) expenseWrapper.classList.add('hide')
            resetBox.classList.remove('hide')
            resetBox.classList.add('show')
        } else {
            alert(result.message || 'Invalid or already used reset link')
        }
    } catch (error) {
        alert('Server error. Please try again.')
    }
})

resetBtn.addEventListener('click', async () => {
    const newPassword = resetPassInpt.value
    resetErrBox.innerText = ''

    if (!newPassword) {
        resetErrBox.style.color = 'red'
        resetErrBox.innerText = 'Please enter a new password'
        return
    }

    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')

    try {
        const response = await fetch(`${BASE_URL}/users/resetpassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, newPassword })
        })

        const result = await response.json()

        if (response.ok) {
            resetErrBox.style.color = 'lightgreen'
            resetErrBox.innerText = 'Password reset! Redirecting to login...'
            setTimeout(() => {
                window.location.href = window.location.origin + window.location.pathname + '?showlogin=true'
            }, 2000)
        } else {
            resetErrBox.style.color = 'red'
            resetErrBox.innerText = result.error || 'Something went wrong'
        }

    } catch (error) {
        resetErrBox.style.color = 'red'
        resetErrBox.innerText = 'Server error. Try again.'
    }
})



// --- helpers ---

function formatDate(dateStr) {
    const d = new Date(dateStr)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}-${mm}-${yyyy}`
}

function fmt(num) {
    return Number(num).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function getMonthName(monthNum) {
    return new Date(2000, monthNum - 1).toLocaleString('default', { month: 'long' })
}

// --- open/close modal ---

const reportModal = document.getElementById('reportModal')
const reportBtn = document.getElementById('monthly-report-btn')
const closeReportBtn = document.getElementById('closeReportBtn')
const generateBtn = document.getElementById('generateReportBtn')
const downloadPdfBtn = document.getElementById('downloadPdfBtn')
const monthPicker = document.getElementById('reportMonthPicker')

// Default month picker to current month
const today = new Date()
monthPicker.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

reportBtn.addEventListener('click', () => {
    reportModal.classList.remove('hide')
    reportModal.classList.add('flex')
    document.body.style.overflow = 'hidden'
})

closeReportBtn.addEventListener('click', closeReportModal)

reportModal.addEventListener('click', (e) => {
    if (e.target === reportModal) closeReportModal()
})

function closeReportModal() {
    reportModal.classList.add('hide')
    reportModal.classList.remove('flex')
    document.body.style.overflow = ''
}

// --- generate report ---

generateBtn.addEventListener('click', async () => {
    const monthStr = monthPicker.value
    if (!monthStr) {
        alert('Please select a month first')
        return
    }

    const reportContent = document.getElementById('reportContent')
    reportContent.innerHTML = `<div class="report-placeholder"><p>⏳ Loading expenses...</p></div>`

    try {
        const response = await fetch(`${BASE_URL}/expenses/all-expenses`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        })

        if (!response.ok) throw new Error('Failed to fetch expenses')

        const allExpenses = await response.json()

        const [year, month] = monthStr.split('-').map(Number)

        const filtered = allExpenses.filter(e => {
            const d = new Date(e.createdAt)
            return d.getFullYear() === year && (d.getMonth() + 1) === month
        })

        if (!filtered.length) {
            reportContent.innerHTML = `
                <div class="report-placeholder">
                    <p>📭 No expenses found for <strong>${getMonthName(month)} ${year}</strong></p>
                </div>`
            return
        }

        reportContent.innerHTML = buildReportHTML(filtered, year, month)

    } catch (err) {
        document.getElementById('reportContent').innerHTML =
            `<div class="report-placeholder"><p style="color:red">❌ ${err.message}</p></div>`
    }
})

// --- build report HTML ---

function buildReportHTML(expenses, year, month) {
    const monthName = getMonthName(month)
    const now = new Date()
    const timestamp = `${formatDate(now.toISOString())} , ${now.toLocaleTimeString()}`

    // Sort ascending by date
    const sorted = [...expenses].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    // Group by formatted date
    const groups = {}
    sorted.forEach(e => {
        const key = formatDate(e.createdAt)
        if (!groups[key]) groups[key] = []
        groups[key].push(e)
    })

    let mainRows = ''
    let totalIncome = 0
    let totalExpense = 0

    Object.entries(groups).forEach(([date, items]) => {
        let dayIncome = 0
        let dayExpense = 0

        items.forEach(e => {
            const isSalary = e.category === 'Salary'
            const amount = Number(e.amount)

            if (isSalary) {
                dayIncome += amount
                mainRows += `
                <tr>
                    <td>${date}</td>
                    <td>${e.description || '-'}</td>
                    <td>${e.category}</td>
                    <td class="num-cell income-cell">${fmt(amount)}</td>
                    <td class="num-cell"></td>
                </tr>`
            } else {
                dayExpense += amount
                mainRows += `
                <tr>
                    <td>${date}</td>
                    <td>${e.description || '-'}</td>
                    <td>${e.category}</td>
                    <td class="num-cell"></td>
                    <td class="num-cell expense-cell">${fmt(amount)}</td>
                </tr>`
            }
        })

        totalIncome += dayIncome
        totalExpense += dayExpense

        // Day subtotal row
        mainRows += `
        <tr class="day-subtotal-row">
            <td colspan="3"></td>
            <td class="num-cell">${fmt(dayIncome)}</td>
            <td class="num-cell">${fmt(dayExpense)}</td>
        </tr>`
    })

    // Monthly totals row
    mainRows += `
    <tr class="month-total-row">
        <td colspan="3"></td>
        <td class="num-cell">₹ ${fmt(totalIncome)}</td>
        <td class="num-cell red-cell">₹ ${fmt(totalExpense)}</td>
    </tr>
    <tr class="savings-row">
        <td colspan="4" class="savings-label">Savings = ₹ ${fmt(totalIncome - totalExpense)}</td>
        <td></td>
    </tr>`

    // Yearly summary (just selected month)
    const savings = totalIncome - totalExpense
    const yearlyRow = `
    <tr>
        <td>${monthName}</td>
        <td class="num-cell">${fmt(totalIncome)}</td>
        <td class="num-cell">${fmt(totalExpense)}</td>
        <td class="num-cell">${fmt(savings)}</td>
    </tr>`

    const yearlyTotalRow = `
    <tr class="month-total-row">
        <td></td>
        <td class="num-cell">₹ ${fmt(totalIncome)}</td>
        <td class="num-cell red-cell">₹ ${fmt(totalExpense)}</td>
        <td class="num-cell">₹ ${fmt(savings)}</td>
    </tr>`

    // Notes section (all expenses as notes)
    const notesRows = sorted.map(e => `
    <tr>
        <td>${formatDate(e.createdAt)}</td>
        <td>${e.description || '-'}</td>
    </tr>`).join('')

    return `
    <div class="report-body" id="reportBody">

        <h2 class="rep-title">Day to Day Expenses</h2>
        <p class="rep-timestamp">${timestamp}</p>

        <h3 class="rep-year">${year}</h3>
        <h4 class="rep-month">${monthName} ${year}</h4>

        <table class="rep-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Income</th>
                    <th>Expense</th>
                </tr>
            </thead>
            <tbody>${mainRows}</tbody>
        </table>

        <h4 class="rep-section">Yearly Report</h4>
        <table class="rep-table">
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Income</th>
                    <th>Expense</th>
                    <th>Savings</th>
                </tr>
            </thead>
            <tbody>${yearlyRow}${yearlyTotalRow}</tbody>
        </table>

        <h4 class="rep-section">Notes Report ${year}</h4>
        <table class="rep-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>${notesRows}</tbody>
        </table>

    </div>`
}

// --- PDF download ---

downloadPdfBtn.addEventListener('click', async () => {
    const reportBody = document.getElementById('reportBody')
    if (!reportBody) {
        alert('Please generate a report first!')
        return
    }

    downloadPdfBtn.innerText = '⏳ Generating...'
    downloadPdfBtn.disabled = true

    try {
        const canvas = await html2canvas(reportBody, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            logging: false
        })

        const imgData = canvas.toDataURL('image/png')
        const { jsPDF } = window.jspdf
        const pdf = new jsPDF('p', 'mm', 'a4')

        const pageW = pdf.internal.pageSize.getWidth()
        const pageH = pdf.internal.pageSize.getHeight()
        const imgW = canvas.width
        const imgH = canvas.height
        const ratio = pageW / imgW
        const scaledH = imgH * ratio

        let yOffset = 0
        let remaining = scaledH

        while (remaining > 0) {
            pdf.addImage(imgData, 'PNG', 0, -yOffset, pageW, scaledH)
            remaining -= pageH
            yOffset += pageH
            if (remaining > 0) pdf.addPage()
        }

        const picker = document.getElementById('reportMonthPicker')
        const [yr, mo] = picker.value.split('-')
        pdf.save(`expense-report-${getMonthName(Number(mo))}-${yr}.pdf`)

    } catch (err) {
        alert('PDF generation failed: ' + err.message)
    } finally {
        downloadPdfBtn.innerText = '⬇ Download PDF'
        downloadPdfBtn.disabled = false
    }
})