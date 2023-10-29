const taskInput = document.getElementById('task');
const dueDateInput = document.getElementById('due-date');
const imageInput = document.getElementById('image');
const searchInput = document.getElementById('search');
const showCompletedCheckbox = document.getElementById('show-completed');
const sortSelect = document.getElementById('sort-select');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTask() {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const image = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : '';
    if (taskText) {
        const task = { text: taskText, dueDate, image, completed: false };
        tasks.push(task);
        updateTaskList();
        taskInput.value = '';
        dueDateInput.value = '';
        imageInput.value = '';
    }
}

function editTask(index) {
const task = tasks[index];
const newTaskText = prompt("Edit task:", task.text);
if (newTaskText !== null) {
task.text = newTaskText;
updateTaskList();
}
}




function updateTaskList() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    const searchText = searchInput.value.toLowerCase();
    const showCompleted = showCompletedCheckbox.checked;
    const sortBy = sortSelect.value;
    const filteredTasks = tasks.filter(task => {
        const taskText = task.text.toLowerCase();
        return (showCompleted || !task.completed) && taskText.includes(searchText);
    });

    if (sortBy === 'asc') {
        filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === 'desc') {
        filteredTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    }

    taskList.innerHTML = '';
    filteredTasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `

            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <img src="${task.image}" alt="Task Image" style="max-width: 100px; max-height: 100px;">
                    <span>${task.text} (Due: ${task.dueDate})</span>
                </div>
                <div>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleCompleted(${index})">
                    <button class="btn btn-danger" onclick="removeTask(${index})">   
                        Remove

                    </button>
                    <button class="btn btn-primary" onclick="editTask(${index})">Edit</button>

                </div>
            </div>
        `;
        taskList.appendChild(listItem);
    });
}

function toggleCompleted(index) {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
}

function removeTask(index) {
    tasks.splice(index, 1);
    updateTaskList();
}

updateTaskList();
