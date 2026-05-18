const express = require('express');
const router = express.Router();
const Projet = require('../models/projet');
const Task = require('../models/task'); 
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newProjet = new Projet({ title, description, owner: req.user.id });
    const savedProjet = await newProjet.save();
    res.status(201).json(savedProjet);
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const projets = await Projet.find({ owner: req.user.id });
    res.json(projets);
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur" });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const projetId = req.params.id;

    await Task.deleteMany({ project: projetId });
    const projetDeleted = await Projet.findOneAndDelete({ _id: projetId, owner: req.user.id });

    if (!projetDeleted) {
      return res.status(404).json({ msg: "Projet non trouvé" });
    }

    res.json({ msg: "Projet et ses tâches supprimés avec succès !" });
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
});

module.exports = router;