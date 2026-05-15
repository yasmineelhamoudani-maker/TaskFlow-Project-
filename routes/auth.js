const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// @route   POST api/auth/login
// @desc    Authentifier l'utilisateur et obtenir le token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
       
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Utilisateur non trouvé' });
        }

       
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Mot de passe incorrect' });
        }

        const payload = {
            userId: user.id
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'SECRET_KEY_DIP_2026', 
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
               
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;