const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
router.put('/:id/assign', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.userId },
      { new: true }
    ).populate('assignedTo', 'name email'); // retourne nom + email sans mot de passe

    res.json(task);
  } catch (err) { res.status(500).json({ msg: 'Erreur serveur' });
  }
});
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, assignedTo, search, page = 1, limit = 5 } = req.query;

    // Construction du filtre de manière conditionnelle
    const filter = {};

    if (status)     filter.status = status;
    if (priority)   filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;// Recherche par mot-clé dans titre ou description ($regex)
    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .skip((page - 1) * limit)
      .limit(Number(limit));
 res.json({
      data:       tasks,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / limit)
    });

  } catch (err) {
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});
router.get('/my-tasks', auth, async (req, res) => {
  try {const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});
module.exports = router;
