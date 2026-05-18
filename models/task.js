const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  priorite: { 
    type: String 
  },
  status: { 
    type: String, 
    default: 'à faire' 
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Projet', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);