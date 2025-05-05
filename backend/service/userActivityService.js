const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/login-streak/:userId', (req, res) => {
  const userId = req.params.userId;  

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const query = "SELECT date, activity_count FROM login_streaks WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching streak data:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    res.status(200).json(results);
  });
});

router.post('/login-streak', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const query = `
  INSERT INTO login_streaks (user_id, date, activity_count)
  VALUES (?, CURDATE(), 1)
  ON DUPLICATE KEY UPDATE activity_count = activity_count + 1
`;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error updating login streak:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    res.status(200).json({ message: "Login streak updated" });
  });
});


module.exports = router;
