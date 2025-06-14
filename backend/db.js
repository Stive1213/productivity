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
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `);
});
db.serialize(() => {
  db.run(`
   CREATE TABLE IF NOT EXISTS journal (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
   
    `);
});
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    frequency_type TEXT NOT NULL,
    target_value INTEGER NOT NULL,
    unit TEXT NOT NULL,
    repeat_count INTEGER NOT NULL,
    custom_days TEXT,
    duration_days INTEGER,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active'
  )
    `)
})
db.serialize(() => {
  db.run(`
   CREATE TABLE IF NOT EXISTS habit_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    completed_repeats INTEGER DEFAULT 0,      -- e.g., 3 out of 4
    progress_percentage REAL DEFAULT 0,       -- e.g., 75.0
    total_value REAL DEFAULT 0,               -- actual value (e.g., 1.5 liters)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(habit_id) REFERENCES habits(id)
);

    `)
})


module.exports = db;