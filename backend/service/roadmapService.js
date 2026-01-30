const express = require('express');
const router = express.Router();
const db = require('../db');

/* ============================================================================
   🧭 DYNAMIC ROADMAP SERVICE - STEP 1: Input Contract
   ============================================================================
   
   This service generates skill improvement roadmaps from readiness data.
   
   LOCKED PRINCIPLES:
   ✅ Roadmap is GENERATED, never manually edited
   ✅ Roadmap is DERIVED from latest readiness breakdown
   ✅ Roadmap updates ONLY after readiness recalculation
   ✅ Roadmap gives PRIORITIES, not deadlines
   ✅ Roadmap is ADVISORY, not enforced
   
   ============================================================================ */

/* ============================================================================
   CONSTANTS
   ============================================================================ */

// Level numeric values for gap calculation
const LEVEL_VALUES = {
  'none': 0,
  'beginner': 1,
  'intermediate': 2,
  'advanced': 3,
  'expert': 4
};

// Priority tier thresholds
const PRIORITY_TIERS = {
  CRITICAL: { min: 80, label: 'Critical', color: 'red', emoji: '🔴' },
  HIGH: { min: 50, label: 'High', color: 'orange', emoji: '🟠' },
  MEDIUM: { min: 25, label: 'Medium', color: 'yellow', emoji: '🟡' },
  LOW: { min: 0, label: 'Low', color: 'green', emoji: '🟢' }
};

/* ============================================================================
   STEP 2: ROADMAP ITEM DEFINITION
   ============================================================================
   
   A roadmap is a list of RoadmapItems.
   Each item is explainable - user can understand WHY it's there.
   
   ============================================================================ */

// Roadmap item categories (WHY is this skill in the roadmap?)
const ROADMAP_CATEGORIES = {
  REQUIRED_GAP: {
    key: 'required_gap',
    label: 'Required Gap',
    description: 'Required skill you haven\'t met yet',
    emoji: '🔴',
    priority_boost: 30  // Boost priority score for required skills
  },
  OPTIONAL_GAP: {
    key: 'optional_gap',
    label: 'Optional Gap',
    description: 'Nice-to-have skill that would boost your score',
    emoji: '🟡',
    priority_boost: 0
  },
  STRENGTHEN: {
    key: 'strengthen',
    label: 'Strengthen',
    description: 'Skill you have, but could level up',
    emoji: '🔵',
    priority_boost: -10  // Lower priority than gaps
  }
};

// Priority levels for roadmap items
const PRIORITY_LEVELS = {
  HIGH: { key: 'HIGH', label: 'High Priority', emoji: '🔥', min_score: 60 },
  MEDIUM: { key: 'MEDIUM', label: 'Medium Priority', emoji: '📈', min_score: 30 },
  LOW: { key: 'LOW', label: 'Low Priority', emoji: '📋', min_score: 0 }
};

// Confidence levels based on validation status
const CONFIDENCE_LEVELS = {
  VALIDATED: { key: 'validated', label: 'Verified', emoji: '✓' },
  UNVALIDATED: { key: 'unvalidated', label: 'Self-reported', emoji: '○' }
};

/**
 * ROADMAP ITEM STRUCTURE
 * 
 * This is the output unit of the roadmap generator.
 * Each item represents ONE actionable skill improvement.
 * 
 * @typedef {Object} RoadmapItem
 * @property {number} skill_id - Skill identifier
 * @property {string} skill_name - Human-readable skill name
 * @property {string} reason - WHY this skill is in the roadmap (explainable)
 * @property {string} priority - HIGH | MEDIUM | LOW
 * @property {string} category - required_gap | optional_gap | strengthen
 * @property {string} confidence - validated | unvalidated
 * @property {number} priority_score - Numeric score for sorting (internal)
 * @property {Object} details - Additional context for UI display
 */

/* ============================================================================
   STEP 3: PRIORITY RULES (CORE LOGIC)
   ============================================================================
   
   These are DETERMINISTIC rules that make the roadmap credible.
   Each rule is explicit and explainable.
   
   RULE 1: Missing REQUIRED skills → HIGH priority
           "React is required for Frontend Intern but missing"
   
   RULE 2: Rejected skills → HIGH priority (fix or remove)
           "Git was rejected by mentor — needs correction"
   
   RULE 3: Weak but present required skills → MEDIUM
           "JavaScript present but not validated"
   
   RULE 4: Optional missing skills → LOW
           "TypeScript is optional for this role"
   
   RULE 5: Validated skills → EXCLUDED from roadmap
           Do NOT tell users to "work on" validated skills.
   
   ============================================================================ */

/**
 * Generates a single RoadmapItem from a skill in the input contract.
 * Applies the 5 deterministic priority rules.
 * 
 * @param {Object} skill - Skill from input contract
 * @returns {RoadmapItem|null} - Roadmap item or null if skill needs no action
 */
