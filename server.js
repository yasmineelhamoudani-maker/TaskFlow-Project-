require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


app.use(cors());

// Les Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projet', require('./routes/projet'));
app.use(express.json());
app.use(express.static('public'));
app.use('/api/tasks', require('./routes/tasks')); 
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;

const nodemailer = require('nodemailer');
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use('/api/auth', require('./routes/auth'));

app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));


app.get('/', (req, res) => {
    res.send("Serveur TaskFlow Opérationnel");
});


const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskflow";

mongoose.connect(mongoURI)
    .then(() => {
        console.log("✅ Connexion à MongoDB réussie !");
    })
    .catch(err => {
        console.error("❌ Erreur de connexion MongoDB :", err);
    });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Serveur running on port ${PORT}`);
});
