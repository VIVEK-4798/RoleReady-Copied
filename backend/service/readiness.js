const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * POST /readiness/calculate
 * Calculates and stores readiness score as a TIME-SERIES entry
 * Guardrail: cooldown between recalculations
 */
router.post("/calculate", (req, res) => {
  const { user_id, category_id, trigger_source = "manual" } = req.body;

  if (!user_id || !category_id) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  const COOLDOWN_HOURS = 24;

  /* 0️⃣ COOLDOWN CHECK */
  const cooldownQuery = `
    SELECT calculated_at
    FROM readiness_scores
    WHERE user_id = ? AND category_id = ?
    ORDER BY calculated_at DESC
    LIMIT 1
  `;

  db.query(cooldownQuery, [user_id, category_id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error checking cooldown" });
    }

    if (rows.length > 0) {
      const lastCalculated = new Date(rows[0].calculated_at);
      const now = new Date();

      const diffHours =
        (now.getTime() - lastCalculated.getTime()) / (1000 * 60 * 60);

      if (diffHours < COOLDOWN_HOURS) {
        return res.status(429).json({
          message: `You can recalculate readiness after ${
            COOLDOWN_HOURS - Math.floor(diffHours)
          } hours.`,
        });
      }
    }

    /* 1️⃣ Fetch user's skills for this category */
    const userSkillsQuery = `
      SELECT DISTINCT us.skill_id
      FROM user_skills us
      JOIN skills s ON s.skill_id = us.skill_id
      WHERE us.user_id = ?
        AND s.category_id = ?
        -- Remove the source filter to include ALL skills
    `;

    db.query(userSkillsQuery, [user_id, category_id], (err, userSkills) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching user skills" });
      }

      const selectedSet = new Set(userSkills.map(s => s.skill_id));

      /* 2️⃣ Fetch benchmark skills */
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

        /* 3️⃣ INSERT readiness score (NEVER overwrite) */
        const insertScoreQuery = `
          INSERT INTO readiness_scores
          (user_id, category_id, total_score, trigger_source)
          VALUES (?, ?, ?, ?)
        `;

        db.query(
          insertScoreQuery,
          [user_id, category_id, totalScore, trigger_source],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Error saving readiness score" });
            }

            const readiness_id = result.insertId;

            if (breakdown.length === 0) {
              return res.status(201).json({
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
                readiness_id,
                total_score: totalScore,
              });
            });
          }
        );
      });
    });
  });
});

/* ---------------------------------------------
   DEMO SKILLS SAVE (unchanged logic)
---------------------------------------------- */
router.post("/user-skills/bulk-add", (req, res) => {
  const { user_id, skill_ids, mode } = req.body;

  if (!user_id || !Array.isArray(skill_ids)) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  const source = mode === "demo" ? "demo" : "self";

  const deleteOldDemoSkills = `
    DELETE FROM user_skills
    WHERE user_id = ? AND source = 'demo'
  `;

  const insertSkills = `
    INSERT INTO user_skills (user_id, skill_id, source)
    VALUES ?
    ON DUPLICATE KEY UPDATE source = VALUES(source)
  `;

  db.query(deleteOldDemoSkills, [user_id], err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error clearing demo skills" });
    }

    if (skill_ids.length === 0) {
      return res.status(200).json({ message: "No skills to add" });
    }

    const values = skill_ids.map(skillId => [
      user_id,
      skillId,
      source,
    ]);

    db.query(insertSkills, [values], err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error saving skills" });
      }

      res.status(200).json({ message: "Skills saved successfully" });
    });
  });
});

