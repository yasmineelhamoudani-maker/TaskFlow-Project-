const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const authMiddleware = require('../Middleware/auth');

// GET toutes les notifications de l'utilisateur connecté
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// PATCH marquer une notification comme lue
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

module.exports = router;