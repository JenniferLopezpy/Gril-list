// Conexión: Este archivo se carga desde el HTML y proporciona toda la funcionalidad de la app

// Elementos del DOM
const form = document.getElementById("form");
const input = document.getElementById("input");
const todosList = document.getElementById("todos");

// Conexión: Registro del Service Worker para la PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(registration => {
        console.log("ServiceWorker registration successful with scope: ", registration.scope);
      })
      .catch(error => {
        console.log("ServiceWorker registration failed: ", error);
      });
  });
}

// Actualiza el almacenamiento local con los todos actuales
const updateLocalStorage = () => {
  const todosElements = document.querySelectorAll("li");
  const todos = [];
  
  todosElements.forEach((todoElement) => {
    todos.push({
      text: todoElement.querySelector("span").innerText,
      completed: todoElement.classList.contains("completed"),
    });
  });
  
  localStorage.setItem("todos", JSON.stringify(todos));
};

// Añade un nuevo todo al DOM y al almacenamiento local
const addTodo = (todo) => {
  let todoText = input.value.trim();
  if (todo) todoText = todo.text;
  
  if (todoText) {
    const todoElement = document.createElement("li");
    todoElement.setAttribute("role", "listitem");

    // Crear elemento de texto
    const textSpan = document.createElement("span");
    textSpan.innerText = todoText;

    // Crear icono de verificación
    const checkIcon = document.createElement("span");
    checkIcon.innerHTML = "✔️";
    checkIcon.classList.add("check-icon");
    checkIcon.setAttribute("aria-hidden", "true");
    checkIcon.style.display = todo && todo.completed ? "inline" : "none";

    // Marcar como completado si es necesario
    if (todo && todo.completed) {
      todoElement.classList.add("completed");
    }

    // Ensamblar el elemento
    todoElement.appendChild(textSpan);
    todoElement.appendChild(checkIcon);

    // Evento para marcar como completado
    todoElement.addEventListener("click", () => {
      todoElement.classList.toggle("completed");
      checkIcon.style.display = todoElement.classList.contains("completed") ? "inline" : "none";
      updateLocalStorage();
    });

    // Evento para eliminar (clic derecho)
    todoElement.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      todoElement.remove();
      updateLocalStorage();
    });

    // Añadir a la lista y limpiar input
    todosList.appendChild(todoElement);
    input.value = "";
    input.focus();
    updateLocalStorage();
  }
};

// Cargar todos del almacenamiento local al iniciar
const loadTodos = () => {
  const todos = JSON.parse(localStorage.getItem("todos"));
  if (todos) {
    todos.forEach((todo) => addTodo(todo));
  }
};

// Evento para enviar el formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo();
});

// Inicializar la aplicación
loadTodos();

// Conexión: Este archivo interactúa con:
// 1. El HTML a través del DOM
// 2. El Service Worker para la PWA
// 3. El localStorage para persistencia de datos
