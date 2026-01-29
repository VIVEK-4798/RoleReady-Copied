-- ============================================================================
-- 📄 STEP 2: Create resumes table
-- ============================================================================
-- 
-- This is a dedicated table for resume storage with proper tracking.
-- Separate from profile_info to support:
-- - Upload history
-- - Parsed text storage
-- - Future: multiple resumes per user
--
-- Run this migration on your database.
-- ============================================================================

CREATE TABLE IF NOT EXISTS resumes (
  resume_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,           -- Original filename for display
  file_path VARCHAR(500) NOT NULL,           -- Stored filename (with timestamp prefix)
  file_size INT DEFAULT 0,                   -- File size in bytes
  file_type VARCHAR(50) DEFAULT 'pdf',       -- 'pdf', 'doc', 'docx'
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  parsed_text LONGTEXT NULL,                 -- For future: extracted text content
  parsed_at TIMESTAMP NULL,                  -- When text was extracted
  is_active TINYINT(1) DEFAULT 1,            -- Soft delete / active flag
  
  -- Foreign key to user table
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  
  -- Index for fast lookups
  INDEX idx_resumes_user_active (user_id, is_active)
);

-- ============================================================================
-- Sample query to get user's active resume:
-- 
-- SELECT * FROM resumes 
-- WHERE user_id = ? AND is_active = 1 
-- ORDER BY uploaded_at DESC 
-- LIMIT 1;
-- ============================================================================
