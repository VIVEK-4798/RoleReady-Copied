const express = require('express');
const router = express.Router();
const db = require('../db');
const { triggerMentorValidation, triggerReadinessOutdated } = require('./notificationService');

/* ============================================================================
   🎓 MENTOR VALIDATION SERVICE - STEP 3
   ============================================================================
   
   This service handles mentor validation of user skills.
   
   SCOPE (from STEP 1):
   ✅ Mentors can view pending skills
   ✅ Mentors can validate/reject skills
   ✅ Mentors can add structured comments
   ❌ Mentors cannot edit scores, add skills, or override engine
   
   ============================================================================ */

/* ============================================================================
   GET /mentor-validation/queue/:mentor_id
   
   Fetch users with skills pending validation.
   Optionally filter by category.
   
   Returns list of skills that need mentor review.
   ============================================================================ */
router.get('/queue/:mentor_id', async (req, res) => {
  const { mentor_id } = req.params;
  const { category_id, status = 'pending' } = req.query;
  
  if (!mentor_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_MENTOR_ID',
      message: 'mentor_id is required'
    });
  }
  
  try {
    // Build query to fetch skills pending validation
    // Skills with validation_status = 'pending' OR 'none' with source = 'self'/'resume'
    let query = `
      SELECT 
        us.user_id,
        u.name as user_name,
        u.email as user_email,
        us.skill_id,
        s.name as skill_name,
        us.level,
        us.source,
        us.created_at as skill_added_at,
        us.validation_status,
        us.validation_note,
        c.category_id,
        c.category_name as category_name,
        pi.target_category_id,
        tc.category_name as target_role_name
      FROM user_skills us
      JOIN user u ON us.user_id = u.user_id
      JOIN skills s ON us.skill_id = s.skill_id
      LEFT JOIN categories c ON s.category_id = c.category_id
      LEFT JOIN profile_info pi ON us.user_id = pi.user_id
      LEFT JOIN categories tc ON pi.target_category_id = tc.category_id
      WHERE 
        us.source IN ('self', 'resume')
        AND (us.validation_status = 'pending' OR us.validation_status = 'none')
        AND us.user_id != ?
    `;
    
    const params = [mentor_id]; // Exclude mentor's own skills
    
    // Filter by category if provided
    if (category_id) {
      query += ` AND (s.category_id = ? OR pi.target_category_id = ?)`;
      params.push(category_id, category_id);
    }
    
    query += ` ORDER BY us.created_at DESC`;
    
    db.query(query, params, (err, results) => {
      if (err) {
        console.error('[mentorValidation] Queue error:', err);
        return res.status(500).json({
          success: false,
          error: 'DATABASE_ERROR',
          message: 'Failed to fetch validation queue'
        });
      }
      
      // Group by user for better display
      const groupedByUser = results.reduce((acc, skill) => {
        const userId = skill.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            user_id: userId,
            user_name: skill.user_name,
            user_email: skill.user_email,
            target_role: skill.target_role_name,
            skills: []
          };
        }
        acc[userId].skills.push({
          skill_id: skill.skill_id,
          skill_name: skill.skill_name,
          level: skill.level,
          source: skill.source,
          category_name: skill.category_name,
          skill_added_at: skill.skill_added_at,
          validation_status: skill.validation_status
        });
        return acc;
      }, {});
      
      return res.status(200).json({
        success: true,
        total_skills: results.length,
        total_users: Object.keys(groupedByUser).length,
        queue: Object.values(groupedByUser),
        flat_list: results // Also provide flat list for simple table view
      });
    });
    
  } catch (error) {
    console.error('[mentorValidation] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch validation queue'
    });
  }
});

/* ============================================================================
   POST /mentor-validation/validate
   
   Validate a single skill.
   Changes skill source to 'validated' and records mentor.
   ============================================================================ */
router.post('/validate', async (req, res) => {
  const { mentor_id, user_id, skill_id, note } = req.body;
  
  if (!mentor_id || !user_id || !skill_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_FIELDS',
      message: 'mentor_id, user_id, and skill_id are required'
    });
  }
  
  // Prevent self-validation
  if (mentor_id === user_id) {
    return res.status(403).json({
      success: false,
      error: 'SELF_VALIDATION_NOT_ALLOWED',
      message: 'You cannot validate your own skills'
    });
  }
  
  try {
    // Check if skill exists and is eligible for validation
    const checkQuery = `
      SELECT us.*, s.name as skill_name
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.skill_id
      WHERE us.user_id = ? AND us.skill_id = ?
    `;
    
    db.query(checkQuery, [user_id, skill_id], (checkErr, checkResults) => {
      if (checkErr) {
        console.error('[mentorValidation] Check error:', checkErr);
        return res.status(500).json({
          success: false,
          error: 'DATABASE_ERROR',
          message: 'Failed to check skill'
        });
      }
      
      if (checkResults.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'SKILL_NOT_FOUND',
          message: 'Skill not found for this user'
        });
      }
      
      const skill = checkResults[0];
      
      // Update skill with validation
      const updateQuery = `
        UPDATE user_skills
        SET 
          source = 'validated',
          validated_by = ?,
          validated_at = NOW(),
          validation_status = 'validated',
          validation_note = ?
        WHERE user_id = ? AND skill_id = ?
      `;
      
      db.query(updateQuery, [mentor_id, note || null, user_id, skill_id], (updateErr, updateResult) => {
        if (updateErr) {
          console.error('[mentorValidation] Update error:', updateErr);
          return res.status(500).json({
            success: false,
            error: 'DATABASE_ERROR',
            message: 'Failed to validate skill'
          });
        }
        
        // Trigger notification (side-effect, don't block response)
        triggerMentorValidation(user_id, 1, 0).catch(err => {
          console.error('[mentorValidation] Notification error:', err);
        });
        triggerReadinessOutdated(user_id).catch(err => {
          console.error('[mentorValidation] Notification error:', err);
        });
        
        return res.status(200).json({
          success: true,
          message: `Validated: ${skill.skill_name}`,
          skill_id: skill_id,
          user_id: user_id,
          validated_by: mentor_id
        });
      });
    });
    
  } catch (error) {
    console.error('[mentorValidation] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to validate skill'
    });
  }
});

