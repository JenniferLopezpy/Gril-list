const form = document.getElementById("form");
const input = document.getElementById("input");
const todosList = document.getElementById("todos");
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(reg => console.log("Service Worker registered"))
      .catch(err => console.log("Service Worker failed", err));
  });
}
const createTodoElement = (text, completed = false) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <span>${text}</span>
    <div class="task-actions">
      <span class="trash-icon">🗑️</span>
    </div>
  `;
  if (completed) {
    li.classList.add("completed");
    li.querySelector(".trash-icon").insertAdjacentHTML('beforebegin', '<span class="check-icon">✔️</span>');
  }

  li.addEventListener("click", (e) => {
    if (!e.target.classList.contains("trash-icon")) {
      li.classList.toggle("completed");
      updateIcons(li);
      updateLocalStorage();
    }
  });

  li.querySelector(".trash-icon").addEventListener("click", () => {
    li.remove();
    updateLocalStorage();
  });

  return li;
};

const updateIcons = (li) => {
  const actions = li.querySelector(".task-actions");
  actions.innerHTML = li.classList.contains("completed") 
    ? '<span class="check-icon">✔️</span><span class="trash-icon">🗑️</span>' 
    : '<span class="trash-icon">🗑️</span>';
};

const updateLocalStorage = () => {
  const todos = Array.from(document.querySelectorAll('.todos li')).map(li => ({
    text: li.querySelector('span:first-child').innerText,
    completed: li.classList.contains('completed')
  }));
  localStorage.setItem('todos', JSON.stringify(todos));
};

form.addEventListener('submit', e => {
  e.preventDefault();
  const taskText = input.value.trim();
  if (taskText) {
    const li = createTodoElement(taskText);
    todosList.prepend(li); 
    input.value = "";
    updateLocalStorage();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  savedTodos.forEach(todo => {
    todosList.appendChild(createTodoElement(todo.text, todo.completed));
  });
});

form.addEventListener("submit", e => {
  e.preventDefault();
  if (input.value.trim()) {
    todosList.appendChild(createTodoElement(input.value.trim()));
    input.value = "";
    updateLocalStorage();
  }
});