/* ---------------------------------------------
   LATEST readiness (unchanged)
---------------------------------------------- */
router.get("/latest/:user_id/:category_id", (req, res) => {
  const { user_id, category_id } = req.params;

  const query = `
    SELECT total_score, calculated_at, trigger_source
    FROM readiness_scores
    WHERE user_id = ? AND category_id = ?
    ORDER BY calculated_at DESC
    LIMIT 1
  `;

  db.query(query, [user_id, category_id], (err, results) => {
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

/* ---------------------------------------------
   🆕 HISTORY ENDPOINT (Progress Tracking)
---------------------------------------------- */
router.get("/history/:user_id/:category_id", (req, res) => {
  const { user_id, category_id } = req.params;

  const query = `
    SELECT readiness_id, total_score, calculated_at, trigger_source
    FROM readiness_scores
    WHERE user_id = ? AND category_id = ?
    ORDER BY calculated_at DESC  /* ✅ CHANGED FROM ASC TO DESC */
  `;

  db.query(query, [user_id, category_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching readiness history" });
    }

    res.json(results);
  });
});

/* ---------------------------------------------
   Breakdown endpoint (STEP 5 – unchanged)
---------------------------------------------- */
router.get("/breakdown/:readiness_id", (req, res) => {
  const { readiness_id } = req.params;

  const breakdownQuery = `
    SELECT 
      s.name AS skill,
      rsb.status,
      rsb.required_weight,
      rsb.achieved_weight
    FROM readiness_score_breakdown rsb
    JOIN skills s ON s.skill_id = rsb.skill_id
    WHERE rsb.readiness_id = ?
  `;

  db.query(breakdownQuery, [readiness_id], (err, breakdownResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching breakdown" });
    }

    const missingRequiredQuery = `
      SELECT s.name
      FROM readiness_score_breakdown rsb
      JOIN category_skills cs ON cs.skill_id = rsb.skill_id
      JOIN skills s ON s.skill_id = rsb.skill_id
      WHERE rsb.readiness_id = ?
        AND rsb.status = 'missing'
        AND cs.importance = 'required'
    `;

    db.query(missingRequiredQuery, [readiness_id], (err, missingResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching missing skills" });
      }

      res.json({
        breakdown: breakdownResults,
        missing_required_skills: missingResults.map(r => r.name),
      });
    });
  });
});

router.get("/progress/:user_id/:category_id", (req, res) => {
  const { user_id, category_id } = req.params;

  // 1️⃣ Get last two readiness scores
  const scoresQuery = `
    SELECT readiness_id, total_score, calculated_at
    FROM readiness_scores
    WHERE user_id = ? AND category_id = ?
    ORDER BY calculated_at DESC
    LIMIT 2
  `;

  db.query(scoresQuery, [user_id, category_id], (err, scores) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching scores" });
    }

    // If less than 2 attempts, no comparison possible
    if (scores.length < 2) {
      return res.json({
        score_delta: 0,
        newly_met_skills: [],
        newly_missing_skills: [],
        message: "Not enough data to compare progress"
      });
    }

    const latest = scores[0];
    const previous = scores[1];

    const score_delta = latest.total_score - previous.total_score;

    // 2️⃣ Fetch breakdowns for both attempts
    const breakdownQuery = `
      SELECT readiness_id, skill_id, status
      FROM readiness_score_breakdown
      WHERE readiness_id IN (?, ?)
    `;

    db.query(
      breakdownQuery,
      [latest.readiness_id, previous.readiness_id],
      (err, breakdowns) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error fetching breakdowns" });
        }

        const latestMap = {};
        const previousMap = {};

        breakdowns.forEach(b => {
          if (b.readiness_id === latest.readiness_id) {
            latestMap[b.skill_id] = b.status;
          } else {
            previousMap[b.skill_id] = b.status;
          }
        });

        const newlyMet = [];
        const newlyMissing = [];

        Object.keys(latestMap).forEach(skillId => {
          if (latestMap[skillId] === "met" && previousMap[skillId] === "missing") {
            newlyMet.push(parseInt(skillId));
          }

          if (latestMap[skillId] === "missing" && previousMap[skillId] === "met") {
            newlyMissing.push(parseInt(skillId));
          }
        });

        // 3️⃣ Convert skill IDs → names
        if (newlyMet.length === 0 && newlyMissing.length === 0) {
          return res.json({
            score_delta,
            newly_met_skills: [],
            newly_missing_skills: []
          });
        }

        const skillNamesQuery = `
          SELECT skill_id, name
          FROM skills
          WHERE skill_id IN (?)
        `;

        const allSkillIds = [...newlyMet, ...newlyMissing];

        db.query(skillNamesQuery, [allSkillIds], (err, skills) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching skill names" });
          }

          const nameMap = {};
          skills.forEach(s => (nameMap[s.skill_id] = s.name));

          res.json({
            score_delta,
            newly_met_skills: newlyMet.map(id => nameMap[id]),
            newly_missing_skills: newlyMissing.map(id => nameMap[id])
          });
        });
      }
    );
  });
});

