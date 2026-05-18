
// ============ F7 — Brouillons (الـ LocalStorage) ============
const PROJECT_ID = "smi_s4_project"; 

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
    const titleInput = document.getElementById('taskTitle');
    const descInput = document.getElementById('taskDesc');
    
    if (!form || !titleInput || !descInput) return;

    
    const draft = loadDraft(projectId);
    if (draft) {
        const restore = confirm("Un brouillon existe. Voulez-vous le restaurer ?");
        if (restore) {
            titleInput.value = draft.title || '';
            descInput.value = draft.description || '';
        } else {
            deleteDraft(projectId);
        }
    }

    
    form.addEventListener('input', () => {
        const formData = {
            title: titleInput.value,
            description: descInput.value
        };
        saveDraft(projectId, formData);
    });

    
    form.addEventListener('submit', () => {
        deleteDraft(projectId);
    });
}

// ============ F10 — Notifications ============
let notificationsCache = [];

async function fetchNotifications() {
    try {
        
        if (typeof axios === 'undefined') return; 
        
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
        if (typeof axios === 'undefined') return;
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

initTaskForm(PROJECT_ID);
setInterval(fetchNotifications, 30000);
fetchNotifications();