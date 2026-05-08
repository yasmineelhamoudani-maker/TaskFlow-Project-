const API_URL = 'http://localhost:5000/api/tasks';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZmNjNDRiMGRkMzRjMzRmNzQwMjdlMSIsImlhdCI6MTc3ODE4NjYxMiwiZXhwIjoxNzc4MTkwMjEyfQ.EHmZtYU_LxFK2veaBsys-P09DxSfwRGSgU_-R2STVvE';

async function getTasks() {
    try {
        const res = await fetch(API_URL, {
            headers: { 'x-auth-token': TOKEN }
        });
        const tasks = await res.json();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; 
        
        tasks.forEach(task => {
            taskList.innerHTML += `
                <div class="task-item">
                    <div class="task-info">
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                    </div>
                    <button class="delete-btn" onclick="deleteTask('${task._id}')">Supprimer</button>
                </div>`;
        });
    } catch (err) {
        console.error("Erreur de chargement:", err);
    }
}

async function addTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDesc').value;
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': TOKEN },
        body: JSON.stringify({ title, description })
    });
    getTasks(); 
}

getTasks();