const generateRoadmapItem = (skill) => {
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RULE 5: Validated skills → EXCLUDED from roadmap
  // ═══════════════════════════════════════════════════════════════════════════
  // If a skill is validated AND meets the requirement, it's done.
  // Do NOT suggest working on validated skills.
  if (skill.validation_status === 'validated' && skill.is_met) {
    return null; // Skill is verified and sufficient - no action needed
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RULE 2: Rejected skills → HIGH priority (fix or remove)
  // ═══════════════════════════════════════════════════════════════════════════
  // Rejected by mentor = needs immediate attention
  if (skill.validation_status === 'rejected') {
    return {
      skill_id: skill.skill_id,
      skill_name: skill.skill_name,
      reason: `${skill.skill_name} was rejected by mentor — needs correction or removal`,
      priority: 'HIGH',
      category: 'rejected',
      confidence: 'rejected',
      priority_score: 100, // Highest priority
      rule_applied: 'RULE_2_REJECTED',
      details: {
        current_level: skill.user_level,
        target_level: skill.required_level,
        level_gap: skill.level_gap,
        is_required: skill.is_required,
        weight: skill.weight,
        gap_points: skill.gap_points,
        skill_source: skill.skill_source,
        category_name: skill.category_name,
        category_label: 'Rejected',
        category_emoji: '⚠️',
        priority_emoji: '🚨',
        confidence_label: 'Rejected by mentor',
        action_hint: 'Review mentor feedback, improve evidence, or remove this skill'
      }
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RULE 1: Missing REQUIRED skills → HIGH priority
  // ═══════════════════════════════════════════════════════════════════════════
  // Required skill that user doesn't have or hasn't met the level
  if (skill.is_required && !skill.is_met) {
    const hasSkill = skill.user_level !== 'none';
    const reason = hasSkill
      ? `${skill.skill_name} is required for ${skill.category_name || 'this role'}: currently ${skill.user_level}, need ${skill.required_level}`
      : `${skill.skill_name} is required for ${skill.category_name || 'this role'} but missing from your profile`;
    
    return {
      skill_id: skill.skill_id,
      skill_name: skill.skill_name,
      reason: reason,
      priority: 'HIGH',
      category: 'required_gap',
      confidence: skill.validation_status === 'validated' ? 'validated' : 'unvalidated',
      priority_score: 80 + (skill.weight || 1) * 5, // Base 80 + weight bonus
      rule_applied: 'RULE_1_REQUIRED_MISSING',
      details: {
        current_level: skill.user_level,
        target_level: skill.required_level,
        level_gap: skill.level_gap,
        is_required: true,
        weight: skill.weight,
        gap_points: skill.gap_points,
        skill_source: skill.skill_source,
        category_name: skill.category_name,
        category_label: 'Required Gap',
        category_emoji: '🔴',
        priority_emoji: '🔥',
        confidence_label: skill.validation_status === 'validated' ? 'Verified' : 'Self-reported',
        action_hint: hasSkill ? `Level up from ${skill.user_level} to ${skill.required_level}` : 'Add this skill to your profile'
      }
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RULE 3: Weak but present required skills → MEDIUM
  // ═══════════════════════════════════════════════════════════════════════════
  // Required skill that IS met but NOT validated (credibility gap)
  if (skill.is_required && skill.is_met && skill.validation_status !== 'validated') {
    return {
      skill_id: skill.skill_id,
      skill_name: skill.skill_name,
      reason: `${skill.skill_name} meets requirements but is not mentor-validated — consider getting verification`,
      priority: 'MEDIUM',
      category: 'strengthen',
      confidence: 'unvalidated',
      priority_score: 50 + (skill.weight || 1) * 3, // Base 50 + weight bonus
      rule_applied: 'RULE_3_UNVALIDATED_REQUIRED',
      details: {
        current_level: skill.user_level,
        target_level: skill.required_level,
        level_gap: 0, // Met the requirement
        is_required: true,
        weight: skill.weight,
        gap_points: 0,
        skill_source: skill.skill_source,
        category_name: skill.category_name,
        category_label: 'Needs Validation',
        category_emoji: '🔵',
        priority_emoji: '📈',
        confidence_label: 'Self-reported',
        action_hint: 'Request mentor validation to strengthen credibility'
      }
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RULE 4: Optional missing skills → LOW
  // ═══════════════════════════════════════════════════════════════════════════
  // Nice-to-have skill that would boost score
  if (!skill.is_required && !skill.is_met) {
    return {
      skill_id: skill.skill_id,
      skill_name: skill.skill_name,
      reason: `${skill.skill_name} is optional for ${skill.category_name || 'this role'} — would boost your score if added`,
      priority: 'LOW',
      category: 'optional_gap',
      confidence: skill.validation_status === 'validated' ? 'validated' : 'unvalidated',
      priority_score: 20 + (skill.weight || 1) * 2, // Base 20 + small weight bonus
      rule_applied: 'RULE_4_OPTIONAL_MISSING',
      details: {
        current_level: skill.user_level,
        target_level: skill.required_level,
        level_gap: skill.level_gap,
        is_required: false,
        weight: skill.weight,
        gap_points: skill.gap_points,
        skill_source: skill.skill_source,
        category_name: skill.category_name,
        category_label: 'Optional Gap',
        category_emoji: '🟡',
        priority_emoji: '📋',
        confidence_label: skill.validation_status === 'validated' ? 'Verified' : 'Self-reported',
        action_hint: 'Consider adding this skill to improve your readiness score'
      }
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DEFAULT: No action needed
  // ═══════════════════════════════════════════════════════════════════════════
  // This covers:
  // - Optional skills that ARE met (validated or not)
  // - Any edge cases we haven't explicitly handled
  return null;
};

/**
 * Generates a complete roadmap from the input contract.
 * Applies the 5 priority rules to each skill.
 * 
 * @param {Object} inputContract - From fetchRoadmapInputData()
 * @returns {Object} - Complete roadmap with items and metadata
 */
const generateRoadmap = (inputContract) => {
  const items = [];
  
  console.log(`[generateRoadmap] Processing ${inputContract.skills.length} skills from input contract`);
  
  // Process each skill from the breakdown
  for (const skill of inputContract.skills) {
    const item = generateRoadmapItem(skill);
    if (item) {
      items.push(item);
      console.log(`[generateRoadmap] Skill '${skill.skill_name}' → ${item.rule_applied} (priority=${item.priority})`);
    } else {
      console.log(`[generateRoadmap] Skill '${skill.skill_name}' → EXCLUDED (is_met=${skill.is_met}, validation=${skill.validation_status})`);
    }
  }
  
  // Sort by priority score (highest first)
  items.sort((a, b) => b.priority_score - a.priority_score);
  
  // Add rank to each item
  items.forEach((item, index) => {
    item.rank = index + 1;
  });
  
  // Compute summary with rule-based categories
  const summary = {
    total_items: items.length,
    
    // By priority level
    by_priority: {
      high: items.filter(i => i.priority === 'HIGH').length,
      medium: items.filter(i => i.priority === 'MEDIUM').length,
      low: items.filter(i => i.priority === 'LOW').length
    },
    
    // By category (rule-based)
    by_category: {
      rejected: items.filter(i => i.category === 'rejected').length,        // RULE 2
      required_gap: items.filter(i => i.category === 'required_gap').length, // RULE 1
      strengthen: items.filter(i => i.category === 'strengthen').length,     // RULE 3
      optional_gap: items.filter(i => i.category === 'optional_gap').length  // RULE 4
    },
    
    // By rule applied
    by_rule: {
      rule_1_required_missing: items.filter(i => i.rule_applied === 'RULE_1_REQUIRED_MISSING').length,
      rule_2_rejected: items.filter(i => i.rule_applied === 'RULE_2_REJECTED').length,
      rule_3_unvalidated_required: items.filter(i => i.rule_applied === 'RULE_3_UNVALIDATED_REQUIRED').length,
      rule_4_optional_missing: items.filter(i => i.rule_applied === 'RULE_4_OPTIONAL_MISSING').length
      // RULE 5 items are excluded, so count = 0 by design
    },
    
    // Quick stats
    needs_immediate_action: items.filter(i => i.priority === 'HIGH').length,
    excluded_validated: inputContract.skills.filter(s => 
      s.validation_status === 'validated' && s.is_met
    ).length
  };
  
  // Build rules explanation for transparency
  const rules_applied = [
    { rule: 'RULE_1', description: 'Missing required skills → HIGH priority', count: summary.by_rule.rule_1_required_missing },
    { rule: 'RULE_2', description: 'Rejected skills → HIGH priority', count: summary.by_rule.rule_2_rejected },
    { rule: 'RULE_3', description: 'Unvalidated required skills → MEDIUM priority', count: summary.by_rule.rule_3_unvalidated_required },
    { rule: 'RULE_4', description: 'Optional missing skills → LOW priority', count: summary.by_rule.rule_4_optional_missing },
    { rule: 'RULE_5', description: 'Validated & met skills → EXCLUDED', count: summary.excluded_validated }
  ];
  
  /* ============================================================================
     🛡️ STEP 7: Edge Case Detection
     ============================================================================
     
     1. No missing skills → "You're ready" message
     2. Only optional gaps → Explain optional nature
     3. Validation pending → Roadmap explains uncertainty
     ============================================================================ */
  
  // Count validation pending skills
  const pendingValidationCount = inputContract.skills.filter(s => 
    s.validation_status === 'pending'
  ).length;
  
  // Count unvalidated required skills that user has (RULE 3 items)
  const unvalidatedRequiredCount = summary.by_rule.rule_3_unvalidated_required;
  
  // Determine edge case status
  const edge_case = {
    // No items at all = fully ready
    is_fully_ready: items.length === 0,
    
    // Only optional gaps (no HIGH priority items, only LOW from RULE 4)
    only_optional_gaps: items.length > 0 && 
      summary.by_priority.high === 0 && 
      summary.by_priority.medium === 0 &&
      summary.by_priority.low > 0,
    
    // Has skills pending mentor validation
    has_pending_validation: pendingValidationCount > 0,
    pending_validation_count: pendingValidationCount,
    
    // Has unvalidated required skills (creates uncertainty)
    has_unvalidated_required: unvalidatedRequiredCount > 0,
    unvalidated_required_count: unvalidatedRequiredCount,
    
    // Generate appropriate message
    message: null,
    message_type: null
  };
  
  // Set edge case message
  if (edge_case.is_fully_ready) {
    edge_case.message = "🎉 You're fully ready! All required skills are met and validated. Keep up the great work!";
    edge_case.message_type = 'success';
  } else if (edge_case.only_optional_gaps) {
    edge_case.message = "✅ You've met all required skills! The items below are optional enhancements that could boost your profile further, but aren't required for this role.";
    edge_case.message_type = 'info';
  } else if (edge_case.has_pending_validation && edge_case.has_unvalidated_required) {
    edge_case.message = `📋 Your roadmap includes ${unvalidatedRequiredCount} skill(s) that haven't been validated by a mentor yet. These priorities may change after mentor review.`;
    edge_case.message_type = 'warning';
  } else if (edge_case.has_unvalidated_required) {
    edge_case.message = `💡 ${unvalidatedRequiredCount} required skill(s) are unvalidated. Consider requesting mentor validation to boost your readiness score.`;
    edge_case.message_type = 'info';
  }
  
  return {
    readiness_id: inputContract.readiness_id,
    user_id: inputContract.user_id,
    role_id: inputContract.role_id,
    role_name: inputContract.role_name,
    current_score: inputContract.current_score,
    generated_at: new Date().toISOString(),
    items: items,
    summary: summary,
    rules_applied: rules_applied,
    edge_case: edge_case
  };
};

/**
 * Helper: Get level name from numeric value
 */
const getLevelName = (value) => {
  const levels = ['none', 'beginner', 'intermediate', 'advanced', 'expert'];
  return levels[Math.min(value, 4)] || 'expert';
};

/* ============================================================================
   STEP 1: INPUT CONTRACT - Fetch Roadmap Input Data
   
   This function gathers ALL data needed for roadmap generation.
   It reads from readiness breakdown and related tables.
   
   This is the ONLY entry point for roadmap data.
   ============================================================================ */

/**
 * Fetches the complete input data for roadmap generation.
 * 
 * @param {number} user_id - User to generate roadmap for
 * @param {number} role_id - Target role (optional, uses profile default)
 * @returns {Promise<RoadmapInputContract>} - Complete input data
 */
const fetchRoadmapInputData = (user_id, role_id = null) => {
  return new Promise((resolve, reject) => {
    // Step 1: Get user's latest readiness score for the role
    const readinessQuery = `
      SELECT 
        rs.readiness_id,
        rs.user_id,
        rs.category_id as role_id,
        rs.total_score as score,
        rs.max_possible_score,
        rs.calculated_at,
        c.category_name as role_name
      FROM readiness_scores rs
      JOIN categories c ON rs.category_id = c.category_id
      WHERE rs.user_id = ?
        ${role_id ? 'AND rs.category_id = ?' : ''}
      ORDER BY rs.calculated_at DESC
      LIMIT 1
    `;
    
    const readinessParams = role_id ? [user_id, role_id] : [user_id];
    
    db.query(readinessQuery, readinessParams, (err, readinessResults) => {
      if (err) {
        console.error('[roadmapService] Readiness query error:', err);
        return reject({ error: 'DATABASE_ERROR', message: 'Failed to fetch readiness data' });
      }
      
      if (readinessResults.length === 0) {
        return reject({ 
          error: 'NO_READINESS_FOUND', 
          message: 'No readiness calculation found. Please calculate readiness first.' 
        });
      }
      
      const readiness = readinessResults[0];
      
      // Step 2: Get the breakdown for this readiness score
      // Note: Using category_skills instead of benchmark_skills
      const breakdownQuery = `
        SELECT 
          rsb.skill_id,
          s.name as skill_name,
          s.category_id,
          c.category_name,
          rsb.required_weight,
          rsb.achieved_weight,
          rsb.status,
          rsb.skill_source,
          us.validation_status,
          cs.weight,
          cs.importance
        FROM readiness_score_breakdown rsb
        JOIN skills s ON rsb.skill_id = s.skill_id
        LEFT JOIN categories c ON s.category_id = c.category_id
        LEFT JOIN user_skills us ON us.user_id = ? AND us.skill_id = rsb.skill_id
        LEFT JOIN category_skills cs ON cs.skill_id = rsb.skill_id
          AND cs.category_id = ?
        WHERE rsb.readiness_id = ?
        ORDER BY cs.importance = 'required' DESC, cs.weight DESC
      `;
      
      db.query(breakdownQuery, [user_id, readiness.role_id, readiness.readiness_id], (breakdownErr, breakdownResults) => {
        if (breakdownErr) {
          console.error('[roadmapService] Breakdown query error:', breakdownErr);
          return reject({ error: 'DATABASE_ERROR', message: 'Failed to fetch breakdown data' });
        }
        
        console.log(`[roadmapService] fetchRoadmapInputData: Found ${breakdownResults.length} breakdown skills`);
        if (breakdownResults.length > 0) {
          console.log('[roadmapService] Sample breakdown skill:', JSON.stringify(breakdownResults[0]));
        }
        
        // Step 3: Transform into input contract format
        // Adapted for category_skills structure and readiness_score_breakdown columns
        const skills = breakdownResults.map(skill => {
          // Use status from breakdown to determine if skill is met
          const isMet = skill.status === 'met';
          const gapPoints = (skill.required_weight || 0) - (skill.achieved_weight || 0);
          
          // Determine if skill is required (default to 'optional' if not found in category_skills)
          // This handles cases where category_skills JOIN returns NULL
          const importance = skill.importance || 'optional';
          const isRequired = importance === 'required';
          
          return {
            skill_id: skill.skill_id,
            skill_name: skill.skill_name,
            category_id: skill.category_id,
            category_name: skill.category_name,
            
            // Levels - use 'none' for missing skills to match RULE 1 check
            user_level: isMet ? 'intermediate' : 'none',
            required_level: 'intermediate',
            user_level_value: skill.achieved_weight || 0,
            required_level_value: skill.required_weight || 0,
            level_gap: gapPoints > 0 ? gapPoints : 0,
            
            // Importance (from category_skills, with fallback)
            is_required: isRequired,
            weight: skill.weight || 1,
            
            // Points
            points_earned: skill.achieved_weight || 0,
            points_possible: skill.required_weight || 0,
            gap_points: gapPoints > 0 ? gapPoints : 0,
            
            // Status
            is_met: isMet,
            validation_status: skill.validation_status || 'none',
            skill_source: skill.skill_source || 'self'
          };
        });
        
        // Step 4: Compute summary
        const summary = {
          total_skills: skills.length,
          met_count: skills.filter(s => s.is_met).length,
          missing_count: skills.filter(s => !s.is_met).length,
          required_missing: skills.filter(s => !s.is_met && s.is_required).length,
          optional_missing: skills.filter(s => !s.is_met && !s.is_required).length,
          total_gap_points: skills.reduce((sum, s) => sum + s.gap_points, 0)
        };
        
        // Step 5: Return complete input contract
        // Calculate percentage score
        const maxScore = readiness.max_possible_score || 100;
        const percentageScore = maxScore > 0 ? Math.round((readiness.score / maxScore) * 100) : 0;
        
        console.log(`[roadmapService] Summary: total=${summary.total_skills}, met=${summary.met_count}, missing=${summary.missing_count}, required_missing=${summary.required_missing}`);
        
        const inputContract = {
          readiness_id: readiness.readiness_id,
          user_id: readiness.user_id,
          role_id: readiness.role_id,
          role_name: readiness.role_name,
          current_score: percentageScore,
          calculated_at: readiness.calculated_at,
          skills: skills,
          summary: summary
        };
        
        resolve(inputContract);
      });
    });
  });
};

/* ============================================================================
   GET /roadmap/input/:user_id
   
   Debug/diagnostic endpoint to view the raw input contract.
   Useful for verifying data before roadmap generation.
   ============================================================================ */
router.get('/input/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { role_id } = req.query;
  
  const parsedUserId = parseInt(user_id);
  if (!user_id || isNaN(parsedUserId)) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_USER_ID',
      message: 'user_id must be a valid number'
    });
  }
  
  try {
    const inputData = await fetchRoadmapInputData(
      parseInt(user_id), 
      role_id ? parseInt(role_id) : null
    );
    
    return res.status(200).json({
      success: true,
      message: 'Roadmap input contract data',
      input: inputData
    });
    
  } catch (error) {
    console.error('[roadmapService] Input fetch error:', error);
    return res.status(error.error === 'NO_READINESS_FOUND' ? 404 : 500).json({
      success: false,
      error: error.error || 'INTERNAL_ERROR',
      message: error.message || 'Failed to fetch roadmap input data'
    });
  }
});

/* ============================================================================
   GET /roadmap/validate-contract/:user_id
   
   Validates that all required data is present for roadmap generation.
   Returns a checklist of what's available vs missing.
   ============================================================================ */
router.get('/validate-contract/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_USER_ID',
      message: 'user_id is required'
    });
  }
  
  const validation = {
    user_id: parseInt(user_id),
    checks: [],
    is_valid: true,
    can_generate_roadmap: false
  };
  
  try {
    // Check 1: User exists
    const userCheck = await new Promise((resolve) => {
      db.query('SELECT user_id, name FROM user WHERE user_id = ?', [user_id], (err, results) => {
        resolve({ exists: !err && results.length > 0, data: results?.[0] });
      });
    });
    validation.checks.push({
      name: 'User exists',
      passed: userCheck.exists,
      detail: userCheck.exists ? `Found: ${userCheck.data?.name}` : 'User not found'
    });
    
    // Check 2: Has readiness score
    const readinessCheck = await new Promise((resolve) => {
      db.query(
        'SELECT readiness_id, score, calculated_at FROM readiness_scores WHERE user_id = ? ORDER BY calculated_at DESC LIMIT 1',
        [user_id],
        (err, results) => {
          resolve({ exists: !err && results.length > 0, data: results?.[0] });
        }
      );
    });
    validation.checks.push({
      name: 'Has readiness score',
      passed: readinessCheck.exists,
      detail: readinessCheck.exists 
        ? `Score: ${readinessCheck.data?.score}% (${new Date(readinessCheck.data?.calculated_at).toLocaleDateString()})`
        : 'No readiness calculation found'
    });
    
    // Check 3: Has breakdown data
    if (readinessCheck.exists) {
      const breakdownCheck = await new Promise((resolve) => {
        db.query(
          'SELECT COUNT(*) as count FROM readiness_score_breakdown WHERE readiness_id = ?',
          [readinessCheck.data.readiness_id],
          (err, results) => {
            resolve({ count: results?.[0]?.count || 0 });
          }
        );
      });
      validation.checks.push({
        name: 'Has breakdown data',
        passed: breakdownCheck.count > 0,
        detail: `${breakdownCheck.count} skills in breakdown`
      });
      
      // Check 4: Has gap skills (skills not yet met)
      const gapCheck = await new Promise((resolve) => {
        db.query(
          `SELECT COUNT(*) as count FROM readiness_score_breakdown 
           WHERE readiness_id = ? AND points_earned < points_possible`,
          [readinessCheck.data.readiness_id],
          (err, results) => {
            resolve({ count: results?.[0]?.count || 0 });
          }
        );
      });
      validation.checks.push({
        name: 'Has skill gaps to improve',
        passed: gapCheck.count > 0,
        detail: gapCheck.count > 0 
          ? `${gapCheck.count} skills can be improved`
          : 'All skills already at required level!'
      });
    }
    
    // Determine overall validity
    validation.is_valid = validation.checks.every(c => c.passed);
    validation.can_generate_roadmap = validation.checks.filter(c => c.passed).length >= 3;
    
    return res.status(200).json({
      success: true,
      validation
    });
    
  } catch (error) {
    console.error('[roadmapService] Validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to validate contract'
    });
  }
});

