const Activity = require('../models/Activity');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/task'); 


router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({}).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Erreur GET" });
    }
});


router.post('/', async (req, res) => {
    try {
        const { title, description, deadline } = req.body; 
        if (!title) return res.status(400).json({ message: "Titre requis" });

        const taskData = {
            title: title,
            description: description || "Pas de description", 
            completed: false,
            deadline: deadline ? new Date(deadline) : null, 
            userId: new mongoose.Types.ObjectId(), 
            user: new mongoose.Types.ObjectId()
        };

        const result = await mongoose.connection.collection('tasks').insertOne(taskData);
        
        await mongoose.connection.collection('activities').insertOne({
            action: "Création",
            details: `La tâche "${title}" a été ajoutée.`,
            createdAt: new Date()
        });

        res.status(201).json({ _id: result.insertedId, ...taskData });
    } catch (err) {
        console.error("❌ Erreur POST détaillée :", err.message);
        res.status(500).json({ message: "Erreur serveur lors de l'ajout", error: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskObjectId = new mongoose.Types.ObjectId(taskId);

        const task = await mongoose.connection.collection('tasks').findOne({ _id: taskObjectId });
        const taskTitle = task ? task.title : "sans titre";

        await mongoose.connection.collection('tasks').deleteOne({ _id: taskObjectId });

        await mongoose.connection.collection('activities').insertOne({
            action: "Suppression",
            details: `La tâche "${taskTitle}" a été supprimée.`,
            createdAt: new Date()
        });

        res.json({ message: "Tâche supprimée avec succès" });
    } catch (err) {
        console.error("❌ Erreur DELETE :", err.message);
        res.status(500).json({ message: "Erreur DELETE", error: err.message });
    }
});


router.patch('/:id/complete', async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskObjectId = new mongoose.Types.ObjectId(taskId);

        const task = await mongoose.connection.collection('tasks').findOne({ _id: taskObjectId });
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

        
        await mongoose.connection.collection('tasks').updateOne(
            { _id: taskObjectId },
            { $set: { completed: true } }
        );

        
        await mongoose.connection.collection('activities').insertOne({
            action: "Mise à jour",
            details: `La tâche "${task.title}" a été marquée comme complétée.`,
            createdAt: new Date()
        });

        res.json({ message: "Tâche marquée comme complétée" });
    } catch (err) {
        console.error("❌ Erreur PATCH :", err.message);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
});


router.get('/dashboard', async (req, res) => {
    try {
        const total = await Task.countDocuments();
        const completed = await Task.countDocuments({ completed: true });
        const pending = total - completed;
        
        const now = new Date();
        const overdue = await Task.countDocuments({
            completed: false,
            deadline: { $lt: now, $ne: null }
        });

        res.json({
            totalTasks: total,
            completedTasks: completed,
            pendingTasks: pending,
            overdueTasks: overdue 
        });
    } catch (err) {
        console.error("Erreur Dashboard Backend:", err.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;