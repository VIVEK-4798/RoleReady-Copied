/**
 * ============================================================================
 * NOTIFICATION SERVICE
 * ============================================================================
 * Purpose: Event-driven notification system for guiding users at the right moment
 * 
 * PHILOSOPHY:
 * - System-generated, event-based, actionable, non-spammy
 * - Every notification answers: "What changed, and what should I do now?"
 * - Notifications are side-effects, never block core logic
 * 
 * NOTIFICATION TYPES (fixed list):
 * - readiness_outdated: Profile/skills changed, readiness not recalculated
 * - mentor_validation: Mentor validated or rejected skills
 * - roadmap_updated: New roadmap generated after readiness calculation
 * - role_changed: User changed target role
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

// Promisify db.query
const queryAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// ============================================================================
// NOTIFICATION TYPE DEFINITIONS
// ============================================================================
const NOTIFICATION_TYPES = {
  READINESS_OUTDATED: 'readiness_outdated',
  MENTOR_VALIDATION: 'mentor_validation',
  ROADMAP_UPDATED: 'roadmap_updated',
  ROLE_CHANGED: 'role_changed'
};

// Default notification templates
const NOTIFICATION_TEMPLATES = {
  readiness_outdated: {
    title: 'Readiness Needs Recalculation',
    message: 'Your profile or skills have changed. Recalculate your readiness to see updated scores.',
    action_url: '/dashboard/db-dashboard'
  },
  mentor_validation: {
    title: 'Skills Reviewed by Mentor',
    message: 'A mentor has reviewed your skills. Check the results and recalculate your readiness.',
    action_url: '/dashboard/db-dashboard'
  },
  roadmap_updated: {
    title: 'Your Roadmap Has Been Updated',
    message: 'Based on your latest readiness calculation, your learning roadmap has been refreshed.',
    action_url: '/dashboard/db-roadmap'
  },
  role_changed: {
    title: 'Target Role Changed',
    message: 'You\'ve selected a new target role. Your readiness and roadmap will be recalculated.',
    action_url: '/dashboard/db-dashboard'
  }
};

// ============================================================================
// INTERNAL HELPER FUNCTIONS
// ============================================================================

/**
 * Create a notification with deduplication
 * Won't create duplicate unread notifications of the same type for the same user
 */
async function createNotification(userId, type, customTitle = null, customMessage = null, customActionUrl = null) {
  try {
    // Validate type
    if (!Object.values(NOTIFICATION_TYPES).includes(type)) {
      console.error(`[notificationService] Invalid notification type: ${type}`);
      return null;
    }

    // Check for existing unread notification of same type
    const existing = await queryAsync(
      `SELECT id FROM notifications WHERE user_id = ? AND type = ? AND is_read = FALSE`,
      [userId, type]
    );

    if (existing.length > 0) {
      // Update the existing notification instead of creating duplicate
      await queryAsync(
        `UPDATE notifications SET created_at = NOW() WHERE id = ?`,
        [existing[0].id]
      );
      console.log(`[notificationService] Updated existing notification ${existing[0].id} for user ${userId}`);
      return existing[0].id;
    }

    // Get template defaults
    const template = NOTIFICATION_TEMPLATES[type];
    
    const result = await queryAsync(
      `INSERT INTO notifications (user_id, type, title, message, action_url, is_read, created_at)
       VALUES (?, ?, ?, ?, ?, FALSE, NOW())`,
      [
        userId,
        type,
        customTitle || template.title,
        customMessage || template.message,
        customActionUrl || template.action_url
      ]
    );

    console.log(`[notificationService] Created notification ${result.insertId} for user ${userId}: ${type}`);
    return result.insertId;
  } catch (error) {
    console.error('[notificationService] Error creating notification:', error);
    return null; // Never throw - notifications are side-effects only
  }
}

// ============================================================================
// TRIGGER FUNCTIONS (Called from other services)
// ============================================================================

/**
 * Trigger: Skills or profile changed - readiness is now outdated
 */
async function triggerReadinessOutdated(userId) {
  return await createNotification(
    userId,
    NOTIFICATION_TYPES.READINESS_OUTDATED,
    'Readiness Needs Recalculation',
    'Your profile or skills have changed since your last readiness check. Recalculate to see your updated score.'
  );
}

/**
 * Trigger: Mentor validated skills
 */
