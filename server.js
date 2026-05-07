const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 

dotenv.config();
const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/task')); 

app.get('/', (req, res) => res.send("Serveur TaskFlow Opérationnel"));

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connexion à MongoDB réussie !');
        app.listen(5000, () => console.log("✅ Serveur sur port 5000"));
    })
    .catch(err => console.error('❌ Erreur MongoDB :', err));