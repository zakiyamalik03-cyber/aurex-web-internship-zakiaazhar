// ===== Week 3: Task Manager (Part 1) =====
// Features: add task, show tasks, delete task, mark task as completed, basic validation.
// Tasks are kept in an array (in memory only). localStorage comes in Week 4.

// 1. Data: an array of task objects, for example { id: 1, text: "Study", completed: false }
let tasks = [];
let nextId = 1;

// 2. Get the HTML elements we need
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const message = document.getElementById("message");
const counter = document.getElementById("counter");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

// 3. Show a message to the user (type is "error" or "success")
function showMessage(text, type) {
  message.textContent = text;
  message.className = type;
}

// 4. Validation: returns an error text, or "" if the task is fine
function validateTask(text) {
  const trimmed = text.trim();

  if (trimmed === "") {
    return "Please write a task before adding it.";
  }
  if (trimmed.length < 3) {
    return "The task must be at least 3 characters long.";
  }
  if (trimmed.length > 60) {
    return "The task must be 60 characters or fewer.";
  }

  const isDuplicate = tasks.some(task => task.text.toLowerCase() === trimmed.toLowerCase());
  if (isDuplicate) {
    return "This task is already in your list.";
  }

  return "";
}

// 5. Add a task to the array
function addTask(text) {
  const newTask = {
    id: nextId,
    text: text.trim(),
    completed: false
  };
  nextId++;
  tasks.push(newTask);
}

// 6. Delete a task: keep every task except the one with this id
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
}

// 7. Mark a task as completed (or not completed again)
function toggleTask(id) {
  for (const task of tasks) {
    if (task.id === id) {
      task.completed = !task.completed;
    }
  }
}

// 8. Show all tasks on the page
function render() {
  taskList.innerHTML = "";

  for (const task of tasks) {
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

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete "${task.text}"`);
    deleteButton.addEventListener("click", () => {
      deleteTask(task.id);
      render();
      showMessage("Task deleted.", "success");
    });

    li.append(checkbox, text, deleteButton);
    taskList.appendChild(li);
  }

  // Counter and "no tasks" message
  const completedCount = tasks.filter(task => task.completed).length;
  counter.textContent = `${completedCount} of ${tasks.length} tasks completed`;
  emptyMessage.hidden = tasks.length > 0;
  counter.hidden = tasks.length === 0;
}

// 9. When the form is submitted
form.addEventListener("submit", event => {
  event.preventDefault();               // stop the page from reloading

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

// 10. Show the empty state when the page opens
render();
