const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login request:', { username, password });  // Log the input

  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);  // Log the error
      return res.status(500).send(err);
    }

    console.log('Query results:', results);  // Log the query results

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    res.json({ role: user.role });
  });
});

module.exports = router;