/* ============================================================================
   GET /roadmap/generate/:user_id
   
   STEP 2: Generate a roadmap from the user's latest readiness data.
   
   This is the main endpoint that produces the actionable roadmap.
   Each item is explainable with: reason, priority, category, confidence.
   ============================================================================ */
router.get('/generate/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { role_id, limit } = req.query;
  
  const parsedUserId = parseInt(user_id);
  if (!user_id || isNaN(parsedUserId)) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_USER_ID',
      message: 'user_id must be a valid number'
    });
  }
  
  try {
    // Step 1: Fetch the input contract
    const inputData = await fetchRoadmapInputData(
      parseInt(user_id),
      role_id ? parseInt(role_id) : null
    );
    
    // Step 2: Generate the roadmap
    const roadmap = generateRoadmap(inputData);
    
    // Step 3: Apply limit if specified
    if (limit && !isNaN(parseInt(limit))) {
      roadmap.items = roadmap.items.slice(0, parseInt(limit));
      roadmap.is_truncated = roadmap.summary.total_items > parseInt(limit);
    }
    
    return res.status(200).json({
      success: true,
      message: `Generated roadmap with ${roadmap.items.length} items`,
      roadmap
    });
    
  } catch (error) {
    console.error('[roadmapService] Generate error:', error);
    return res.status(error.error === 'NO_READINESS_FOUND' ? 404 : 500).json({
      success: false,
      error: error.error || 'INTERNAL_ERROR',
      message: error.message || 'Failed to generate roadmap'
    });
  }
});

