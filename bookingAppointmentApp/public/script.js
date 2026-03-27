const API = "http://localhost:3000/api/appointments";

const form = document.getElementById("form");
const list = document.getElementById("list");

let editId = null;

window.addEventListener("DOMContentLoaded", loadData);

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        contact: document.getElementById("contact").value
    };

    try {
        if (editId) {
            await fetch(`${API}/${editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            editId = null;
        } else {
            await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        }

        form.reset();
        loadData();
    } catch (err) {
        console.error("Error:", err);
    }
});

// 🔹 Fetch and display data
async function loadData() {
    try {
        const res = await fetch(API);
        const data = await res.json();

        list.innerHTML = "";

        data.forEach(item => {
            const li = document.createElement("li");

            li.innerHTML = `
        <strong>${item.name}</strong> * ${item.email} * ${item.contact}
        <br/>
        <button onclick="editItem(${item.id}, '${item.name}', '${item.email}', '${item.contact}')">Edit</button>
        <button onclick="deleteItem(${item.id})">Delete</button>
      `;

            list.appendChild(li);
        });

    } catch (err) {
        console.error("Fetch error:", err);
    }
}

// 🔹 Delete
async function deleteItem(id) {
    if (!confirm("Are you sure?")) return;

    await fetch(`${API}/${id}`, {
        method: "DELETE"
    });

    loadData();
}

// 🔹 Edit
function editItem(id, name, email, contact) {
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("contact").value = contact;

    editId = id;
}