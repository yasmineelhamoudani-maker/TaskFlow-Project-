const express = require('express');
const router = express.Router();
const Project = require('../models/projet');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const project = await Project.create({ ...req.body, owner: req.user.id });
  res.json(project);
});

router.get('/', auth, async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const projects = await Project.find({ owner: req.user.id })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json(projects);
});

router.put('/:id', auth, async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    req.body,
    { new: true }
  );
  res.json(project);
});

router.delete('/:id', auth, async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
  await project.deleteOne();
  res.json({ message: 'Deleted' });
});

module.exports = router;