/* ============================================================================
   GET /roadmap/top/:user_id
   
   Quick endpoint to get just the top N priority items.
   Useful for dashboard widgets and quick views.
   ============================================================================ */
router.get('/top/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { count = 5, role_id } = req.query;
  
  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_USER_ID',
      message: 'user_id is required'
    });
  }
  
  try {
    const inputData = await fetchRoadmapInputData(
      parseInt(user_id),
      role_id ? parseInt(role_id) : null
    );
    
    const roadmap = generateRoadmap(inputData);
    const topItems = roadmap.items.slice(0, parseInt(count));
    
    return res.status(200).json({
      success: true,
      user_id: parseInt(user_id),
      role_name: roadmap.role_name,
      current_score: roadmap.current_score,
      total_items: roadmap.summary.total_items,
      showing: topItems.length,
      top_items: topItems.map(item => ({
        rank: item.rank,
        skill_name: item.skill_name,
        priority: item.priority,
        category: item.details.category_label,
        reason: item.reason,
        emoji: `${item.details.category_emoji} ${item.details.priority_emoji}`
      }))
    });
    
  } catch (error) {
    console.error('[roadmapService] Top items error:', error);
    return res.status(error.error === 'NO_READINESS_FOUND' ? 404 : 500).json({
      success: false,
      error: error.error || 'INTERNAL_ERROR',
      message: error.message || 'Failed to get top roadmap items'
    });
  }
});

