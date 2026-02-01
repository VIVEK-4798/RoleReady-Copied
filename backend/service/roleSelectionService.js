const express = require('express');
const router = express.Router();
const db = require('../db');
const { triggerRoleChanged } = require('./notificationService');

/* ============================================================================
   🎯 ROLE SELECTION & CHANGE IMPACT SERVICE
   ============================================================================
   
   PURPOSE: Manage user's target role selection with full transparency
   
   CORE RULES:
   - ONE active target role at a time
   - Switching roles does NOT delete history
   - Role change creates new readiness context
   - User intent matters - no auto-calculations
   
   ============================================================================ */

/* ============================================================================
   HELPER: Wrap DB query in Promise
   ============================================================================ */
const queryAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

/* ============================================================================
   GET /target-role/:user_id
   Get user's current target role with details
   ============================================================================ */
router.get('/target-role/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  try {
    const query = `
      SELECT 
        pi.target_category_id,
        pi.target_role_set_at,
        pi.target_role_set_by,
        c.category_name as role_name,
        c.description as role_description,
        c.is_active as role_is_active,
        (SELECT COUNT(*) FROM category_skills cs 
         WHERE cs.category_id = pi.target_category_id AND cs.is_active = TRUE) as required_skills_count,
        (SELECT MAX(rs.calculated_at) FROM readiness_scores rs 
         WHERE rs.user_id = pi.user_id AND rs.category_id = pi.target_category_id) as last_readiness_check
      FROM profile_info pi
      LEFT JOIN categories c ON pi.target_category_id = c.category_id
      WHERE pi.user_id = ?
    `;
    
    const results = await queryAsync(query, [user_id]);
    
    if (results.length === 0) {
      return res.json({
        success: true,
        has_target_role: false,
        target_role: null
      });
    }
    
    const data = results[0];
    
    res.json({
      success: true,
      has_target_role: !!data.target_category_id,
      target_role: data.target_category_id ? {
        category_id: data.target_category_id,
        name: data.role_name,
        description: data.role_description,
        is_active: data.role_is_active,
        required_skills_count: data.required_skills_count,
        set_at: data.target_role_set_at,
        set_by: data.target_role_set_by,
        last_readiness_check: data.last_readiness_check
      } : null
    });
    
  } catch (error) {
    console.error('[roleSelectionService] GET /target-role error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch target role' });
  }
});

/* ============================================================================
   GET /available-roles
   Get all active roles user can select from
   ============================================================================ */
