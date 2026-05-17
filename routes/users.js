const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const User = require('../models/user');

router.get('/', auth, async (req, res) => {
    try {
        // On récupère tous les utilisateurs sauf le mot de passe
        const users = await User.find().select('nom email');
        res.json(users);
    } catch (err) {
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;