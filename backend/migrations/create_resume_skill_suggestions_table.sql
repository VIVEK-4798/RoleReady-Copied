-- ============================================================================
-- 📄 STEP 3: Create resume_skill_suggestions table
-- ============================================================================
-- 
-- This is the STAGING table for skills extracted from resumes.
-- Skills here are SUGGESTIONS only - they do NOT affect readiness until
-- the user confirms them and they move to user_skills.
--
-- Key principle: Binary matching (found / not found) - no confidence scores.
-- ============================================================================

CREATE TABLE IF NOT EXISTS resume_skill_suggestions (
  suggestion_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  resume_id INT NOT NULL,                    -- Which resume this came from
  skill_id INT NOT NULL,                     -- Matched skill from skills table
  skill_name VARCHAR(255) NOT NULL,          -- Denormalized for display
  category_id INT NULL,                      -- Category of the skill (for filtering)
  match_source VARCHAR(100) NULL,            -- Where in resume it was found (optional context)
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  
  -- Foreign keys
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (resume_id) REFERENCES resumes(resume_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
  
  -- Prevent duplicate suggestions for same user/skill combo
  UNIQUE KEY unique_user_resume_skill (user_id, resume_id, skill_id),
  
  -- Index for fast lookups
  INDEX idx_suggestions_user_status (user_id, status),
  INDEX idx_suggestions_resume (resume_id)
);

-- ============================================================================
-- Sample queries:
-- 
-- Get pending suggestions for a user:
-- SELECT * FROM resume_skill_suggestions 
-- WHERE user_id = ? AND status = 'pending';
--
-- Get suggestions for user's target category only:
-- SELECT rss.* FROM resume_skill_suggestions rss
-- JOIN profile_info pi ON pi.user_id = rss.user_id
-- WHERE rss.user_id = ? AND rss.status = 'pending' 
--   AND rss.category_id = pi.target_category_id;
-- ============================================================================
