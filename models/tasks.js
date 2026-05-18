
const express = require('express');
const router = express.Router();
const Task = require('../models/task'); 


router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur lors du GET" });
    }
});


router.post('/', async (req, res) => {
    try {
        
        const titleValue = req.body && (req.body.title || req.body.name || req.body.text) 
                           ? (req.body.title || req.body.name || req.body.text) 
                           : "Nouvelle tâche";

        const newTask = new Task({
            title: titleValue,
            name: titleValue,
            description: req.body && req.body.description ? req.body.description : "Pas de description",
            userId: "65f1a2b3c4d5e6f7a8b9c0d1", 
            user: "65f1a2b3c4d5e6f7a8b9c0d1"
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        console.error("❌ Erreur POST detaillee :", err.message);
        res.status(500).json({ message: "Erreur lors de l'ajout", error: err.message });
    }
});

module.exports = router;


if (task.assignedTo) {
    // Logique pour créer une entrée dans le modèle Notification
    await Notification.create({
        user: task.assignedTo,
        message: `Une nouvelle tâche vous a été assignée : ${task.title}`,
        read: false
    });
}


