
const mongoose = require('mongoose');

const projetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['actif', 'en pause', 'archivé'], 
    default: 'actif' 
  },
  deadline: { type: Date }
}, { timestamps: true });
projetSchema.pre('deleteOne', { document: false, query: true }, async function(next) {
  const query = this.getQuery();
  await mongoose.model('Task').deleteMany({ project: query._id }); 
  next();
});

module.exports = mongoose.model('Projet', projetSchema);