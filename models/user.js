const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Le nom est obligatoire"],
        trim: true
    },
    email: { 
        type: String, 
        required: [true, "L'email est obligatoire"], 
        unique: true 
    },
    password: { 
        type: String, 
        required: [true, "Le mot de passe est obligatoire"] 
    },
    dateCreation: { 
        type: Date, 
        default: Date.now 
    }
});

// Middleware pour hacher le mot de passe avant la sauvegarde
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);