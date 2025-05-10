const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./lifehub.db", (err) => {
  if (err) console.error("Database connection error:", err);
  else console.log("Connected to SQLite database");
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT,
      firstName TEXT,
      lastName TEXT,
      googleId TEXT UNIQUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;