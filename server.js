require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// 1. Définition du PORT au tout début
const PORT = process.env.PORT || 5000;

// 2. Middlewares de base
app.use(cors());

app.use(express.static('public'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projet', require('./routes/projet'));
app.use(express.json());
app.use(express.static('public'));

// 3. Configuration de Nodemailer (SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ Connection SMTP failed: ", error.message);
  } else {
    console.log("✅ Gmail SMTP Server is ready to send messages!");
  }
});

// 4. Les Routes unifiées (sans doublons)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projet', require('./routes/projet'));
app.use('/api/tasks', require('./routes/tasks')); 
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/', (req, res) => {
    res.send("Serveur TaskFlow Opérationnel");
});

// 5. Une seule connexion à MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskflow";
mongoose.connect(mongoURI)
    .then(() => {
        console.log("✅ Connexion à MongoDB réussie !");
    })
    .catch(err => {
        console.error("❌ Erreur de connexion MongoDB :", err);
    });

// 6. Un seul démarrage du serveur (Listen)
app.listen(PORT, () => {
    console.log(`✅ Serveur running on port ${PORT}`);
});

