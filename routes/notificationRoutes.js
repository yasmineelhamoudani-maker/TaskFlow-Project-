const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const Notification = require('../models/notification');

// Récupérer les notifications de l'utilisateur connecté
router.get('/', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.userId })
            .sort({ date: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ msg: 'Erreur serveur' });
    }
});

// Marquer comme lu
router.patch('/:id/read', auth, async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ msg: 'Notification marquée comme lue' });
    } catch (err) {
        res.status(500).json({ msg: 'Erreur serveur' });
    }
});

module.exports = router;