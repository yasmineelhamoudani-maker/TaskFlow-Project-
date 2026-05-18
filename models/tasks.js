const express = require('express');
const router = express.Router();
const Task = require('../models/task'); 

// 1. جلب جميع المهام
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur lors du GET" });
    }
});

// 2. إضافة مهمة جديدة - نسخة مرنة ومحمية من الـ 500
router.post('/', async (req, res) => {
    try {
        // كنستخرجو كاع الحقول الممكنة اللي تقدر تصيفطها الواجهة
        const titleValue = req.body && (req.body.title || req.body.name || req.body.text) 
                           ? (req.body.title || req.body.name || req.body.text) 
                           : "Nouvelle tâche";

        // كنقادو الكائن وكنعطيوه قيم افتراضية للحقول الإجبارية
        const newTask = new Task({
            title: titleValue,
            name: titleValue,
            description: req.body && req.body.description ? req.body.description : "Pas de description",
            userId: "65f1a2b3c4d5e6f7a8b9c0d1", // ID افتراضي عشان الموديل ما يرفضش
            user: "65f1a2b3c4d5e6f7a8b9c0d1"
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        // هاد السطر غادي يطبع لينا ف التيرمينال الخطأ الحقيقي إيلا بقات شي حاجة ناقصة
        console.error("❌ الخطأ الدقيق ف الـ Backend هو:", err.message);
        res.status(500).json({ message: "Erreur lors de l'ajout", error: err.message });
    }
});

module.exports = router;