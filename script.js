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


//============ F7 — brouillons ============

function saveDraft(projectId, formData) {
  localStorage.setItem(`draft_${projectId}`, JSON.stringify(formData));
}

function loadDraft(projectId) {
  const draft = localStorage.getItem(`draft_${projectId}`);
  return draft ? JSON.parse(draft) : null;
}

function deleteDraft(projectId) {
  localStorage.removeItem(`draft_${projectId}`);
}

function initTaskForm(projectId) {
  const form = document.getElementById('task-form');
  if (!form) return;

  const draft = loadDraft(projectId);
  if (draft) {
    const restore = confirm("Un brouillon existe. Voulez-vous le restaurer ?");
    if (restore) {
      document.getElementById('task-title').value = draft.title || '';
      document.getElementById('task-priority').value = draft.priority || 'moyenne';
    } else {
      deleteDraft(projectId);
    }
  }

  form.addEventListener('input', () => {
    const formData = {
      title: document.getElementById('task-title').value,
      priority: document.getElementById('task-priority').value,
    };
    saveDraft(projectId, formData);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    deleteDraft(projectId);
  });
}

// ============ F10 — notifications ============

let notificationsCache = [];

async function fetchNotifications() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    });
    notificationsCache = response.data;
    updateBadge();
    archiveReadNotifications();
  } catch (error) {
    console.error("Erreur notifications:", error);
  }
}

function updateBadge() {
  const unread = notificationsCache.filter(n => !n.isRead).length;
  const badge = document.getElementById('notification-badge');
  if (badge) {
    badge.textContent = unread > 0 ? unread : '';
    badge.style.display = unread > 0 ? 'inline' : 'none';
  }
}

async function markAsRead(notificationId) {
  try {
    const token = localStorage.getItem('token');
    await axios.patch(`/api/notifications/${notificationId}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    notificationsCache = notificationsCache.map(n =>
      n._id === notificationId ? { ...n, isRead: true } : n
    );
    updateBadge();
    archiveReadNotifications();
  } catch (error) {
    console.error("Erreur:", error);
  }
}

function archiveReadNotifications() {
  const readNotifs = notificationsCache.filter(n => n.isRead);
  localStorage.setItem('archivedNotifications', JSON.stringify(readNotifs));
}

// Polling toutes les 30 secondes
setInterval(fetchNotifications, 30000);
fetchNotifications();
