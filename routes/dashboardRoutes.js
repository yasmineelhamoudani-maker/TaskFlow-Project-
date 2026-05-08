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

module.exports = router;