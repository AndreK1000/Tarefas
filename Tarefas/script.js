// app.js
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Função para obter tarefas da API
    async function fetchTasks() {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const tasks = await response.json();
        tasks.slice(0, 10).forEach(task => addTaskToDOM(task));
    }

    // Função para adicionar tarefa ao DOM
    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.textContent = task.title;
        li.dataset.id = task.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleComplete(task.id));

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => editTask(task.id));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(task.title));
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        if (task.completed) {
            li.classList.add('completed');
        }
        taskList.appendChild(li);
    }

    // Função para marcar tarefa como concluída
    function toggleComplete(id) {
        const taskItem = document.querySelector(`li[data-id='${id}']`);
        taskItem.classList.toggle('completed');
    }

    // Função para editar tarefa
    async function editTask(id) {
        const taskItem = document.querySelector(`li[data-id='${id}']`);
        const newTitle = prompt('Editar tarefa:', taskItem.childNodes[1].textContent);
        if (newTitle) {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ title: newTitle, completed: false }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            });

            const updatedTask = await response.json();
            taskItem.childNodes[1].textContent = updatedTask.title;
        }
    }

    // Função para excluir tarefa
    async function deleteTask(id) {
        await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: 'DELETE'
        });

        const taskItem = document.querySelector(`li[data-id='${id}']`);
        taskList.removeChild(taskItem);
    }

    // Evento de submissão do formulário
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newTask = {
            title: taskInput.value,
            completed: false
        };

        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify(newTask),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });

        const task = await response.json();
        addTaskToDOM(task);
        taskInput.value = '';
    });

    // Carregar tarefas ao iniciar
    fetchTasks();
});
