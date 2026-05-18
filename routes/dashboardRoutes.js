const express = require('express');
const router = express.Router();
const Task = require('../models/task'); 

router.get('/', async (req, res) => {
    try {
        const stats = await Task.aggregate([
            {
                $facet: {
                    "countsByStatus": [
                        { $group: { _id: "$status", total: { $sum: 1 } } }
                    ],
                    "lateTasks": [
                        { 
                            $match: { 
                                status: { $ne: "Terminé" }, 
                                dueDate: { $lt: new Date() } 
                            } 
                        },
                        { $count: "count" }
                    ]
                }
            }
        ]);
        res.json({ success: true, data: stats[0] });
    } catch (err) {
        res.status(500).json({ message: "Erreur", error: err.message });
    }
});

const Activity = require('../models/Activity');



router.get('/activities', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const activities = await mongoose.connection.collection('activities')
            .find()
            .sort({ createdAt: -1 })
            .limit(10)
            .toArray(); 
            
        res.json(activities);
    } catch (err) {
        console.error("❌ Erreur Route activities :", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;