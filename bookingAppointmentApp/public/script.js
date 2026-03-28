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
        contactNumber: document.getElementById("contact").value
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
        console.error("Submit error:", err);
    }
});

async function loadData() {
    try {
        const res = await fetch(API);
        const json = await res.json();
        const users = json.data;

        list.innerHTML = "";

        if (!users || users.length === 0) {
            list.innerHTML = "<li>No appointments found.</li>";
            return;
        }

        users.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${item.name}</strong> | ${item.email} | ${item.contactNumber}
                <br/>
                <button onclick="editItem(${item.id}, '${item.name}', '${item.email}', '${item.contactNumber}')">Edit</button>
                <button onclick="deleteItem(${item.id})">Delete</button>
            `;
            list.appendChild(li);
        });
    } catch (err) {
        console.error("loadData error:", err);
    }
}

async function deleteItem(id) {
    if (!confirm("Are you sure?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadData();
}

function editItem(id, name, email, contactNumber) {
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("contact").value = contactNumber;
    editId = id;
}