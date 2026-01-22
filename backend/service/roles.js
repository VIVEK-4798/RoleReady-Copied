const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * GET /roles/:role_id/skills
 * Returns skills mapped to a role
 */
router.get("/:role_id/skills", (req, res) => {
  const { role_id } = req.params;

  const query = `
    SELECT 
      s.skill_id,
      s.name,
      s.category,
      rs.importance,
      rs.weight
    FROM role_skills rs
    JOIN skills s ON rs.skill_id = s.skill_id
    WHERE rs.role_id = ?
    ORDER BY rs.weight DESC
  `;

  db.query(query, [role_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching role skills" });
    }

    res.json(results);
  });
});

module.exports = router;
