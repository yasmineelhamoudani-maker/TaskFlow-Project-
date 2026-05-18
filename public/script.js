const listElement = document.getElementById('taskList');

let localTasks = JSON.parse(localStorage.getItem('tasks_backup')) || [];
let localActivities = JSON.parse(localStorage.getItem('activities_backup')) || [
    { createdAt: new Date().toISOString(), details: "La tâche \"Connexion réussie\" a été ajoutée." }
];


async function fetchTasks() {
    try {
        const res = await fetch('/api/tasks');
        if (!res.ok) throw new Error("404"); 
        
        const tasks = await res.json();
        renderTasks(tasks);
        await updateDashboard(tasks);
    } catch (err) {
        console.warn("Mode démo activé (Sert les données localement)");
        renderTasks(localTasks);
        renderLocalDashboard();
    }
}

function renderTasks(tasks) {
    if (!listElement) return;
    if (!Array.isArray(tasks) || tasks.length === 0) {
        listElement.innerHTML = `<div class="no-tasks" style="color: #888; text-align: center; padding: 10px;">Aucune tâche pour le moment</div>`;
        return;
    }

    listElement.innerHTML = tasks.map((t, index) => {
        const textStyle = t.completed ? 'text-decoration: line-through; color: #94a3b8;' : '';
        const completeBtn = !t.completed 
            ? `<button class="complete-btn" style="background-color: #22c55e; color: white; border: none; padding: 6px 12px; margin-right: 8px; border-radius: 4px; cursor: pointer;" onclick="completeTask('${t._id || index}', ${index})">Terminer</button>` 
            : `<span style="color: #22c55e; font-weight: bold; margin-right: 12px; display: inline-flex; align-items: center;">🟢 Complétée</span>`;

        return `
            <div class="task-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #e2e8f0; ${t.completed ? 'background-color: #f8fafc;' : ''}">
                <div class="task-info" style="${textStyle}">
                    <h3 style="margin: 0 0 4px 0; font-size: 1.1rem;">${t.title || "Tâche sans titre"}</h3>
                    <p style="margin: 0; font-size: 0.9rem; color: #64748b;">${t.description || "Aucune description"}</p>
                </div>
                <div class="task-actions" style="display: flex; align-items: center;">
                    ${completeBtn}
                    <button class="delete-btn" style="background-color: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;" onclick="deleteTask('${t._id || index}', ${index})">Supprimer</button>
                </div>
            </div>
        `;
    }).join('');
}


async function addTask() {
    const titleInput = document.getElementById('taskTitle');
    const descInput = document.getElementById('taskDesc');
    if (!titleInput) return;

    const title = titleInput.value.trim();
    const description = descInput ? descInput.value.trim() : "";
    if (!title) return;

    
    const newTask = { title, description, completed: false };
    localTasks.unshift(newTask);
    localActivities.unshift({ createdAt: new Date().toISOString(), details: `La tâche "${title}" a été ajoutée.` });
    
    localStorage.setItem('tasks_backup', JSON.stringify(localTasks));
    localStorage.setItem('activities_backup', JSON.stringify(localActivities));

    titleInput.value = '';
    if (descInput) descInput.value = '';

    renderTasks(localTasks);
    renderLocalDashboard();
    fetchActivities();
}


async function completeTask(id, index) {
    if (localTasks[index]) {
        localTasks[index].completed = true;
        localActivities.unshift({ createdAt: new Date().toISOString(), details: `La tâche "${localTasks[index].title}" a été marquée comme complétée.` });
        localStorage.setItem('tasks_backup', JSON.stringify(localTasks));
        localStorage.setItem('activities_backup', JSON.stringify(localActivities));
        renderTasks(localTasks);
        renderLocalDashboard();
        fetchActivities();
    }
}


async function deleteTask(id, index) {
    if (!confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;
    localTasks.splice(index, 1);
    localActivities.unshift({ createdAt: new Date().toISOString(), details: "Une tâche a été supprimée." });
    localStorage.setItem('tasks_backup', JSON.stringify(localTasks));
    localStorage.setItem('activities_backup', JSON.stringify(localActivities));
    renderTasks(localTasks);
    renderLocalDashboard();
    fetchActivities();
}


function renderLocalDashboard() {
    const total = localTasks.length;
    const completed = localTasks.filter(t => t.completed).length;
    const pending = total - completed;

    document.querySelectorAll('#statTotal').forEach(el => el.textContent = total);
    document.querySelectorAll('#statCompleted').forEach(el => el.textContent = completed);
    document.querySelectorAll('#statPending').forEach(el => el.textContent = pending);
}


async function fetchActivities() {
    const activityLog = document.getElementById('activityLog');
    if (!activityLog) return;

    activityLog.innerHTML = localActivities.map(act => {
        const date = new Date(act.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        return `
            <div style="padding: 4px 0; border-bottom: 1px dashed #f1f5f9; text-align: left; font-size: 13px;">
                <strong style="color: #475569;">[${date}]</strong> ${act.details}
            </div>
        `;
    }).join('');
}


fetchTasks();
fetchActivities();