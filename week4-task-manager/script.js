// ===== Week 4: Task Management Application =====
// Features: add, edit, delete, complete, filter, validation, and saving tasks in localStorage.

const STORAGE_KEY = "aurex-tasks";

// 1. Get the HTML elements we need
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const message = document.getElementById("message");
const counter = document.getElementById("counter");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const clearButton = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter-btn");

// 2. Show a message to the user (type is "error" or "success")
function showMessage(text, type) {
  message.textContent = text;
  message.className = type;
}

// 3. localStorage: read the saved tasks (stored as a JSON text)
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      return [];
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];   // storage is blocked or the saved data is broken
  }
}

// 4. localStorage: save the tasks as a JSON text
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    showMessage("Your tasks could not be saved in this browser.", "error");
  }
}

// 5. Data: an array of task objects, for example { id: 1, text: "Study", completed: false }
let tasks = loadTasks();
let nextId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
let currentFilter = "all";   // "all", "active" or "completed"
let editingId = null;        // id of the task that is being edited

// 6. Validation: returns an error text, or "" if the task is fine
function validateTask(text, ignoreId = null) {
  const trimmed = text.trim();

  if (trimmed === "") {
    return "Please write a task before saving it.";
  }
  if (trimmed.length < 3) {
    return "The task must be at least 3 characters long.";
  }
  if (trimmed.length > 60) {
    return "The task must be 60 characters or fewer.";
  }

  const isDuplicate = tasks.some(task =>
    task.id !== ignoreId && task.text.toLowerCase() === trimmed.toLowerCase()
  );
  if (isDuplicate) {
    return "This task is already in your list.";
  }

  return "";
}

// 7. Add, edit, delete, complete
function addTask(text) {
  tasks.push({ id: nextId, text: text.trim(), completed: false });
  nextId++;
  saveTasks();
}

function editTask(id, newText) {
  const task = tasks.find(item => item.id === id);
  task.text = newText.trim();
  saveTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
}

function toggleTask(id) {
  const task = tasks.find(item => item.id === id);
  task.completed = !task.completed;
  saveTasks();
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
}

// 8. Filter: choose which tasks to show
function getVisibleTasks() {
  if (currentFilter === "active") {
    return tasks.filter(task => !task.completed);
  }
  if (currentFilter === "completed") {
    return tasks.filter(task => task.completed);
  }
  return tasks;
}

// 9. Build one list item for a task that is NOT being edited
function createTaskItem(task) {
  const li = document.createElement("li");
  if (task.completed) {
    li.classList.add("completed");
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `Mark "${task.text}" as completed`);
  checkbox.addEventListener("change", () => {
    toggleTask(task.id);
    render();
  });

  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = task.text;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "edit-btn";
  editButton.textContent = "Edit";
  editButton.setAttribute("aria-label", `Edit "${task.text}"`);
  editButton.addEventListener("click", () => {
    editingId = task.id;
    showMessage("", "");
    render();
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-btn";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete "${task.text}"`);
  deleteButton.addEventListener("click", () => {
    deleteTask(task.id);
    showMessage("Task deleted.", "success");
    render();
  });

  actions.append(editButton, deleteButton);
  li.append(checkbox, text, actions);
  return li;
}

// 10. Build one list item for the task that IS being edited
function createEditItem(task) {
  const li = document.createElement("li");

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "edit-input";
  editInput.value = task.text;
  editInput.setAttribute("aria-label", "Edit task text");

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", () => {
    const error = validateTask(editInput.value, task.id);
    if (error !== "") {
      showMessage(error, "error");
      return;
    }
    editTask(task.id, editInput.value);
    editingId = null;
    showMessage("Task updated.", "success");
    render();
  });

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "cancel-btn";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", () => {
    editingId = null;
    showMessage("", "");
    render();
  });

  actions.append(saveButton, cancelButton);
  li.append(editInput, actions);
  return li;
}

// 11. Show everything on the page
function render() {
  taskList.innerHTML = "";

  const visibleTasks = getVisibleTasks();
  for (const task of visibleTasks) {
    const item = task.id === editingId ? createEditItem(task) : createTaskItem(task);
    taskList.appendChild(item);
  }

  const completedCount = tasks.filter(task => task.completed).length;
  counter.textContent = `${completedCount} of ${tasks.length} tasks completed`;
  counter.hidden = tasks.length === 0;

  if (tasks.length === 0) {
    emptyMessage.textContent = "No tasks yet. Add your first task above.";
  } else if (visibleTasks.length === 0) {
    emptyMessage.textContent = `No ${currentFilter} tasks to show.`;
  } else {
    emptyMessage.textContent = "";
  }
  emptyMessage.hidden = emptyMessage.textContent === "";

  clearButton.hidden = completedCount === 0;

  for (const button of filterButtons) {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

// 12. Events
form.addEventListener("submit", event => {
  event.preventDefault();

  const error = validateTask(input.value);
  if (error !== "") {
    showMessage(error, "error");
    return;
  }

  addTask(input.value);
  input.value = "";
  input.focus();
  showMessage("Task added.", "success");
  render();
});

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    render();
  });
}

clearButton.addEventListener("click", () => {
  clearCompleted();
  showMessage("Completed tasks removed.", "success");
  render();
});

// 13. Show the saved tasks when the page opens
render();
