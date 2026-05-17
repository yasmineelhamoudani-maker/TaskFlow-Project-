
if (task.assignedTo) {
    // Logique pour créer une entrée dans le modèle Notification
    await Notification.create({
        user: task.assignedTo,
        message: `Une nouvelle tâche vous a été assignée : ${task.title}`,
        read: false
    });
}