router.get('/available-roles', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.category_id,
        c.category_name as name,
        c.description,
        c.category_color_class as color_class,
        COUNT(DISTINCT cs.skill_id) as skill_count,
        COUNT(DISTINCT CASE WHEN cs.importance = 'required' THEN cs.skill_id END) as required_count
      FROM categories c
      LEFT JOIN category_skills cs ON c.category_id = cs.category_id AND cs.is_active = TRUE
      WHERE c.is_active = TRUE
      GROUP BY c.category_id
      ORDER BY c.category_name
    `;
    
    const roles = await queryAsync(query);
    
    res.json({
      success: true,
      count: roles.length,
      roles
    });
    
  } catch (error) {
    console.error('[roleSelectionService] GET /available-roles error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch roles' });
  }
});

/* ============================================================================
   POST /change-role
   Change user's target role with full impact handling
   ============================================================================ */
router.post('/change-role', async (req, res) => {
  const { user_id, new_role_id, changed_by = 'self' } = req.body;
  
  if (!user_id || !new_role_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'user_id and new_role_id are required' 
    });
  }
  
  try {
    // 1. Get current target role and latest readiness score
    const currentQuery = `
      SELECT 
        pi.target_category_id as current_role_id,
        c.category_name as current_role_name,
        (SELECT readiness_score FROM readiness_scores 
         WHERE user_id = ? AND category_id = pi.target_category_id 
         ORDER BY calculated_at DESC LIMIT 1) as current_readiness_score
      FROM profile_info pi
      LEFT JOIN categories c ON pi.target_category_id = c.category_id
      WHERE pi.user_id = ?
    `;
    
    const currentData = await queryAsync(currentQuery, [user_id, user_id]);
    const current = currentData[0] || {};
    
    // 2. Validate new role exists and is active
    const newRoleQuery = `
      SELECT category_id, category_name, description, is_active
      FROM categories 
      WHERE category_id = ?
    `;
    const newRoleData = await queryAsync(newRoleQuery, [new_role_id]);
    
    if (newRoleData.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Role not found' 
      });
    }
    
    const newRole = newRoleData[0];
    
    if (!newRole.is_active) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot select an inactive role' 
      });
    }
    
    // 3. Check if it's the same role
    if (current.current_role_id === new_role_id) {
      return res.json({
        success: true,
        changed: false,
        message: 'Already targeting this role',
        target_role: {
          category_id: new_role_id,
          name: newRole.category_name,
          description: newRole.description
        }
      });
    }
    
    // 4. Record the change in history
    const historyInsert = `
      INSERT INTO role_change_history 
        (user_id, previous_role_id, new_role_id, changed_by, readiness_score_at_change)
      VALUES (?, ?, ?, ?, ?)
    `;
    await queryAsync(historyInsert, [
      user_id,
      current.current_role_id || null,
      new_role_id,
      changed_by,
      current.current_readiness_score || null
    ]);
    
    // 5. Update profile with new target role
    const updateQuery = `
      UPDATE profile_info 
      SET 
        target_category_id = ?,
        target_role_set_at = NOW(),
        target_role_set_by = ?
      WHERE user_id = ?
    `;
    await queryAsync(updateQuery, [new_role_id, changed_by, user_id]);
    
    // 6. Clear any existing roadmap for this user (will be regenerated on demand)
    const clearRoadmapQuery = `
      DELETE FROM roadmaps WHERE user_id = ?
    `;
    await queryAsync(clearRoadmapQuery, [user_id]);
    
    // 7. Trigger notification for role change (side-effect, don't block)
    triggerRoleChanged(user_id, newRole.category_name).catch(err => {
      console.error('[roleSelectionService] Failed to trigger notification:', err);
    });
    
    res.json({
      success: true,
      changed: true,
      message: 'Target role updated successfully',
      previous_role: current.current_role_id ? {
        category_id: current.current_role_id,
        name: current.current_role_name,
        last_readiness_score: current.current_readiness_score
      } : null,
      new_role: {
        category_id: new_role_id,
        name: newRole.category_name,
        description: newRole.description
      },
      next_steps: {
        message: 'Your readiness context has been reset. Calculate readiness for your new role to see your current standing.',
        action: 'CALCULATE_READINESS'
      }
    });
    
  } catch (error) {
    console.error('[roleSelectionService] POST /change-role error:', error);
    res.status(500).json({ success: false, message: 'Failed to change role' });
  }
});

/* ============================================================================
   GET /role-history/:user_id
   Get user's role change history (read-only view of past roles)
   ============================================================================ */
router.get('/role-history/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  try {
    const query = `
      SELECT 
        rch.id,
        rch.previous_role_id,
        prev_cat.category_name as previous_role_name,
        rch.new_role_id,
        new_cat.category_name as new_role_name,
        rch.changed_at,
        rch.changed_by,
        rch.readiness_score_at_change,
        rch.reason
      FROM role_change_history rch
      LEFT JOIN categories prev_cat ON rch.previous_role_id = prev_cat.category_id
      LEFT JOIN categories new_cat ON rch.new_role_id = new_cat.category_id
      WHERE rch.user_id = ?
      ORDER BY rch.changed_at DESC
      LIMIT 20
    `;
    
    const history = await queryAsync(query, [user_id]);
    
    res.json({
      success: true,
      count: history.length,
      history
    });
    
  } catch (error) {
    console.error('[roleSelectionService] GET /role-history error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch role history' });
  }
});

/* ============================================================================
   GET /role-readiness-snapshot/:user_id/:role_id
   Get last readiness snapshot for a specific role (for viewing past roles)
   ============================================================================ */
router.get('/role-readiness-snapshot/:user_id/:role_id', async (req, res) => {
  const { user_id, role_id } = req.params;
  
  try {
    const query = `
      SELECT 
        rs.readiness_id,
        rs.readiness_score,
        rs.readiness_status,
        rs.calculated_at,
        c.category_name as role_name,
        (SELECT COUNT(*) FROM readiness_skill_breakdown rsb 
         WHERE rsb.readiness_id = rs.readiness_id AND rsb.user_has_skill = TRUE) as skills_matched,
        (SELECT COUNT(*) FROM readiness_skill_breakdown rsb 
         WHERE rsb.readiness_id = rs.readiness_id) as total_skills
      FROM readiness_scores rs
      JOIN categories c ON rs.category_id = c.category_id
      WHERE rs.user_id = ? AND rs.category_id = ?
      ORDER BY rs.calculated_at DESC
      LIMIT 1
    `;
    
    const results = await queryAsync(query, [user_id, role_id]);
    
    if (results.length === 0) {
      return res.json({
        success: true,
        has_snapshot: false,
        snapshot: null
      });
    }
    
    res.json({
      success: true,
      has_snapshot: true,
      snapshot: results[0]
    });
    
  } catch (error) {
    console.error('[roleSelectionService] GET /role-readiness-snapshot error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch snapshot' });
  }
});

/* ============================================================================
   GET /impact-preview/:user_id/:new_role_id
   Preview the impact of switching to a new role BEFORE confirming
   ============================================================================ */
router.get('/impact-preview/:user_id/:new_role_id', async (req, res) => {
  const { user_id, new_role_id } = req.params;
  
  try {
    // Get current role info
    const currentQuery = `
      SELECT 
        pi.target_category_id,
        c.category_name as current_role_name,
        (SELECT readiness_score FROM readiness_scores 
         WHERE user_id = ? AND category_id = pi.target_category_id 
         ORDER BY calculated_at DESC LIMIT 1) as current_readiness_score
      FROM profile_info pi
      LEFT JOIN categories c ON pi.target_category_id = c.category_id
      WHERE pi.user_id = ?
    `;
    const currentData = await queryAsync(currentQuery, [user_id, user_id]);
    const current = currentData[0] || {};
    
    // Get new role info with skill comparison
    const newRoleQuery = `
      SELECT 
        c.category_id,
        c.category_name as name,
        c.description,
        COUNT(DISTINCT cs.skill_id) as total_skills,
        COUNT(DISTINCT CASE WHEN cs.importance = 'required' THEN cs.skill_id END) as required_skills,
        (SELECT COUNT(*) FROM user_skills us 
         JOIN category_skills cs2 ON us.skill_id = cs2.skill_id 
         WHERE us.user_id = ? AND cs2.category_id = ? AND cs2.is_active = TRUE) as user_matching_skills
      FROM categories c
      LEFT JOIN category_skills cs ON c.category_id = cs.category_id AND cs.is_active = TRUE
      WHERE c.category_id = ?
      GROUP BY c.category_id
    `;
    const newRoleData = await queryAsync(newRoleQuery, [user_id, new_role_id, new_role_id]);
    
    if (newRoleData.length === 0) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    
    const newRole = newRoleData[0];
    
    // Check if user has any previous readiness for this role
    const prevReadinessQuery = `
      SELECT readiness_score, calculated_at 
      FROM readiness_scores 
      WHERE user_id = ? AND category_id = ?
      ORDER BY calculated_at DESC LIMIT 1
    `;
    const prevReadiness = await queryAsync(prevReadinessQuery, [user_id, new_role_id]);
    
    res.json({
      success: true,
      current_role: current.target_category_id ? {
        category_id: current.target_category_id,
        name: current.current_role_name,
        readiness_score: current.current_readiness_score
      } : null,
      new_role: {
        category_id: newRole.category_id,
        name: newRole.name,
        description: newRole.description,
        total_skills: newRole.total_skills,
        required_skills: newRole.required_skills,
        user_matching_skills: newRole.user_matching_skills,
        estimated_match_percent: newRole.total_skills > 0 
          ? Math.round((newRole.user_matching_skills / newRole.total_skills) * 100)
          : 0
      },
      previous_attempt: prevReadiness.length > 0 ? {
        readiness_score: prevReadiness[0].readiness_score,
        calculated_at: prevReadiness[0].calculated_at
      } : null,
      impact_summary: {
        will_clear_roadmap: true,
        will_reset_readiness_context: true,
        history_preserved: true
      }
    });
    
  } catch (error) {
    console.error('[roleSelectionService] GET /impact-preview error:', error);
    res.status(500).json({ success: false, message: 'Failed to get impact preview' });
  }
});

module.exports = router;
