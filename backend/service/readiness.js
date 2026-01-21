const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * POST /readiness/calculate
 * Calculates and stores readiness score for a user against a role
 */
router.post("/calculate", async (req, res) => {
  const { user_id, role_id } = req.body;

  if (!user_id || !role_id) {
    return res.status(400).json({ message: "user_id and role_id are required" });
  }

  try {
    // 1️⃣ Fetch role skills
    const roleSkillsQuery = `
      SELECT rs.skill_id, rs.weight
      FROM role_skills rs
      WHERE rs.role_id = ?
    `;

    db.query(roleSkillsQuery, [role_id], (err, roleSkills) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching role skills" });
      }

      if (roleSkills.length === 0) {
        return res.status(404).json({ message: "No skills defined for this role" });
      }

      // 2️⃣ Fetch user skills
      const userSkillsQuery = `
        SELECT skill_id
        FROM user_skills
        WHERE user_id = ?
      `;

      db.query(userSkillsQuery, [user_id], (err, userSkills) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error fetching user skills" });
        }

        const userSkillSet = new Set(userSkills.map(s => s.skill_id));

        let totalScore = 0;
        const breakdown = [];

        // 3️⃣ Apply scoring logic
        roleSkills.forEach(rs => {
          const hasSkill = userSkillSet.has(rs.skill_id);

          breakdown.push({
            skill_id: rs.skill_id,
            required_weight: rs.weight,
            achieved_weight: hasSkill ? rs.weight : 0,
            status: hasSkill ? "met" : "missing"
          });

          if (hasSkill) {
            totalScore += rs.weight;
          }
        });

        // 4️⃣ Store readiness score
        const insertScoreQuery = `
          INSERT INTO readiness_scores (user_id, role_id, total_score)
          VALUES (?, ?, ?)
        `;

        db.query(
          insertScoreQuery,
          [user_id, role_id, totalScore],
          (err, scoreResult) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Error saving readiness score" });
            }

            const readiness_id = scoreResult.insertId;

            // 5️⃣ Store breakdown
            const breakdownValues = breakdown.map(b => [
              readiness_id,
              b.skill_id,
              b.required_weight,
              b.achieved_weight,
              b.status
            ]);

            const insertBreakdownQuery = `
              INSERT INTO readiness_score_breakdown
              (readiness_id, skill_id, required_weight, achieved_weight, status)
              VALUES ?
            `;

            db.query(
              insertBreakdownQuery,
              [breakdownValues],
              (err) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ message: "Error saving score breakdown" });
                }

                return res.status(201).json({
                  message: "Readiness score calculated successfully",
                  readiness_id,
                  total_score: totalScore
                });
              }
            );
          }
        );
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unexpected server error" });
  }
});

router.get("/latest/:user_id/:role_id", (req, res) => {
  const { user_id, role_id } = req.params;

  const query = `
    SELECT *
    FROM readiness_scores
    WHERE user_id = ? AND role_id = ?
    ORDER BY calculated_at DESC
    LIMIT 1
  `;

  db.query(query, [user_id, role_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching readiness score" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No readiness score found" });
    }

    res.json(results[0]);
  });
});

router.get("/breakdown/:readiness_id", (req, res) => {
  const { readiness_id } = req.params;

  const query = `
    SELECT
      s.name AS skill,
      b.required_weight,
      b.achieved_weight,
      b.status
    FROM readiness_score_breakdown b
    JOIN skills s ON b.skill_id = s.skill_id
    WHERE b.readiness_id = ?
  `;

  db.query(query, [readiness_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching breakdown" });
    }

    res.json(results);
  });
});


module.exports = router;