/* ---------------------------------------------
   🆕 COMPARE ENDPOINT (Phase 2 - Breakdown Comparison)
---------------------------------------------- */
router.get("/compare/:user_id/:category_id", (req, res) => {
  const { user_id, category_id } = req.params;

  // 1️⃣ Get latest and previous readiness IDs
  const readinessQuery = `
    SELECT readiness_id, calculated_at
    FROM readiness_scores
    WHERE user_id = ? AND category_id = ?
    ORDER BY calculated_at DESC
    LIMIT 2
  `;

  db.query(readinessQuery, [user_id, category_id], (err, readinessResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching readiness records" });
    }

    if (readinessResults.length < 2) {
      return res.status(200).json({
        message: "Not enough data for comparison",
        can_compare: false,
        improved_skills: [],
        focus_areas: []
      });
    }

    const latestId = readinessResults[0].readiness_id;
    const previousId = readinessResults[1].readiness_id;

    // 2️⃣ Fetch detailed breakdowns for both attempts
    const breakdownQuery = `
      SELECT 
        rsb.readiness_id,
        rsb.skill_id,
        s.name as skill_name,
        rsb.status,
        cs.importance
      FROM readiness_score_breakdown rsb
      JOIN skills s ON s.skill_id = rsb.skill_id
      LEFT JOIN category_skills cs ON cs.skill_id = rsb.skill_id AND cs.category_id = ?
      WHERE rsb.readiness_id IN (?, ?)
      ORDER BY rsb.readiness_id DESC, s.name ASC
    `;

    db.query(breakdownQuery, [category_id, latestId, previousId], (err, breakdowns) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching breakdowns" });
      }

      // Separate latest and previous breakdowns
      const latestBreakdown = breakdowns.filter(b => b.readiness_id === latestId);
      const previousBreakdown = breakdowns.filter(b => b.readiness_id === previousId);

      // Create maps for quick lookup
      const latestMap = {};
      const previousMap = {};

      latestBreakdown.forEach(b => {
        latestMap[b.skill_id] = {
          skill_name: b.skill_name,
          status: b.status,
          importance: b.importance
        };
      });

      previousBreakdown.forEach(b => {
        previousMap[b.skill_id] = {
          skill_name: b.skill_name,
          status: b.status,
          importance: b.importance
        };
      });

      // 3️⃣ Identify Improved Skills (STRICT logic)
      const improvedSkills = [];
      Object.keys(latestMap).forEach(skillId => {
        const latest = latestMap[skillId];
        const previous = previousMap[skillId];
        
        if (previous && 
            previous.status === 'missing' && 
            latest.status === 'met') {
          improvedSkills.push(latest.skill_name);
        }
      });

      // 4️⃣ Identify Focus Areas (STRICT logic)
      const focusAreas = [];
      latestBreakdown.forEach(b => {
        // STRICT: Missing + Required skills ONLY
        if (b.status === 'missing' && b.importance === 'required') {
          focusAreas.push(b.skill_name);
        }
      });

      res.status(200).json({
        message: "Comparison completed",
        can_compare: true,
        latest_readiness_id: latestId,
        previous_readiness_id: previousId,
        improved_skills: improvedSkills,
        focus_areas: focusAreas,
        total_skills_compared: Object.keys(latestMap).length,
        breakdown_summary: {
          total_skills: latestBreakdown.length,
          met_skills: latestBreakdown.filter(b => b.status === 'met').length,
          missing_skills: latestBreakdown.filter(b => b.status === 'missing').length,
          required_missing: latestBreakdown.filter(b => b.status === 'missing' && b.importance === 'required').length
        }
      });
    });
  });
});

module.exports = router;
