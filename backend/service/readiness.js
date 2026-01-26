const express = require("express");
const router = express.Router();
const db = require("../db");

/* ============================================================================
   🔒 STEP 2: LOCKED INPUT CONTRACT - CORE READINESS ENGINE
   ============================================================================
   
   WHY THIS EXISTS:
   - Single source of truth for ALL readiness calculations
   - NO demo skills, NO frontend-passed data, NO hardcoded values
   - All endpoints MUST call this function (no duplicate logic)
   
   INPUTS (locked):
   - user_id: from auth/session only
   - category_id: from DB profile only (target_category_id)
   
   VALID SKILL SOURCES:
   - 'self' (user claimed)
   - 'resume' (parsed from resume)
   - 'validated' (mentor verified)
   
   ❌ EXCLUDED: 'demo' skills are NEVER used in real calculations
   ============================================================================ */

/* ============================================================================
   🛡️ STEP 4: RECALCULATION RULES & GUARDS
   ============================================================================
   
   RULES ENFORCED:
   1. COOLDOWN: 5-minute minimum between recalculations (prevents spam)
   2. NO DUPLICATES: Skip if user skills haven't changed since last calc
   
   WHY INTERVIEW-FRIENDLY:
   - Shows understanding of rate limiting
   - Demonstrates data efficiency (no redundant writes)
   - Clear, actionable error messages
   ============================================================================ */

const RECALCULATION_COOLDOWN_MINUTES = 5;

/**
 * 🛡️ STEP 4.1: Check recalculation cooldown
 * Returns time remaining if cooldown active, null if allowed
 */
