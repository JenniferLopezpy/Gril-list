const form = document.getElementById('form');
const input = document.getElementById('input');
const todosUL = document.getElementById('todos');
const todos = JSON.parse(localStorage.getItem('todos')) || [];

// Crear elementos flotantes dinámicos
function createFloatingElements() {
  const types = ['heart', 'star'];
  const colors = ['#ff6b8b', '#ffd166', '#a5d8ff', '#b5ead7'];
  
  for (let i = 0; i < 8; i++) {
    const element = document.createElement('i');
    const type = types[Math.floor(Math.random() * types.length)];
    element.className = `fas fa-${type} floating-element floating-${type}`;
    element.style.color = colors[Math.floor(Math.random() * colors.length)];
    element.style.fontSize = `${Math.random() * 1 + 0.8}rem`;
    element.style.top = `${Math.random() * 80 + 10}%`;
    element.style.left = `${Math.random() * 80 + 10}%`;
    element.style.animationDuration = `${Math.random() * 3 + 4}s`;
    element.style.animationDelay = `${Math.random() * 2}s`;
    element.style.opacity = Math.random() * 0.4 + 0.3;
    document.body.appendChild(element);
  }
}

// Añadir tareas
function addTodo(todo) {
  let todoText = input.value;
  
  if (todo) {
    todoText = todo.text;
  }
  
  if (todoText) {
    const todoEl = document.createElement('li');
    todoEl.innerHTML = `
      <span>${todoText}</span>
      <div class="task-actions">
        <i class="fas fa-check-circle check-icon"></i>
        <i class="fas fa-trash-alt trash-icon"></i>
      </div>
    `;
    
    if (todo && todo.completed) {
      todoEl.classList.add('completed');
    }
    
    // Marcar como completado
    const checkIcon = todoEl.querySelector('.check-icon');
    checkIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      todoEl.classList.toggle('completed');
      updateLS();
    });
    
    // Eliminar tarea
    const trashIcon = todoEl.querySelector('.trash-icon');
    trashIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      todoEl.remove();
      updateLS();
    });
    
    todosUL.appendChild(todoEl);
    input.value = '';
    updateLS();
  }
}

// Actualizar localStorage
function updateLS() {
  const todosEl = document.querySelectorAll('li');
  const todos = [];
  
  todosEl.forEach(todoEl => {
    todos.push({
      text: todoEl.querySelector('span').innerText,
      completed: todoEl.classList.contains('completed')
    });
  });
  
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Event listeners
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo();
});

// Cargar tareas existentes
if (todos) {
  todos.forEach(todo => addTodo(todo));
}

// Crear elementos flotantes al cargar
window.addEventListener('load', createFloatingElements);
