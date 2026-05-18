const express = require('express');
const router = express.Router();
const Projet = require('../models/projet');
const Task = require('../models/task'); 
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

// 1. Créer un projet (Version Test - Sans Auth)
router.post('/', async (req, res) => {
  try {
    const User = require('../models/user'); 
    const defaultUser = await User.findOne();
    
    if (!defaultUser) {
      return res.status(404).json({ msg: "Aucun utilisateur trouvé dans la base" });
    }

    const project = await Project.create({ 
      title: req.body.title, 
      owner: defaultUser._id 
    });
    
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur Serveur');
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

// 2. Récupérer les projets
router.get('/', auth, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const projects = await Project.find({ owner: req.user.id })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur Serveur');
  }
});

// 3. Modifier un projet
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur Serveur');
  }
});

// 4. Supprimer un projet
router.delete('/:id', auth, async (gitreq, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!project) return res.status(404).json({ msg: "Projet non trouvé" });
    
    await project.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur Serveur');
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

// ==========================================
// F8: Membres - Envoyer une invitation par email
// ==========================================
router.post('/:id/invite', async (req, res) => { 
  const { email } = req.body;
  const projectId = req.params.id;

  try {
    const project = await Project.findOne({ _id: projectId });
    if (!project) {
      return res.status(404).json({ msg: "Projet non trouvé" });
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: email,
      subject: `Invitation à rejoindre le projet: ${project.title || 'TaskFlow'}`,
      html: `
        <h3>Bonjour,</h3>
        <p>Yasmine (Chef de Projet) vous invite à rejoindre le projet <b>${project.title || 'TaskFlow'}</b></p>
        <p>Cliquez sur le lien ci-dessous pour créer votre compte et participer :</p>
        <a href="http://localhost:3000/register?project=${projectId}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 4px;">Rejoindre le projet</a>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: 'Invitation envoyée avec succès par email !' });

  } catch (err) {
    console.error("Nodemailer error: ", err.message);
    res.status(500).send('Erreur lors de l\'envoi de l\'invitation');
  }
});   

module.exports = router;