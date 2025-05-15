const express = require("express");
const db = require("../db");

const router = express.Router();

// Fetch all to-do items for the logged-in user
router.get("/", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  db.all("SELECT * FROM todos WHERE userId = ?", [req.user.id], (err, todos) => {
    if (err) {
      console.error("Error fetching todos:", err);
      return res.status(500).json({ error: "Failed to fetch todos" });
    }
    res.json(todos);
  });
});

// Add a new to-do item
router.post("/", (req, res) => {
  const { title,deadline,priority } = req.body;
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  db.run(
    "INSERT INTO todos (userId, title, deadline, priority) VALUES (?, ?, ?, ?)",
    [req.user.id, title, deadline, priority || "normal"],
    function (err) {
      if (err) {
        console.error("Error adding to-do:", err);
        return res.status(500).json({ error: "Failed to add to-do" });
      }
      res.status(201).json({ id: this.lastID, title, completed: false, deadline, priority });
    }
  );
});

// Update a to-do item (mark as completed or not)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  db.run(
    "UPDATE todos SET completed = ? WHERE id = ? AND userId = ?",
    [completed, id, req.user.id],
    function (err) {
      if (err) {
        console.error("Error updating to-do:", err);
        return res.status(500).json({ error: "Failed to update to-do" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "To-do not found" });
      }
      res.json({ message: "To-do updated" });
    }
  );
});

// Delete a to-do item
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  db.run(
    "DELETE FROM todos WHERE id = ? AND userId = ?",
    [id, req.user.id],
    function (err) {
      if (err) {
        console.error("Error deleting to-do:", err);
        return res.status(500).json({ error: "Failed to delete to-do" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "To-do not found" });
      }
      res.json({ message: "To-do deleted" });
    }
  );
});

module.exports = router;