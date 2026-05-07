const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth'); 
const Task = require('../models/task');


router.post('/', auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = new Task({
            userId: req.user.id, 
            title,
            description
        });
        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).send('Erreur serveur');
    }
});

router.get('/', auth, async (req, res) => {
    try {
        
        const tasks = await Task.find({ userId: req.user.id });
        return res.json(tasks);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Erreur serveur');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Tâche non trouvée' });
        }

        
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Action non autorisée' });
        }

        await task.deleteOne();
        res.json({ msg: 'Tâche supprimée avec succès' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});
module.exports = router; 