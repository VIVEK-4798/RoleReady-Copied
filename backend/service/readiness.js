const express = require("express");
const router = express.Router();
const db = require("../db");

  /**
   * POST /readiness/calculate
   * Calculates and stores readiness score for a user against a category
   * INPUT SOURCE: user_skills (NOT request body)
   */
  router.post("/calculate", (req, res) => {
    const { user_id, category_id } = req.body;

    if (!user_id || !category_id) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // 1️⃣ Fetch user's skills for this category
    const userSkillsQuery = `
      SELECT DISTINCT us.skill_id
      FROM user_skills us
      JOIN skills s ON s.skill_id = us.skill_id
      WHERE us.user_id = ?
        AND s.category_id = ?
    `;

    db.query(userSkillsQuery, [user_id, category_id], (err, userSkills) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching user skills" });
      }

      const selectedSet = new Set(userSkills.map(s => s.skill_id));

      // 2️⃣ Fetch benchmark skills for category (UNCHANGED)
      const benchmarkQuery = `
        SELECT s.skill_id, s.name, cs.weight
        FROM category_skills cs
        JOIN skills s ON cs.skill_id = s.skill_id
        WHERE cs.category_id = ?
      `;

      db.query(benchmarkQuery, [category_id], (err, benchmarkSkills) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error fetching benchmark skills" });
        }

        let totalScore = 0;
        const breakdown = [];

        // 3️⃣ SCORING LOGIC — COMPLETELY UNCHANGED
        benchmarkSkills.forEach(skill => {
          const hasSkill = selectedSet.has(skill.skill_id);

          breakdown.push({
            skill_id: skill.skill_id,
            required_weight: skill.weight,
            achieved_weight: hasSkill ? skill.weight : 0,
            status: hasSkill ? "met" : "missing",
          });

          if (hasSkill) totalScore += skill.weight;
        });

        // 4️⃣ Store readiness score (UNCHANGED)
        const insertScoreQuery = `
          INSERT INTO readiness_scores (user_id, category_id, total_score)
          VALUES (?, ?, ?)
        `;

        db.query(
          insertScoreQuery,
          [user_id, category_id, totalScore],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Error saving readiness score" });
            }

            const readiness_id = result.insertId;

            if (breakdown.length === 0) {
              return res.status(201).json({
                message: "Readiness score calculated successfully",
                readiness_id,
                total_score: totalScore,
              });
            }

            const breakdownValues = breakdown.map(b => [
              readiness_id,
              b.skill_id,
              b.required_weight,
              b.achieved_weight,
              b.status,
            ]);

            const insertBreakdownQuery = `
              INSERT INTO readiness_score_breakdown
              (readiness_id, skill_id, required_weight, achieved_weight, status)
              VALUES ?
            `;

            db.query(insertBreakdownQuery, [breakdownValues], err => {
              if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error saving breakdown" });
              }

              res.status(201).json({
                message: "Readiness score calculated successfully",
                readiness_id,
                total_score: totalScore,
              });
            });
          }
        );
      });
    });
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
