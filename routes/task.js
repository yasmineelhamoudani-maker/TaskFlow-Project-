const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth'); 
const Task = require('../models/task');


router.post('/', auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = new Task({
            userId: req.user.userId, 
            title,
            description
        });
        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;