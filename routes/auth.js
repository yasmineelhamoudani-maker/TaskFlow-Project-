const express = require('express');
const router = express.Router();
const User = require('../models/user'); // تأكدي من مسار المجلد models
const jwt = require('jsonwebtoken');

// @route   POST api/auth/register
// @desc    Enregistrer un nouvel utilisateur
router.post('/register', async (req, res) => {
    const { nom, email, password } = req.body;
// Routes
app.use('/api/auth', require('./routes/auth'));
    try {
        // Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "L'utilisateur existe déjà" });
        }

        // Créer une nouvelle instance de l'utilisateur
        user = new User({ nom, email, password });

        // Sauvegarder dans la base de données
        await user.save();

        res.status(201).json({ msg: "Utilisateur créé avec succès !" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erreur du serveur");
    }
});

module.exports = router;