/* ============================================================================
   STEP 4: ROADMAP SNAPSHOT PERSISTENCE
   ============================================================================
   
   Roadmaps are SNAPSHOTS, not live logic.
   
   Why snapshot?
   - Lets users see how roadmap changed over time
   - Aligns with readiness time-series
   - Avoids recalculation confusion
   
   ============================================================================ */

/**
 * Saves a roadmap to the database as a snapshot.
 * 
 * @param {Object} roadmap - Generated roadmap from generateRoadmap()
 * @returns {Promise<number>} - The saved roadmap_id
 */
const saveRoadmapSnapshot = (roadmap) => {
  return new Promise((resolve, reject) => {
    // Insert the roadmap header
    const insertRoadmapQuery = `
      INSERT INTO roadmaps (
        user_id, role_id, readiness_id, readiness_score,
        total_items, high_priority_count, medium_priority_count, low_priority_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const roadmapParams = [
      roadmap.user_id,
      roadmap.role_id,
      roadmap.readiness_id,
      roadmap.current_score,
      roadmap.summary.total_items,
      roadmap.summary.by_priority.high,
      roadmap.summary.by_priority.medium,
      roadmap.summary.by_priority.low
    ];
    
    db.query(insertRoadmapQuery, roadmapParams, (err, result) => {
      if (err) {
        console.error('[roadmapService] Save roadmap error:', err);
        return reject({ error: 'DATABASE_ERROR', message: 'Failed to save roadmap' });
      }
      
      const roadmap_id = result.insertId;
      
      // Insert all roadmap items
      if (roadmap.items.length === 0) {
        return resolve(roadmap_id);
      }
      
      const insertItemsQuery = `
        INSERT INTO roadmap_items (
          roadmap_id, skill_id, skill_name,
          priority, category, confidence, reason,
          priority_score, rank, rule_applied,
          current_level, target_level, level_gap,
          is_required, skill_weight, action_hint
        ) VALUES ?
      `;
      
      const itemValues = roadmap.items.map(item => [
        roadmap_id,
        item.skill_id,
        item.skill_name,
        item.priority,
        item.category,
        item.confidence,
        item.reason,
        item.priority_score,
        item.rank,
        item.rule_applied,
        item.details.current_level,
        item.details.target_level,
        item.details.level_gap,
        item.details.is_required ? 1 : 0,
        item.details.weight || 1,
        item.details.action_hint || null
      ]);
      
      db.query(insertItemsQuery, [itemValues], (itemsErr) => {
        if (itemsErr) {
          console.error('[roadmapService] Save items error:', itemsErr);
          // Rollback: delete the roadmap header
          db.query('DELETE FROM roadmaps WHERE roadmap_id = ?', [roadmap_id]);
          return reject({ error: 'DATABASE_ERROR', message: 'Failed to save roadmap items' });
        }
        
        resolve(roadmap_id);
      });
    });
  });
};

/**
 * Fetches a saved roadmap by ID.
 * 
 * @param {number} roadmap_id - The roadmap to fetch
 * @returns {Promise<Object>} - The saved roadmap with items
 */
const fetchSavedRoadmap = (roadmap_id) => {
  return new Promise((resolve, reject) => {
    const roadmapQuery = `
      SELECT r.*, c.category_name as role_name
      FROM roadmaps r
      JOIN categories c ON r.role_id = c.category_id
      WHERE r.roadmap_id = ?
    `;
    
    db.query(roadmapQuery, [roadmap_id], (err, roadmapResults) => {
      if (err) {
        console.error('[roadmapService] Fetch roadmap error:', err);
        return reject({ error: 'DATABASE_ERROR', message: 'Failed to fetch roadmap' });
      }
      
      if (roadmapResults.length === 0) {
        return reject({ error: 'NOT_FOUND', message: 'Roadmap not found' });
      }
      
      const roadmap = roadmapResults[0];
      
      // Fetch items
      const itemsQuery = `
        SELECT * FROM roadmap_items
        WHERE roadmap_id = ?
        ORDER BY \`rank\` ASC
      `;
      
      db.query(itemsQuery, [roadmap_id], (itemsErr, itemsResults) => {
        if (itemsErr) {
          console.error('[roadmapService] Fetch items error:', itemsErr);
          return reject({ error: 'DATABASE_ERROR', message: 'Failed to fetch roadmap items' });
        }
        
        resolve({
          roadmap_id: roadmap.roadmap_id,
          user_id: roadmap.user_id,
          role_id: roadmap.role_id,
          role_name: roadmap.role_name,
          readiness_id: roadmap.readiness_id,
          readiness_score: roadmap.readiness_score,
          generated_at: roadmap.generated_at,
          summary: {
            total_items: roadmap.total_items,
            high_priority: roadmap.high_priority_count,
            medium_priority: roadmap.medium_priority_count,
            low_priority: roadmap.low_priority_count
          },
          items: itemsResults
        });
      });
    });
  });
};