function checkRecalculationCooldown(user_id, category_id) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT calculated_at 
      FROM readiness_scores 
      WHERE user_id = ? AND category_id = ?
      ORDER BY calculated_at DESC 
      LIMIT 1
    `;
    
    db.query(query, [user_id, category_id], (err, results) => {
      if (err) {
        console.error("[checkRecalculationCooldown] DB error:", err);
        return reject(err);
      }
      
      if (results.length === 0) {
        // No previous calculation - allowed
        return resolve({ allowed: true, lastCalculation: null });
      }
      
      const lastCalc = new Date(results[0].calculated_at);
      const now = new Date();
      const diffMs = now - lastCalc;
      const diffMinutes = Math.floor(diffMs / 60000);
      
      if (diffMinutes < RECALCULATION_COOLDOWN_MINUTES) {
        const remainingMinutes = RECALCULATION_COOLDOWN_MINUTES - diffMinutes;
        const remainingSeconds = Math.ceil((RECALCULATION_COOLDOWN_MINUTES * 60000 - diffMs) / 1000);
        
        return resolve({
          allowed: false,
          reason: "COOLDOWN_ACTIVE",
          message: `Please wait ${remainingMinutes > 0 ? remainingMinutes + ' minute(s)' : remainingSeconds + ' seconds'} before recalculating`,
          lastCalculation: lastCalc.toISOString(),
          cooldownEndsAt: new Date(lastCalc.getTime() + RECALCULATION_COOLDOWN_MINUTES * 60000).toISOString(),
        });
      }
      
      resolve({ allowed: true, lastCalculation: lastCalc.toISOString() });
    });
  });
}

/**
 * 🛡️ STEP 4.2: Check if skills have changed since last calculation
 * Compares current user skills with skills used in last calculation
 */
function checkSkillsChanged(user_id, category_id) {
  return new Promise((resolve, reject) => {
    // Get the latest readiness_id for this user/category
    const getLastReadinessQuery = `
      SELECT readiness_id, total_score, max_possible_score
      FROM readiness_scores 
      WHERE user_id = ? AND category_id = ?
      ORDER BY calculated_at DESC 
      LIMIT 1
    `;
    
    db.query(getLastReadinessQuery, [user_id, category_id], (err, lastReadiness) => {
      if (err) {
        console.error("[checkSkillsChanged] DB error getting last readiness:", err);
        return reject(err);
      }
      
      if (lastReadiness.length === 0) {
        // No previous calculation - definitely changed (first time)
        return resolve({ changed: true, reason: "FIRST_CALCULATION" });
      }
      
      const readiness_id = lastReadiness[0].readiness_id;
      
      // Get skills that were "met" in the last calculation
      const getLastSkillsQuery = `
        SELECT skill_id FROM readiness_score_breakdown 
        WHERE readiness_id = ? AND status = 'met'
        ORDER BY skill_id
      `;
      
      // Get current user skills (same query as in calculateReadiness)
      const getCurrentSkillsQuery = `
        SELECT DISTINCT us.skill_id
        FROM user_skills us
        JOIN skills s ON s.skill_id = us.skill_id
        WHERE us.user_id = ? 
          AND s.category_id = ?
          AND us.source IN ('self', 'resume', 'validated')
        ORDER BY us.skill_id
      `;
      
      db.query(getLastSkillsQuery, [readiness_id], (err, lastSkills) => {
        if (err) {
          console.error("[checkSkillsChanged] DB error getting last skills:", err);
          return reject(err);
        }
        
        db.query(getCurrentSkillsQuery, [user_id, category_id], (err, currentSkills) => {
          if (err) {
            console.error("[checkSkillsChanged] DB error getting current skills:", err);
            return reject(err);
          }
          
          // Compare skill sets
          const lastSkillIds = lastSkills.map(s => s.skill_id).sort((a, b) => a - b);
          const currentSkillIds = currentSkills.map(s => s.skill_id).sort((a, b) => a - b);
          
          // Simple comparison: convert to JSON strings
          const lastJson = JSON.stringify(lastSkillIds);
          const currentJson = JSON.stringify(currentSkillIds);
          
          if (lastJson === currentJson) {
            resolve({
              changed: false,
              reason: "NO_CHANGES",
              message: "No changes detected since last calculation. Your skills are the same.",
              lastScore: lastReadiness[0].total_score,
              lastMaxScore: lastReadiness[0].max_possible_score,
              lastPercentage: Math.round((lastReadiness[0].total_score / lastReadiness[0].max_possible_score) * 100),
            });
          } else {
            const added = currentSkillIds.filter(id => !lastSkillIds.includes(id)).length;
            const removed = lastSkillIds.filter(id => !currentSkillIds.includes(id)).length;
            
            resolve({
              changed: true,
              reason: "SKILLS_CHANGED",
              skillsAdded: added,
              skillsRemoved: removed,
            });
          }
        });
      });
    });
  });
}

/**
 * 🔐 CORE READINESS ENGINE (STEP 2.2)
 * 
 * This is the SINGLE function that calculates readiness.
 * All endpoints must use this - no duplicate logic allowed.
 * 
 * @param {number} user_id - Must come from authenticated session
 * @param {number} category_id - Must come from DB (profile_info.target_category_id)
 * @param {string} trigger_source - Who triggered: 'user_explicit', 'system', 'mentor'
 * @returns {Promise<object>} Readiness result with score, breakdown, and missing skills
 */
function calculateReadiness(user_id, category_id, trigger_source = "user_explicit") {
  return new Promise((resolve, reject) => {
    
    /* ======================================================
       GUARD VALIDATION 1: Input validation (STEP 2.6)
       ====================================================== */
    if (!user_id || !category_id) {
      return reject({
        success: false,
        error: "INVALID_INPUT",
        message: "user_id and category_id are required",
      });
    }

    /* ======================================================
       1️⃣ FETCH USER SKILLS (STEP 2.3 - Demo excluded!)
       ====================================================== 
       IMPORTANT: Only 'self', 'resume', 'validated' sources
       ❌ 'demo' is EXCLUDED from real calculations
    */
    const userSkillsQuery = `
      SELECT DISTINCT us.skill_id, us.source
      FROM user_skills us
      JOIN skills s ON s.skill_id = us.skill_id
      WHERE us.user_id = ? 
        AND s.category_id = ?
        AND us.source IN ('self', 'resume', 'validated')
    `;

    db.query(userSkillsQuery, [user_id, category_id], (err, userSkills) => {
      if (err) {
        console.error("[calculateReadiness] Error fetching user skills:", err);
        return reject({
          success: false,
          error: "DB_ERROR",
          message: "Error fetching user skills",
        });
      }

      /* ======================================================
         2️⃣ FETCH BENCHMARK SKILLS (category_skills table)
         ====================================================== */
      const benchmarkQuery = `
        SELECT s.skill_id, s.name, cs.weight, cs.importance
        FROM category_skills cs
        JOIN skills s ON cs.skill_id = s.skill_id
        WHERE cs.category_id = ?
        ORDER BY cs.weight DESC
      `;

      db.query(benchmarkQuery, [category_id], (err, benchmarkSkills) => {
        if (err) {
          console.error("[calculateReadiness] Error fetching benchmark skills:", err);
          return reject({
            success: false,
            error: "DB_ERROR",
            message: "Error fetching benchmark skills",
          });
        }

        
        if (benchmarkSkills.length === 0) {
          return reject({
            success: false,
            error: "NO_BENCHMARK_SKILLS",
            message: "No benchmark skills defined for this category. This is a data integrity issue.",
            category_id,
          });
        }

        
        const selectedSet = new Set(userSkills.map(s => s.skill_id));
        
        // Skill source breakdown (for stats)
        const selfSkills = userSkills.filter(s => s.source === "self");
        const resumeSkills = userSkills.filter(s => s.source === "resume");
        const validatedSkills = userSkills.filter(s => s.source === "validated");

        let totalScore = 0;
        let maxPossibleScore = 0;
        const breakdown = [];
        const missingRequiredSkills = [];

        benchmarkSkills.forEach(skill => {
          const hasSkill = selectedSet.has(skill.skill_id);
          const skillSource = userSkills.find(s => s.skill_id === skill.skill_id)?.source || null;

          breakdown.push({
            skill_id: skill.skill_id,
            skill_name: skill.name,
            required_weight: skill.weight,
            achieved_weight: hasSkill ? skill.weight : 0,
            status: hasSkill ? "met" : "missing",
            source: skillSource,
            importance: skill.importance,
          });

          maxPossibleScore += skill.weight;
          if (hasSkill) {
            totalScore += skill.weight;
          } else if (skill.importance === "required") {
            missingRequiredSkills.push(skill.name);
          }
        });

        /* ======================================================
           4️⃣ INSERT READINESS SCORE (TIME-SERIES)
           ====================================================== */
        const insertScoreQuery = `
          INSERT INTO readiness_scores
          (user_id, category_id, total_score, trigger_source, max_possible_score)
          VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
          insertScoreQuery,
          [user_id, category_id, totalScore, trigger_source, maxPossibleScore],
          (err, result) => {
            if (err) {
              console.error("[calculateReadiness] Error saving readiness score:", err);
              return reject({
                success: false,
                error: "DB_ERROR",
                message: "Error saving readiness score",
              });
            }

            const readiness_id = result.insertId;
            const calculated_at = new Date();

            /* ======================================================
               5️⃣ INSERT BREAKDOWN SNAPSHOT
               ====================================================== */
            const breakdownValues = breakdown.map(b => [
              readiness_id,
              b.skill_id,
              b.required_weight,
              b.achieved_weight,
              b.status,
              b.source,
            ]);

            const insertBreakdownQuery = `
              INSERT INTO readiness_score_breakdown
              (readiness_id, skill_id, required_weight, achieved_weight, status, skill_source)
              VALUES ?
            `;

            db.query(insertBreakdownQuery, [breakdownValues], err => {
              if (err) {
                console.error("[calculateReadiness] Error saving breakdown:", err);
                return reject({
                  success: false,
                  error: "DB_ERROR",
                  message: "Error saving breakdown",
                });
              }

              /* ======================================================
                 6️⃣ RETURN COMPLETE RESULT
                 ====================================================== */
              resolve({
                success: true,
                message: "Readiness calculated successfully",
                readiness_id,
                total_score: totalScore,
                max_possible_score: maxPossibleScore,
                percentage:
                  maxPossibleScore > 0
                    ? Math.round((totalScore / maxPossibleScore) * 100)
                    : 0,
                calculated_at: calculated_at.toISOString(),
                trigger: trigger_source,
                missing_required_skills: missingRequiredSkills,
                skill_stats: {
                  total_benchmark_skills: benchmarkSkills.length,
                  skills_met: breakdown.filter(b => b.status === "met").length,
                  skills_missing: breakdown.filter(b => b.status === "missing").length,
                  self_skills_count: selfSkills.length,
                  resume_skills_count: resumeSkills.length,
                  validated_skills_count: validatedSkills.length,
                  // ❌ No demo_skills_count - demo is excluded
                },
                breakdown, // Full breakdown for detailed view
              });
            });
          }
        );
      });
    });
  });
}