async function triggerMentorValidation(userId, validatedCount, rejectedCount) {
  let message = 'A mentor has reviewed your skills. ';
  if (validatedCount > 0 && rejectedCount > 0) {
    message += `${validatedCount} skill(s) validated, ${rejectedCount} need improvement.`;
  } else if (validatedCount > 0) {
    message += `${validatedCount} skill(s) have been validated!`;
  } else if (rejectedCount > 0) {
    message += `${rejectedCount} skill(s) need improvement.`;
  }
  
  return await createNotification(
    userId,
    NOTIFICATION_TYPES.MENTOR_VALIDATION,
    'Skills Reviewed by Mentor',
    message
  );
}

/**
 * Trigger: Roadmap updated after readiness calculation
 */
async function triggerRoadmapUpdated(userId, newTaskCount = 0) {
  const message = newTaskCount > 0
    ? `Your roadmap has been updated with ${newTaskCount} new learning tasks based on your latest readiness.`
    : 'Your learning roadmap has been refreshed based on your latest readiness calculation.';
  
  return await createNotification(
    userId,
    NOTIFICATION_TYPES.ROADMAP_UPDATED,
    'Roadmap Updated',
    message
  );
}

/**
 * Trigger: User changed their target role
 */
async function triggerRoleChanged(userId, newRoleName) {
  return await createNotification(
    userId,
    NOTIFICATION_TYPES.ROLE_CHANGED,
    'Target Role Changed',
    `You've switched to "${newRoleName}". Your readiness and roadmap are being recalculated for this new role.`
  );
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * GET /notifications/:user_id
 * Get all notifications for a user (most recent first)
 */
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { limit = 20, unread_only = false } = req.query;

  try {
    let query = `
      SELECT id, type, title, message, action_url, is_read, created_at
      FROM notifications
      WHERE user_id = ?
    `;
    
    if (unread_only === 'true') {
      query += ` AND is_read = FALSE`;
    }
    
    query += ` ORDER BY created_at DESC LIMIT ?`;

    const notifications = await queryAsync(query, [user_id, parseInt(limit)]);

    res.json({
      success: true,
      notifications,
      count: notifications.length
    });
  } catch (error) {
    console.error('[notificationService] GET /:user_id error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

/**
 * GET /notifications/:user_id/unread-count
 * Get count of unread notifications
 */
router.get('/:user_id/unread-count', async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await queryAsync(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE`,
      [user_id]
    );

    res.json({
      success: true,
      unread_count: result[0].count
    });
  } catch (error) {
    console.error('[notificationService] GET /:user_id/unread-count error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch unread count' });
  }
});

/**
 * PATCH /notifications/:id/read
 * Mark a single notification as read
 */
router.patch('/:id/read', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await queryAsync(
      `UPDATE notifications SET is_read = TRUE WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('[notificationService] PATCH /:id/read error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
});

/**
 * PATCH /notifications/:user_id/read-all
 * Mark all notifications as read for a user
 */
router.patch('/:user_id/read-all', async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await queryAsync(
      `UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE`,
      [user_id]
    );

    res.json({
      success: true,
      message: `${result.affectedRows} notification(s) marked as read`
    });
  } catch (error) {
    console.error('[notificationService] PATCH /:user_id/read-all error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notifications as read' });
  }
});

/**
 * GET /notifications/:user_id/contextual
 * Get unread notifications for contextual banners
 * Returns only the most important unread notification per type
 */
router.get('/:user_id/contextual', async (req, res) => {
  const { user_id } = req.params;
  const { types } = req.query; // comma-separated list of types to filter

  try {
    let query = `
      SELECT id, type, title, message, action_url, created_at
      FROM notifications
      WHERE user_id = ? AND is_read = FALSE
    `;
    
    const params = [user_id];
    
    if (types) {
      const typeList = types.split(',').map(t => t.trim());
      query += ` AND type IN (${typeList.map(() => '?').join(',')})`;
      params.push(...typeList);
    }
    
    query += ` ORDER BY created_at DESC`;

    const notifications = await queryAsync(query, params);

    // Group by type, keep only most recent per type
    const byType = {};
    notifications.forEach(n => {
      if (!byType[n.type]) {
        byType[n.type] = n;
      }
    });

    res.json({
      success: true,
      notifications: Object.values(byType)
    });
  } catch (error) {
    console.error('[notificationService] GET /:user_id/contextual error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch contextual notifications' });
  }
});

/**
 * DELETE /notifications/:id
 * Delete a notification (for manual cleanup only)
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await queryAsync(
      `DELETE FROM notifications WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('[notificationService] DELETE /:id error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
});

// ============================================================================
// EXPORTS
// ============================================================================
module.exports = {
  router,
  // Export trigger functions for use in other services
  NOTIFICATION_TYPES,
  createNotification,
  triggerReadinessOutdated,
  triggerMentorValidation,
  triggerRoadmapUpdated,
  triggerRoleChanged
};