/* ============================================================================
   POST /mentor-validation/reject
   
   Reject a skill with a reason.
   Skill remains but is flagged as rejected.
   ============================================================================ */
router.post('/reject', async (req, res) => {
  const { mentor_id, user_id, skill_id, note } = req.body;
  
  if (!mentor_id || !user_id || !skill_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_FIELDS',
      message: 'mentor_id, user_id, and skill_id are required'
    });
  }
  
  if (!note || note.trim().length < 10) {
    return res.status(400).json({
      success: false,
      error: 'NOTE_REQUIRED',
      message: 'A reason (at least 10 characters) is required when rejecting a skill'
    });
  }
  
  // Prevent self-rejection
  if (mentor_id === user_id) {
    return res.status(403).json({
      success: false,
      error: 'SELF_VALIDATION_NOT_ALLOWED',
      message: 'You cannot reject your own skills'
    });
  }
  
  try {
    // Check if skill exists
    const checkQuery = `
      SELECT us.*, s.name as skill_name
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.skill_id
      WHERE us.user_id = ? AND us.skill_id = ?
    `;
    
    db.query(checkQuery, [user_id, skill_id], (checkErr, checkResults) => {
      if (checkErr) {
        console.error('[mentorValidation] Check error:', checkErr);
        return res.status(500).json({
          success: false,
          error: 'DATABASE_ERROR',
          message: 'Failed to check skill'
        });
      }
      
      if (checkResults.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'SKILL_NOT_FOUND',
          message: 'Skill not found for this user'
        });
      }
      
      const skill = checkResults[0];
      
      // Update skill with rejection (keep original source, just flag as rejected)
      const updateQuery = `
        UPDATE user_skills
        SET 
          validated_by = ?,
          validated_at = NOW(),
          validation_status = 'rejected',
          validation_note = ?
        WHERE user_id = ? AND skill_id = ?
      `;
      
      db.query(updateQuery, [mentor_id, note, user_id, skill_id], (updateErr, updateResult) => {
        if (updateErr) {
          console.error('[mentorValidation] Update error:', updateErr);
          return res.status(500).json({
            success: false,
            error: 'DATABASE_ERROR',
            message: 'Failed to reject skill'
          });
        }
        
        // Trigger notification (side-effect, don't block response)
        triggerMentorValidation(user_id, 0, 1).catch(err => {
          console.error('[mentorValidation] Notification error:', err);
        });
        triggerReadinessOutdated(user_id).catch(err => {
          console.error('[mentorValidation] Notification error:', err);
        });
        
        return res.status(200).json({
          success: true,
          message: `Rejected: ${skill.skill_name}`,
          skill_id: skill_id,
          user_id: user_id,
          rejected_by: mentor_id,
          reason: note
        });
      });
    });
    
  } catch (error) {
    console.error('[mentorValidation] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to reject skill'
    });
  }
});

/* ============================================================================
   GET /mentor-validation/stats/:mentor_id
   
   Get mentor's validation statistics.
   ============================================================================ */
router.get('/stats/:mentor_id', async (req, res) => {
  const { mentor_id } = req.params;
  
  if (!mentor_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_MENTOR_ID',
      message: 'mentor_id is required'
    });
  }
  
  try {
    const query = `
      SELECT 
        COUNT(*) as total_validations,
        SUM(CASE WHEN validation_status = 'validated' THEN 1 ELSE 0 END) as validated_count,
        SUM(CASE WHEN validation_status = 'rejected' THEN 1 ELSE 0 END) as rejected_count
      FROM user_skills
      WHERE validated_by = ?
    `;
    
    db.query(query, [mentor_id], (err, results) => {
      if (err) {
        console.error('[mentorValidation] Stats error:', err);
        return res.status(500).json({
          success: false,
          error: 'DATABASE_ERROR',
          message: 'Failed to fetch stats'
        });
      }
      
      const stats = results[0] || { total_validations: 0, validated_count: 0, rejected_count: 0 };
      
      return res.status(200).json({
        success: true,
        stats: {
          total: stats.total_validations,
          validated: stats.validated_count,
          rejected: stats.rejected_count
        }
      });
    });
    
  } catch (error) {
    console.error('[mentorValidation] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch stats'
    });
  }
});

