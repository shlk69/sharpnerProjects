const API = "http://localhost:3000/expenses";

const form = document.getElementById('form');
const list = document.getElementById('list');

let editId = null;

window.addEventListener('DOMContentLoaded', loadData);

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const expenseData = {
        expenseName: document.getElementById('name').value,
        expenseAmount: document.getElementById('amount').value,
    };

    try {
        if (editId) {
            await fetch(`${API}/${editId}`, {
                method: 'PUT',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(expenseData)
            });
            editId = null;
        } else {
            await fetch(`${API}/add`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(expenseData)
            });
        }
        form.reset();
        loadData();
    } catch (err) {
        console.log('Submit error:', err);
    }
});

async function loadData() {
    try {
        const res = await fetch(API);
        const expenses = await res.json();

        list.innerHTML = "";
        if (!expenses || expenses.length === 0) {
            list.innerHTML = "<li>No expenses found</li>";
            return;
        }

        expenses.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${item.id}</strong> | ${item.expenseName} | ${item.expenseAmount}
                <br/>
                <button onclick="editItem(${item.id}, '${item.expenseName}', '${item.expenseAmount}')">Edit</button>
                <button onclick="deleteItem(${item.id})">Delete</button>
            `;
            list.appendChild(li);
        });
    } catch (error) {
        console.log('Load data error:', error);
    }
}

async function deleteItem(id) {
    if (!confirm("Are you sure on this!")) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadData();
}

function editItem(id, name, amount) {
    document.getElementById('name').value = name;
    document.getElementById('amount').value = amount;
    editId = id;
}