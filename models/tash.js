const express = require("express");
const router = express.Router();
const Task = require("../models/tasks");
const Project = require("../models/project");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { title, description, status, priority, project, assignedTo } = req.body;
    const newTask = new Task({ title, description, status, priority, project, assignedTo });
    await newTask.save();
    const taskWithUser = await Task.findById(newTask._id)
      .populate("assignedTo", "name email")
      .populate("project", "name");
    res.status(201).json({ message: "Tache creee avec succes", task: taskWithUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur creation tache", error: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("project", "name");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erreur recuperation taches", error: error.message });
  }
});

router.get("/project/:projectId", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email")
      .populate("project", "name");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erreur filtrage taches", error: error.message });
  }
});

module.exports = router;
