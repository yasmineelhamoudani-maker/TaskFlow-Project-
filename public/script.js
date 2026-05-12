const listElement = document.getElementById('taskList');

async function fetchTasks() {
    const res = await fetch('/api/tasks');
    const tasks = await res.json();
    listElement.innerHTML = tasks.map(t => `
        <div class="task-item">
            <span>${t.title}</span>
        </div>
    `).join('');
}

async function addTask() {
    const title = document.getElementById('taskTitle').value;
    if (!title) return;

    await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, userId: "663f7f0e8f3a5b0015e12345" }) 
    });
    
    document.getElementById('taskTitle').value = '';
    fetchTasks();
}

fetchTasks();