/**
 * Gets the latest saved roadmap for a user/role.
 * 
 * @param {number} user_id - User ID
 * @param {number} role_id - Role ID (optional)
 * @returns {Promise<Object|null>} - Latest roadmap or null
 */
const getLatestSavedRoadmap = (user_id, role_id = null) => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT roadmap_id FROM roadmaps
      WHERE user_id = ?
      ${role_id ? 'AND role_id = ?' : ''}
      ORDER BY generated_at DESC
      LIMIT 1
    `;
    
    const params = role_id ? [user_id, role_id] : [user_id];
    
    db.query(query, params, (err, results) => {
      if (err) {
        return reject({ error: 'DATABASE_ERROR', message: 'Failed to fetch latest roadmap' });
      }
      
      if (results.length === 0) {
        return resolve(null);
      }
      
      fetchSavedRoadmap(results[0].roadmap_id)
        .then(resolve)
        .catch(reject);
    });
  });
};

/* ============================================================================
   POST /roadmap/save/:user_id
   
   Generate and SAVE a roadmap snapshot.
   This creates a permanent record tied to the current readiness calculation.
   ============================================================================ */
router.post('/save/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { role_id } = req.query;
  
  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_USER_ID',
      message: 'user_id is required'
    });
  }
  
  try {
    // Step 1: Fetch input and generate roadmap
    const inputData = await fetchRoadmapInputData(
      parseInt(user_id),
      role_id ? parseInt(role_id) : null
    );
    const roadmap = generateRoadmap(inputData);
    
    // Step 2: Save to database
    const roadmap_id = await saveRoadmapSnapshot(roadmap);
    
    return res.status(201).json({
      success: true,
      message: 'Roadmap saved successfully',
      roadmap_id: roadmap_id,
      summary: roadmap.summary,
      generated_at: roadmap.generated_at
    });
    
  } catch (error) {
    console.error('[roadmapService] Save error:', error);
    return res.status(error.error === 'NO_READINESS_FOUND' ? 404 : 500).json({
      success: false,
      error: error.error || 'INTERNAL_ERROR',
      message: error.message || 'Failed to save roadmap'
    });
  }
});

/* ============================================================================
   GET /roadmap/saved/:roadmap_id
   
   Retrieve a specific saved roadmap by ID.
   ============================================================================ */
router.get('/saved/:roadmap_id', async (req, res) => {
  const { roadmap_id } = req.params;
  
  if (!roadmap_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_ROADMAP_ID',
      message: 'roadmap_id is required'
    });
  }
  
  try {
    const roadmap = await fetchSavedRoadmap(parseInt(roadmap_id));
    
    return res.status(200).json({
      success: true,
      roadmap
    });
    
  } catch (error) {
    console.error('[roadmapService] Fetch saved error:', error);
    return res.status(error.error === 'NOT_FOUND' ? 404 : 500).json({
      success: false,
      error: error.error || 'INTERNAL_ERROR',
      message: error.message || 'Failed to fetch roadmap'
    });
  }
});

/* ============================================================================
   GET /roadmap/latest/:user_id
   
   Get the most recent saved roadmap for a user.
   ============================================================================ */
router.get('/latest/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { role_id } = req.query;
  
  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_USER_ID',
      message: 'user_id is required'
    });
  }
  
  try {
    const roadmap = await getLatestSavedRoadmap(
      parseInt(user_id),
      role_id ? parseInt(role_id) : null
    );
    
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        error: 'NO_ROADMAP_FOUND',
        message: 'No saved roadmap found for this user'
      });
    }
    
    return res.status(200).json({
      success: true,
      roadmap
    });
    
  } catch (error) {
    console.error('[roadmapService] Latest error:', error);
    return res.status(500).json({
      success: false,
      error: error.error || 'INTERNAL_ERROR',
      message: error.message || 'Failed to fetch latest roadmap'
    });
  }
});

/* ============================================================================
   GET /roadmap/history/:user_id
   
   Get roadmap history for a user (list of all saved roadmaps).
   ============================================================================ */
router.get('/history/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { role_id, limit = 10 } = req.query;
  
  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_USER_ID',
      message: 'user_id is required'
    });
  }
  
  try {
    let query = `
      SELECT 
        r.roadmap_id,
        r.role_id,
        c.category_name as role_name,
        r.readiness_id,
        r.readiness_score,
        r.generated_at,
        r.total_items,
        r.high_priority_count,
        r.medium_priority_count,
        r.low_priority_count
      FROM roadmaps r
      JOIN categories c ON r.role_id = c.category_id
      WHERE r.user_id = ?
      ${role_id ? 'AND r.role_id = ?' : ''}
      ORDER BY r.generated_at DESC
      LIMIT ?
    `;
    
    const params = role_id 
      ? [parseInt(user_id), parseInt(role_id), parseInt(limit)]
      : [parseInt(user_id), parseInt(limit)];
    
    db.query(query, params, (err, results) => {
      if (err) {
        console.error('[roadmapService] History error:', err);
        return res.status(500).json({
          success: false,
          error: 'DATABASE_ERROR',
          message: 'Failed to fetch roadmap history'
        });
      }
      
      return res.status(200).json({
        success: true,
        user_id: parseInt(user_id),
        total_roadmaps: results.length,
        history: results.map(r => ({
          roadmap_id: r.roadmap_id,
          role_name: r.role_name,
          readiness_score: r.readiness_score,
          generated_at: r.generated_at,
          summary: {
            total_items: r.total_items,
            high_priority: r.high_priority_count,
            medium_priority: r.medium_priority_count,
            low_priority: r.low_priority_count
          }
        }))
      });
    });
    
  } catch (error) {
    console.error('[roadmapService] History error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch roadmap history'
    });
  }
});

/* ============================================================================
   EXPORTS
   ============================================================================ */

// Export functions and constants for use by other modules
module.exports = router;
module.exports.fetchRoadmapInputData = fetchRoadmapInputData;
module.exports.generateRoadmapItem = generateRoadmapItem;
module.exports.generateRoadmap = generateRoadmap;
module.exports.saveRoadmapSnapshot = saveRoadmapSnapshot;
module.exports.LEVEL_VALUES = LEVEL_VALUES;
module.exports.PRIORITY_TIERS = PRIORITY_TIERS;
module.exports.ROADMAP_CATEGORIES = ROADMAP_CATEGORIES;
module.exports.PRIORITY_LEVELS = PRIORITY_LEVELS;
module.exports.CONFIDENCE_LEVELS = CONFIDENCE_LEVELS;
