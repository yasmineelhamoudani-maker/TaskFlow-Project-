const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const dashboardRoutes = require('./routes/dashboardRoutes');

dotenv.config();
const app = express();


app.use(cors()); 
app.use(express.json());


app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/task')); 
app.use('/api/dashboard', dashboardRoutes);
app.get('/', (req, res) => res.send("Serveur TaskFlow Opérationnel"));


const mongoURI = "mongodb://127.0.0.1:27017/TaskFlow";
mongoose.connect(mongoURI)
    .then(() => {
        console.log('✅ Connexion à MongoDB Locale réussie !');
        if (!app.listening) {
            app.listen(5000, () => console.log("✅ Serveur running on port 5000"));
        }
    })
    .catch(err => console.error('❌ Erreur MongoDB Atlas :', err));