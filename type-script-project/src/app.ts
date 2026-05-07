interface Task {
  id: number;
  name: string;
  dueDate: string;
  completed: boolean;
}

const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const dueDateInput = document.getElementById("dueDate") as HTMLInputElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const taskList = document.getElementById("taskList") as HTMLUListElement;

let tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");

function saveTasks(): void {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(): void {
  taskList.innerHTML = "";

  tasks.forEach((task: Task) => {
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

function addTask(): void {
  const name = taskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!name || !dueDate) {
    alert("Please fill all fields");
    return;
  }

  const newTask: Task = {
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

function toggleTask(id: number): void {
  tasks = tasks.map((task: Task) => {
    if (task.id === id) {
      task.completed = !task.completed;
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(id: number): void {
  tasks = tasks.filter((task: Task) => task.id !== id);

  saveTasks();
  renderTasks();
}

addBtn.addEventListener("click", addTask);

taskList.addEventListener("click", (e: Event) => {
  const target = e.target as HTMLElement;

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
