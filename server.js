const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware pour lire le JSON 
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.error('Erreur de connexion MongoDB :', err));

// Routes principales
app.use('/api/auth', require('./routes/auth'));

// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Serveur TaskFlow opérationnel !');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});