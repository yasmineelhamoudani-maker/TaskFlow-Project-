// 1. Déclarations globales des éléments HTML
const listElement = document.getElementById('taskList');

// 2. Récupérer et afficher les tâches
async function fetchTasks() {
    try {
        const res = await fetch('/api/tasks');
        const tasks = await res.json();
        
        if (!listElement) return;
        
        if (!Array.isArray(tasks) || tasks.length === 0) {
            listElement.innerHTML = `<div class="no-tasks" style="color: #888; text-align: center; padding: 10px;">Aucune tâche pour le moment</div>`;
            return;
        }

        listElement.innerHTML = tasks.map(t => {
            const textStyle = t.completed ? 'text-decoration: line-through; color: #94a3b8;' : '';
            
            const completeBtn = !t.completed 
                ? `<button class="complete-btn" style="background-color: #22c55e; color: white; border: none; padding: 6px 12px; margin-right: 8px; border-radius: 4px; cursor: pointer;" onclick="completeTask('${t._id}')">Terminer</button>` 
                : `<span style="color: #22c55e; font-weight: bold; margin-right: 12px; display: inline-flex; align-items: center;">🟢 Complétée</span>`;

            return `
                <div class="task-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #e2e8f0; ${t.completed ? 'background-color: #f8fafc;' : ''}">
                    <div class="task-info" style="${textStyle}">
                        <h3 style="margin: 0 0 4px 0; font-size: 1.1rem;">${t.title || "Tâche sans titre"}</h3>
                        <p style="margin: 0; font-size: 0.9rem; color: #64748b;">${t.description || "Aucune description"}</p>
                    </div>
                    <div class="task-actions" style="display: flex; align-items: center;">
                        ${completeBtn}
                        <button class="delete-btn" onclick="deleteTask('${t._id}')">Supprimer</button>
                    </div>
                </div>
            `;
        }).join('');

        await updateDashboard();

    } catch (err) {
        console.error("Erreur lors du chargement des tâches:", err);
    }
}

// 3. Ajouter une tâche
async function addTask() {
    const titleInput = document.getElementById('taskTitle');
    const descInput = document.getElementById('taskDesc');
    
    if (!titleInput) return;

    const title = titleInput.value.trim();
    const description = descInput ? descInput.value.trim() : "";
    
    if (!title) return;

    try {
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: title,
                description: description
            })
        });

        if (res.ok) {
            titleInput.value = '';
            if (descInput) descInput.value = '';
            await fetchTasks(); 
            await fetchActivities();
        } else {
            console.error("Erreur serveur lors de l'ajout");
        }
    } catch (err) {
        console.error("Erreur connexion:", err);
    }
}

// 4. Marquer une tâche comme complétée
async function completeTask(id) {
    try {
        const res = await fetch(`/api/tasks/${id}/complete`, {
            method: 'PATCH'
        });

        if (res.ok) {
            await fetchTasks();       
            await fetchActivities();  
        }
    } catch (err) {
        console.error("Erreur completeTask:", err);
    }
}

// 5. Supprimer une tâche
async function deleteTask(id) {
    if (!confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;
    try {
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            await fetchTasks(); 
            await fetchActivities();
        }
    } catch (err) {
        console.error("Erreur lors de la suppression:", err);
    }
}

// 6. Mettre à jour le Dashboard
async function updateDashboard() {
    try {
        const res = await fetch('/api/tasks/dashboard');
        const stats = await res.json();
        
        console.log("🟢 Données reçues pour le Dashboard :", stats);

        const elTotal = document.getElementById('statTotal');
        const elCompleted = document.getElementById('statCompleted');
        const elPending = document.getElementById('statPending');

        if (elTotal) elTotal.textContent = stats.totalTasks || 0;
        if (elCompleted) elCompleted.textContent = stats.completedTasks || 0;
        if (elPending) elPending.textContent = stats.pendingTasks || 0;

    } catch (err) {
        console.error("Erreur lors de la mise à jour du dashboard:", err);
    }
}

// 7. Récupérer et afficher l'historique des activités
async function fetchActivities() {
    try {
        const res = await fetch('/api/dashboard/activities'); 
        if (!res.ok) return;
        
        const activities = await res.json();
        const activityLog = document.getElementById('activityLog');

        if (!activityLog) return;

        if (!Array.isArray(activities) || activities.length === 0) {
            activityLog.innerHTML = `<div style="font-style: italic; color: #94a3b8;">Aucune activité enregistrée.</div>`;
            return;
        }

        activityLog.innerHTML = activities.map(act => {
            const date = new Date(act.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            return `
                <div style="padding: 4px 0; border-bottom: 1px dashed #f1f5f9; text-align: left;">
                    <strong style="color: #475569;">[${date}]</strong> ${act.details}
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error("Erreur chargement activités:", err);
    }
}

// 8. Chargement initial au démarrage
fetchTasks();
fetchActivities();