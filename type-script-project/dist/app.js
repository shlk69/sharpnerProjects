const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
        const li = document.createElement("li");
        if (task.completed) {
            li.classList.add("completed");
        }
        li.innerHTML = `
      <div>
        <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}">
        <strong>${task.name}</strong>
        <small>${task.dueDate}</small>
      </div>

      <button data-delete="${task.id}">Delete</button>
    `;
        taskList.appendChild(li);
    });
}
function addTask() {
    const name = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    if (!name || !dueDate) {
        alert("Please fill all fields");
        return;
    }
    const newTask = {
        id: Date.now(),
        name,
        dueDate,
        completed: false,
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
    dueDateInput.value = "";
}
function toggleTask(id) {
    tasks = tasks.map((task) => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });
    saveTasks();
    renderTasks();
}
function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
}
addBtn.addEventListener("click", addTask);
taskList.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLInputElement) {
        const id = Number(target.dataset.id);
        toggleTask(id);
    }
    if (target instanceof HTMLButtonElement) {
        const id = Number(target.dataset.delete);
        deleteTask(id);
    }
});
renderTasks();
export {};
//# sourceMappingURL=app.js.map