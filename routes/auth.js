const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// 1. Register
router.post('/register', async (req, res) => {
    try {
        const { nom, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Utilisateur déjà existant' });

        // تشفير الباسورد هنا (مرة واحدة فقط)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            nom,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Utilisateur non trouvé !" });

        // مقارنة الباسورد
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        const payload = { userId: user.id };
        
        // التعديل هنا: كنخدموا بالـ JWT_SECRET اللي في الـ .env باش يتطابق مع الـ Middleware
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1h' });

        res.json({ message: "Connexion réussie !", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;