/* ============================================================================
   GET /mentor-validation/evidence/:user_id/:skill_id
   
   🎓 Evidence Context Feature - No-Chat Validation Support
   
   Returns all context a mentor needs to make an informed validation decision
   WITHOUT requiring any chat or interaction with the user.
   
   Evidence includes:
   1. Resume excerpt (where skill was found, if from resume)
   2. Skill source(s) - self, resume, or both
   3. Related skills (same category the user has)
   4. Role requirement importance (required/optional for target role)
   ============================================================================ */
router.get('/evidence/:user_id/:skill_id', async (req, res) => {
  const { user_id, skill_id } = req.params;
  
  if (!user_id || !skill_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_PARAMS',
      message: 'user_id and skill_id are required'
    });
  }
  
  try {
    // 1. Get the skill details and user's target role
    const skillQuery = `
      SELECT 
        us.user_id,
        us.skill_id,
        us.level,
        us.source,
        us.created_at,
        s.name as skill_name,
        s.category_id,
        c.category_name,
        pi.target_category_id,
        tc.category_name as target_role_name
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.skill_id
      LEFT JOIN categories c ON s.category_id = c.category_id
      LEFT JOIN profile_info pi ON us.user_id = pi.user_id
      LEFT JOIN categories tc ON pi.target_category_id = tc.category_id
      WHERE us.user_id = ? AND us.skill_id = ?
    `;
    
    db.query(skillQuery, [user_id, skill_id], (skillErr, skillResults) => {
      if (skillErr) {
        console.error('[mentorValidation] Evidence skill error:', skillErr);
        return res.status(500).json({
          success: false,
          error: 'DATABASE_ERROR',
          message: 'Failed to fetch skill details'
        });
      }
      
      if (skillResults.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'SKILL_NOT_FOUND',
          message: 'Skill not found for this user'
        });
      }
      
      const skill = skillResults[0];
      const evidence = {
        skill_name: skill.skill_name,
        skill_level: skill.level,
        skill_category: skill.category_name,
        source: skill.source,
        added_at: skill.created_at,
        target_role: skill.target_role_name,
        resume_context: null,
        related_skills: [],
        role_importance: null
      };
      
      // 2. Check for resume context (if source is resume)
      const resumeQuery = `
        SELECT 
          rss.match_source,
          rss.created_at as extracted_at,
          r.original_filename as resume_name
        FROM resume_skill_suggestions rss
        JOIN resumes r ON rss.resume_id = r.resume_id
        WHERE rss.user_id = ? AND rss.skill_id = ?
        ORDER BY rss.created_at DESC
        LIMIT 1
      `;
      
      db.query(resumeQuery, [user_id, skill_id], (resumeErr, resumeResults) => {
        if (!resumeErr && resumeResults.length > 0) {
          evidence.resume_context = {
            match_source: resumeResults[0].match_source || 'Found in resume',
            resume_name: resumeResults[0].resume_name,
            extracted_at: resumeResults[0].extracted_at
          };
        }
        
        // 3. Get related skills (same category)
        const relatedQuery = `
          SELECT 
            s.name as skill_name,
            us.level,
            us.source,
            us.validation_status
          FROM user_skills us
          JOIN skills s ON us.skill_id = s.skill_id
          WHERE us.user_id = ? 
            AND s.category_id = ?
            AND us.skill_id != ?
          ORDER BY us.created_at DESC
          LIMIT 5
        `;
        
        db.query(relatedQuery, [user_id, skill.category_id, skill_id], (relatedErr, relatedResults) => {
          if (!relatedErr && relatedResults.length > 0) {
            evidence.related_skills = relatedResults.map(r => ({
              name: r.skill_name,
              level: r.level,
              source: r.source,
              validation_status: r.validation_status
            }));
          }
          
          // 4. Check role importance (is this skill required for target role?)
          const importanceQuery = `
            SELECT 
              bs.is_required,
              bs.weight,
              bs.benchmark_id
            FROM benchmark_skills bs
            JOIN benchmarks b ON bs.benchmark_id = b.benchmark_id
            WHERE b.category_id = ? AND bs.skill_id = ?
          `;
          
          db.query(importanceQuery, [skill.target_category_id, skill_id], (impErr, impResults) => {
            if (!impErr && impResults.length > 0) {
              const bench = impResults[0];
              evidence.role_importance = {
                is_required: bench.is_required === 1,
                weight: bench.weight,
                importance_level: bench.is_required === 1 ? 'Required' : 'Optional'
              };
            } else {
              // Skill not in benchmark for target role
              evidence.role_importance = {
                is_required: false,
                weight: 0,
                importance_level: 'Not in role requirements'
              };
            }
            
            return res.status(200).json({
              success: true,
              evidence
            });
          });
        });
      });
    });
    
  } catch (error) {
    console.error('[mentorValidation] Evidence error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch evidence context'
    });
  }
});

module.exports = router;
