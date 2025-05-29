// routes/users.js
const express = require("express");
const router = express.Router();
const db = require("../db.js");

// POST new user
router.get('/', (req, res) => {
  const read = 'SELECT * FROM account';
  db.query(read, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({user: result[0]});
  })
})

router.post("/", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "User added", result });
    }
  );
});

module.exports = router;