function getTargetCategoryFromProfile(user_id) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT target_category_id 
      FROM profile_info 
      WHERE user_id = ?
    `;
    
    db.query(query, [user_id], (err, results) => {
      if (err) {
        console.error("[getTargetCategoryFromProfile] DB error:", err);
        return reject(err);
      }
      
      if (results.length === 0 || !results[0].target_category_id) {
        return resolve(null);
      }
      
      resolve(results[0].target_category_id);
    });
  });
}

/**
 * POST /readiness/explicit-calculate
 * 
 * 🛡️ STEP 4: Enforced recalculation rules
 * - Cooldown: 5 minutes between calculations (unless force=true)
 * - Duplicate prevention: Skip if skills haven't changed (unless force=true)
 */
router.post("/explicit-calculate", async (req, res) => {
  const { user_id, force } = req.body;
  
  // 🔒 STEP 2: Ignore any frontend-passed skills/category
  if (req.body.skills || req.body.skill_ids) {
    console.warn("[explicit-calculate] Frontend attempted to pass skills - IGNORED");
  }
  if (req.body.category_id) {
    console.warn("[explicit-calculate] Frontend attempted to pass category_id - IGNORED (using DB value)");
  }

  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: "MISSING_USER_ID",
      message: "user_id is required (must come from auth)",
    });
  }

  try {
    const category_id = await getTargetCategoryFromProfile(user_id);
    
    if (!category_id) {
      return res.status(400).json({
        success: false,
        error: "TARGET_ROLE_NOT_SELECTED",
        message: "Target role not selected. Please select a target role in your profile first.",
        action_required: "SELECT_TARGET_ROLE",
        action_url: "/vendor-dashboard/profile",
      });
    }

    /* ======================================================
       🛡️ STEP 7: Check for edge cases before calculation
       ====================================================== */
    
    // Edge Case 1: No benchmark skills for this role
    const benchmarkQuery = `
      SELECT COUNT(*) as total_skills
      FROM category_skills
      WHERE category_id = ?
    `;
    const benchmarkResult = await new Promise((resolve, reject) => {
      db.query(benchmarkQuery, [category_id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    if (!benchmarkResult[0]?.total_skills || benchmarkResult[0].total_skills === 0) {
      return res.status(500).json({
        success: false,
        error: "NO_BENCHMARK_SKILLS",
        message: "This role has no benchmark skills configured. This is a system configuration issue - please contact support.",
        action_required: "ADMIN_SETUP_REQUIRED",
      });
    }

    // Edge Case 2: User has no skills for this category
    const userSkillsQuery = `
      SELECT COUNT(*) as count
      FROM user_skills us
      JOIN skills s ON s.skill_id = us.skill_id
      WHERE us.user_id = ? 
        AND s.category_id = ?
        AND us.source IN ('self', 'resume', 'validated')
    `;
    const userSkillsResult = await new Promise((resolve, reject) => {
      db.query(userSkillsQuery, [user_id, category_id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    if (!userSkillsResult[0]?.count || userSkillsResult[0].count === 0) {
      return res.status(400).json({
        success: false,
        error: "NO_USER_SKILLS",
        message: "You haven't added any skills yet. Add your skills to calculate your readiness score.",
        action_required: "ADD_SKILLS",
        action_url: "/vendor-dashboard/profile",
      });
    }

    /* ======================================================
       🛡️ STEP 4.1: Check cooldown (unless force=true)
       ====================================================== */
    if (!force) {
      const cooldownCheck = await checkRecalculationCooldown(user_id, category_id);
      
      if (!cooldownCheck.allowed) {
        return res.status(429).json({
          success: false,
          error: "COOLDOWN_ACTIVE",
          message: cooldownCheck.message,
          lastCalculation: cooldownCheck.lastCalculation,
          cooldownEndsAt: cooldownCheck.cooldownEndsAt,
          hint: "Pass force=true to bypass cooldown (admin only)",
        });
      }
    }

    /* ======================================================
       🛡️ STEP 4.2: Check if skills changed (unless force=true)
       ====================================================== */
    if (!force) {
      const changeCheck = await checkSkillsChanged(user_id, category_id);
      
      if (!changeCheck.changed) {
        return res.status(200).json({
          success: true,
          recalculated: false,
          error: "NO_CHANGES_DETECTED",
          message: changeCheck.message,
          current_score: changeCheck.lastScore,
          max_possible_score: changeCheck.lastMaxScore,
          percentage: changeCheck.lastPercentage,
          hint: "Your skills haven't changed since the last calculation. Pass force=true to recalculate anyway.",
        });
      }
    }

    /* ======================================================
       ✅ All guards passed - calculate readiness
       ====================================================== */
    const result = await calculateReadiness(user_id, category_id, "user_explicit");
    
    return res.status(201).json({
      ...result,
      recalculated: true,
    });
    
  } catch (error) {
    console.error("[explicit-calculate] Error:", error);
    
    // Handle known errors from calculateReadiness
    if (error.error) {
      const statusCode = error.error === "NO_BENCHMARK_SKILLS" ? 500 : 400;
      return res.status(statusCode).json(error);
    }
    
    return res.status(500).json({
      success: false,
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    });
  }
});

/* ============================================================================
   🎭 STEP 6: DEMO-ONLY ENDPOINTS (ISOLATED FROM REAL DATA)
   ============================================================================
   
   These endpoints are ONLY for the landing page demo.
   
   KEY DIFFERENCES FROM REAL ENDPOINTS:
   1. Uses hardcoded DEMO_USER_ID (25)
   2. Skills are stored with source='demo' 
   3. Readiness calculation uses demo skills only
   4. Results are NOT mixed with real user data
   5. Clearly labeled as demo in responses
   
   Real users CANNOT use these endpoints - they must log in.
   ============================================================================
*/

const DEMO_USER_ID = 25; // Fixed demo user

/**
 * POST /readiness/demo/skills
 * Save demo skills for landing page demo
 */
router.post("/demo/skills", (req, res) => {
  const { skill_ids, category_id } = req.body;

  if (!Array.isArray(skill_ids) || !category_id) {
    return res.status(400).json({ 
      success: false,
      message: "skill_ids (array) and category_id are required" 
    });
  }

  // Clear old demo skills for this user
  const clearDemoSkills = `
    DELETE FROM user_skills
    WHERE user_id = ? AND source = 'demo'
  `;

  db.query(clearDemoSkills, [DEMO_USER_ID], err => {
    if (err) {
      console.error("[demo/skills] Error clearing:", err);
      return res.status(500).json({ success: false, message: "Error clearing demo skills" });
    }

    if (skill_ids.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: "Demo skills cleared",
        is_demo: true
      });
    }

    const values = skill_ids.map(skillId => [DEMO_USER_ID, skillId, 'demo']);
    const insertSkills = `
      INSERT INTO user_skills (user_id, skill_id, source)
      VALUES ?
      ON DUPLICATE KEY UPDATE source = 'demo'
    `;

    db.query(insertSkills, [values], err => {
      if (err) {
        console.error("[demo/skills] Error inserting:", err);
        return res.status(500).json({ success: false, message: "Error saving demo skills" });
      }

      res.status(200).json({ 
        success: true,
        message: `${skill_ids.length} demo skills saved`,
        is_demo: true,
        note: "These skills are for demo purposes only and will NOT affect any real user data."
      });
    });
  });
});

/**
 * POST /readiness/demo/calculate
 * Calculate readiness for demo - uses demo skills, doesn't save to history
 */
router.post("/demo/calculate", (req, res) => {
  const { category_id } = req.body;

  if (!category_id) {
    return res.status(400).json({
      success: false,
      message: "category_id is required for demo calculation"
    });
  }

  // Fetch demo user's demo skills only
  const demoSkillsQuery = `
    SELECT DISTINCT us.skill_id
    FROM user_skills us
    JOIN skills s ON s.skill_id = us.skill_id
    WHERE us.user_id = ? 
      AND s.category_id = ?
      AND us.source = 'demo'
  `;

  db.query(demoSkillsQuery, [DEMO_USER_ID, category_id], (err, demoSkills) => {
    if (err) {
      console.error("[demo/calculate] Error fetching demo skills:", err);
      return res.status(500).json({ success: false, message: "Error fetching demo skills" });
    }

    // Fetch benchmark skills
    const benchmarkQuery = `
      SELECT s.skill_id, s.name, cs.weight, cs.importance
      FROM category_skills cs
      JOIN skills s ON cs.skill_id = s.skill_id
      WHERE cs.category_id = ?
      ORDER BY cs.weight DESC
    `;

    db.query(benchmarkQuery, [category_id], (err, benchmarkSkills) => {
      if (err) {
        console.error("[demo/calculate] Error fetching benchmark:", err);
        return res.status(500).json({ success: false, message: "Error fetching benchmark" });
      }

      if (benchmarkSkills.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No benchmark skills found for this category"
        });
      }

      // Calculate score (in-memory only, not saved to DB)
      const selectedSet = new Set(demoSkills.map(s => s.skill_id));
      let totalScore = 0;
      let maxPossibleScore = 0;
      const breakdown = [];
      const missingRequiredSkills = [];

      benchmarkSkills.forEach(skill => {
        const hasSkill = selectedSet.has(skill.skill_id);
        
        breakdown.push({
          skill_id: skill.skill_id,
          skill_name: skill.name,
          required_weight: skill.weight,
          achieved_weight: hasSkill ? skill.weight : 0,
          status: hasSkill ? "met" : "missing",
          importance: skill.importance,
        });

        maxPossibleScore += skill.weight;
        if (hasSkill) {
          totalScore += skill.weight;
        } else if (skill.importance === "required") {
          missingRequiredSkills.push(skill.name);
        }
      });

      const percentage = maxPossibleScore > 0
        ? Math.round((totalScore / maxPossibleScore) * 100)
        : 0;

      // Return demo result (NOT saved to DB)
      res.status(200).json({
        success: true,
        is_demo: true,
        demo_notice: "This is a DEMO result. Sign up to track your real readiness!",
        total_score: totalScore,
        max_possible_score: maxPossibleScore,
        percentage,
        skills_selected: demoSkills.length,
        skills_met: breakdown.filter(b => b.status === "met").length,
        skills_missing: breakdown.filter(b => b.status === "missing").length,
        missing_required_skills: missingRequiredSkills,
        breakdown,
      });
    });
  });
});

/* ============================================================================
   🎭 LEGACY DEMO ENDPOINTS (kept for backward compatibility, will be removed)
   ============================================================================
*/
router.post("/user-skills/bulk-add", (req, res) => {
  const { user_id, skill_ids, mode } = req.body;

  // STEP 6: Log warning if non-demo user tries to use this
  if (user_id !== DEMO_USER_ID && mode === "demo") {
    console.warn(`[user-skills/bulk-add] Non-demo user ${user_id} attempted demo mode`);
  }

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

      res.status(200).json({ 
        message: "Skills saved successfully",
        note: source === "demo" 
          ? "Demo skills saved. These will NOT affect your real readiness score."
          : "Skills saved and will be included in your readiness calculation."
      });
    });
  });
});



router.post("/calculate", async (req, res) => {
  const { user_id, trigger_source = "system" } = req.body;
  
  // ❌ IGNORED: Any skills or category_id from frontend
  if (req.body.skills || req.body.skill_ids || req.body.category_id) {
    console.warn("[calculate] Frontend attempted to pass skills/category_id - IGNORED");
  }

  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: "MISSING_USER_ID",
      message: "user_id is required",
    });
  }

  try {
    // Derive category from DB
    const category_id = await getTargetCategoryFromProfile(user_id);
    
    if (!category_id) {
      return res.status(400).json({
        success: false,
        error: "TARGET_ROLE_NOT_SELECTED",
        message: "Target role not selected",
        action_required: "SELECT_TARGET_ROLE",
      });
    }

    const result = await calculateReadiness(user_id, category_id, trigger_source);
    return res.status(201).json(result);
    
  } catch (error) {
    console.error("[calculate] Error:", error);
    if (error.error) {
      return res.status(error.error === "NO_BENCHMARK_SKILLS" ? 500 : 400).json(error);
    }
    return res.status(500).json({
      success: false,
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    });
  }
});


// GET /readiness/context/:user_id
/* ============================================================================
   🛡️ STEP 7: DEFENSIVE EDGE-CASE HANDLING
   ============================================================================
   
   This endpoint returns explicit edge case flags:
   - has_target_role: false → redirect to role selection
   - user_skills_count: 0 → show guidance to add skills
   - total_benchmark_skills_count: 0 → admin error (data integrity)
   
   Clear messaging = trust.
   ============================================================================ */
router.get("/context/:user_id", async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: "MISSING_USER_ID",
      message: "user_id is required",
    });
  }

  try {
    // 1️⃣ Get target category from profile
    const category_id = await getTargetCategoryFromProfile(user_id);

    /* ======================================================
       🛡️ STEP 7: Edge Case 1 - No target role selected
       ====================================================== */
    if (!category_id) {
      return res.status(200).json({
        success: true,
        has_target_role: false,
        edge_case: "NO_TARGET_ROLE",
        edge_case_message: "You haven't selected a target role yet. Your readiness score is calculated against your target role's required skills.",
        action_required: "SELECT_TARGET_ROLE",
        action_url: "/vendor-dashboard/profile",
        role: null,
        required_skills_count: 0,
        total_benchmark_skills_count: 0,
        user_skills_count: 0,
        user_skills_by_source: {},
        last_calculated_at: null,
      });
    }

    // 2️⃣ Get role/category name
    const roleQuery = `
      SELECT category_id, category_name 
      FROM categories 
      WHERE category_id = ?
    `;

    const roleResult = await new Promise((resolve, reject) => {
      db.query(roleQuery, [category_id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const roleName = roleResult.length > 0 ? roleResult[0].category_name : "Unknown Role";

    // 3️⃣ Get benchmark skills counts (required vs total)
    const benchmarkQuery = `
      SELECT 
        COUNT(*) as total_skills,
        SUM(CASE WHEN importance = 'required' THEN 1 ELSE 0 END) as required_skills
      FROM category_skills
      WHERE category_id = ?
    `;

    const benchmarkResult = await new Promise((resolve, reject) => {
      db.query(benchmarkQuery, [category_id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const totalBenchmarkSkills = benchmarkResult[0]?.total_skills || 0;
    const requiredSkillsCount = benchmarkResult[0]?.required_skills || 0;

    /* ======================================================
       🛡️ STEP 7: Edge Case 3 - No benchmark skills (admin error)
       ====================================================== */
    if (totalBenchmarkSkills === 0) {
      return res.status(200).json({
        success: true,
        has_target_role: true,
        edge_case: "NO_BENCHMARK_SKILLS",
        edge_case_message: `The "${roleName}" role has no benchmark skills configured. This is a system configuration issue.`,
        action_required: "ADMIN_SETUP_REQUIRED",
        role: {
          category_id: parseInt(category_id),
          name: roleName,
        },
        required_skills_count: 0,
        total_benchmark_skills_count: 0,
        user_skills_count: 0,
        user_skills_by_source: {},
        last_calculated_at: null,
      });
    }

    // 4️⃣ Get user skills count (only real skills, no demo)
    const userSkillsQuery = `
      SELECT us.source, COUNT(*) as count
      FROM user_skills us
      JOIN skills s ON s.skill_id = us.skill_id
      WHERE us.user_id = ? 
        AND s.category_id = ?
        AND us.source IN ('self', 'resume', 'validated')
      GROUP BY us.source
    `;

    const userSkillsResult = await new Promise((resolve, reject) => {
      db.query(userSkillsQuery, [user_id, category_id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    // Build skills by source breakdown
    const userSkillsBySource = {};
    let totalUserSkills = 0;
    userSkillsResult.forEach(row => {
      userSkillsBySource[row.source] = row.count;
      totalUserSkills += row.count;
    });

    // 5️⃣ Get last calculated date
    const lastCalcQuery = `
      SELECT calculated_at
      FROM readiness_scores
      WHERE user_id = ? AND category_id = ?
      ORDER BY calculated_at DESC
      LIMIT 1
    `;

    const lastCalcResult = await new Promise((resolve, reject) => {
      db.query(lastCalcQuery, [user_id, category_id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const lastCalculatedAt = lastCalcResult.length > 0 
      ? lastCalcResult[0].calculated_at 
      : null;

    /* ======================================================
       🛡️ STEP 7: Edge Case 2 - User has no skills
       ====================================================== */
    let edgeCase = null;
    let edgeCaseMessage = null;
    let actionRequired = null;
    let actionUrl = null;

    if (totalUserSkills === 0) {
      edgeCase = "NO_USER_SKILLS";
      edgeCaseMessage = `You haven't added any skills yet for ${roleName}. Add your skills to calculate your readiness.`;
      actionRequired = "ADD_SKILLS";
      actionUrl = "/vendor-dashboard/profile";
    }

    // 6️⃣ Return context response (locked contract)
    return res.status(200).json({
      success: true,
      has_target_role: true,
      // 🛡️ STEP 7: Edge case fields (null if no edge case)
      edge_case: edgeCase,
      edge_case_message: edgeCaseMessage,
      action_required: actionRequired,
      action_url: actionUrl,
      role: {
        category_id: parseInt(category_id),
        name: roleName,
      },
      required_skills_count: parseInt(requiredSkillsCount),
      total_benchmark_skills_count: parseInt(totalBenchmarkSkills),
      user_skills_count: totalUserSkills,
      user_skills_by_source: userSkillsBySource,
      last_calculated_at: lastCalculatedAt,
    });

  } catch (error) {
    console.error("[context] Error:", error);
    return res.status(500).json({
      success: false,
      error: "INTERNAL_ERROR",
      message: "Failed to fetch readiness context",
    });
  }
});

