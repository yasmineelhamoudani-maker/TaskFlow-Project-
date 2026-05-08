const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const newUser = new User({ fullName, email, password });
        await newUser.save();
        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé !" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect !" });
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );

     
        res.status(200).json({ 
            message: "Connexion réussie !",
            token: token, 
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
          
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});


module.exports = router;