const express = require('express');
const db = require('../db');
const router = express.Router();

router.get("/", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "not authenticated" });
    }
    db.all("SELECT * FROM journal WHERE userId = ?", [req.user.id], (err, journals) => {
        if (err) {
            console.error("Error fetching journals:", err);
            return res.status(500).json({ error: "Failed to fetch journals" });
        }
        res.json(journals);
    });
});

router.post("/", (req, res) => {
    const { title, content } = req.body;
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    db.run(
        "INSERT INTO journal (userId, title, content) VALUES (?, ?, ?)",
        [req.user.id, title, content],
        function (err) {
            if (err) {
                console.error("Error adding journal:", err);
                return res.status(500).json({ error: "Failed to add journal" });
            }
            res.status(201).json({ id: this.lastID, title, content });
        }
    );
});

module.exports = router;