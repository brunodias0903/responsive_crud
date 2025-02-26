import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import sqlite3 from "sqlite3";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("mydatabase.db", (err) => {
  if (err) console.error("❌ Error connecting to SQLite:", err);
  else console.log("✅ SQLite database connected successfully!");
});

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
  );
  console.log("✅ 'users' table verified/created successfully.");
});

app.post("/users", (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: "❌ Name is required!" });
    return;
  }

  const sql = "INSERT INTO users (name) VALUES (?)";
  db.run(sql, [name], function (err) {
    if (err) {
      console.error("❌ Error inserting user:", err);
      return res.status(500).json({ message: "❌ Error saving to database." });
    }
    res.json({ message: "✅ User saved successfully!", id: this.lastID });
  });
});

app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching users:", err);
      return res.status(500).json({ message: "❌ Error fetching users." });
    }
    res.json(rows);
  });
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: "❌ Name is required!" });
    return;
  }

  const sql = "UPDATE users SET name = ? WHERE id = ?";
  db.run(sql, [name, id], function (err) {
    if (err) {
      console.error("❌ Error updating user:", err);
      return res.status(500).json({ message: "❌ Error updating user." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "❌ User not found." });
    }
    res.json({ message: "✅ User updated successfully!" });
  });
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM users WHERE id = ?";
  db.run(sql, [id], function (err) {
    if (err) {
      console.error("❌ Error deleting user:", err);
      return res.status(500).json({ message: "❌ Error deleting user." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "❌ User not found." });
    }
    res.json({ message: "✅ User deleted successfully!" });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
