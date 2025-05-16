const express = require('express');
const db = require('../db');
const router = express.Router();

router.get("/", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).jason({error: "not authenticated"});
    }
    db.all("SELECT * FROM journal WHERE userId = ?", [req.user.id], (err, jpurnals) => {
        if (err) {
            console.error("Error fetching journals:", err);
            return res.status(500).json({ error: "Failed to fetch journals" });
        }
        res.json(journals);
    });
}
);