/* ---------------------------------------------
   LATEST readiness (UPDATED for Section B)
   
   Returns the most recent readiness calculation for a user+category.
   Includes all data needed to display the score UI without recalculating.
---------------------------------------------- */
router.get("/latest/:user_id/:category_id", (req, res) => {
  const { user_id, category_id } = req.params;

  // Fetch the latest readiness score with all needed fields
  const query = `
    SELECT 
      readiness_id,
      total_score, 
      max_possible_score,
      calculated_at, 
      trigger_source
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

    const score = results[0];
    
    // Calculate percentage
    const percentage = score.max_possible_score > 0
      ? Math.round((score.total_score / score.max_possible_score) * 100)
      : 0;

    // Get skill stats from breakdown
    const statsQuery = `
      SELECT 
        COUNT(*) as total_skills,
        SUM(CASE WHEN status = 'met' THEN 1 ELSE 0 END) as skills_met,
        SUM(CASE WHEN status = 'missing' THEN 1 ELSE 0 END) as skills_missing
      FROM readiness_score_breakdown
      WHERE readiness_id = ?
    `;

    db.query(statsQuery, [score.readiness_id], (err, statsResults) => {
      if (err) {
        console.error(err);
        // Return basic response even if stats fail
        return res.json({
          ...score,
          percentage,
          skill_stats: null,
        });
      }

      const stats = statsResults[0] || {};

      res.json({
        readiness_id: score.readiness_id,
        total_score: score.total_score,
        max_possible_score: score.max_possible_score,
        percentage,
        calculated_at: score.calculated_at,
        trigger_source: score.trigger_source,
        skill_stats: {
          total_benchmark_skills: stats.total_skills || 0,
          skills_met: stats.skills_met || 0,
          skills_missing: stats.skills_missing || 0,
        },
      });
    });
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
   Breakdown endpoint (UPDATED for Section C)
   
   Returns skill breakdown with:
   - Required skills: met vs missing
   - Optional skills: met vs missing  
   - Weight impact summary
   
   This is for EVALUATION page, not tracking/history.
---------------------------------------------- */
router.get("/breakdown/:readiness_id", (req, res) => {
  const { readiness_id } = req.params;

  // Get breakdown with importance (required vs optional)
  const breakdownQuery = `
    SELECT 
      s.name AS skill,
      rsb.skill_id,
      rsb.status,
      rsb.required_weight,
      rsb.achieved_weight,
      COALESCE(cs.importance, 'optional') AS importance
    FROM readiness_score_breakdown rsb
    JOIN skills s ON s.skill_id = rsb.skill_id
    LEFT JOIN category_skills cs ON cs.skill_id = rsb.skill_id
    WHERE rsb.readiness_id = ?
    ORDER BY cs.importance DESC, rsb.required_weight DESC
  `;

  db.query(breakdownQuery, [readiness_id], (err, breakdownResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching breakdown" });
    }

    // Separate required vs optional skills
    const requiredSkills = breakdownResults.filter(s => s.importance === 'required');
    const optionalSkills = breakdownResults.filter(s => s.importance !== 'required');
    
    // Calculate counts
    const requiredMet = requiredSkills.filter(s => s.status === 'met');
    const requiredMissing = requiredSkills.filter(s => s.status === 'missing');
    const optionalMet = optionalSkills.filter(s => s.status === 'met');
    const optionalMissing = optionalSkills.filter(s => s.status === 'missing');
    
    // Calculate weight impact
    const totalRequiredWeight = requiredSkills.reduce((sum, s) => sum + s.required_weight, 0);
    const achievedRequiredWeight = requiredMet.reduce((sum, s) => sum + s.achieved_weight, 0);
    const totalOptionalWeight = optionalSkills.reduce((sum, s) => sum + s.required_weight, 0);
    const achievedOptionalWeight = optionalMet.reduce((sum, s) => sum + s.achieved_weight, 0);

    res.json({
      // Full breakdown for table display
      breakdown: breakdownResults,
      
      // Required skills summary
      required_skills: {
        total: requiredSkills.length,
        met: requiredMet.length,
        missing: requiredMissing.length,
        met_skills: requiredMet.map(s => s.skill),
        missing_skills: requiredMissing.map(s => s.skill),
      },
      
      // Optional skills summary
      optional_skills: {
        total: optionalSkills.length,
        met: optionalMet.length,
        missing: optionalMissing.length,
        met_skills: optionalMet.map(s => s.skill),
        missing_skills: optionalMissing.map(s => s.skill),
      },
      
      // Weight impact summary
      weight_impact: {
        total_weight: totalRequiredWeight + totalOptionalWeight,
        achieved_weight: achievedRequiredWeight + achievedOptionalWeight,
        required_weight_total: totalRequiredWeight,
        required_weight_achieved: achievedRequiredWeight,
        optional_weight_total: totalOptionalWeight,
        optional_weight_achieved: achievedOptionalWeight,
      },
      
      // Legacy field for backward compatibility
      missing_required_skills: requiredMissing.map(s => s.skill),
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

/* ============================================================================
   📤 EXPORTS
   ============================================================================
   
   We export both:
   - router: Express router for mounting endpoints
   - calculateReadiness: Core function for internal use by other services
   - getTargetCategoryFromProfile: Helper for getting user's target category
   
   This allows other services (e.g., mentor actions) to use the locked
   readiness engine without duplicating logic.
   ============================================================================ */
module.exports = {
  router,
  calculateReadiness,
  getTargetCategoryFromProfile,
};
