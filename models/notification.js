const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { // Destinataire de la notification
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: { type: String, required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);

