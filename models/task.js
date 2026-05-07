const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['À faire', 'En cours', 'Terminé'],
        default: 'À faire'
    },
    dateLimit: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
