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
// 5. Fonctionnalité 6 : filtrage, recherche et pagination
router.get("/project/:projectId/filter", auth, async (req, res) => {
  try {
    const { status, priority, assignedTo, search, page, limit } = req.query;

    const filter = {
      project: req.params.projectId
    };
     
    if (status) {
      filter.status = status;
    }

    
    if (priority) {
      filter.priority = priority;
    }

    
    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i"
          }
        },
        {
          description: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 5;
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({ data: tasks,
      total: total,
      page: pageNumber,
      totalPages: totalPages
    });

  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du filtrage des tâches",
      error: error.message
    });
  }
});

module.exports = router;