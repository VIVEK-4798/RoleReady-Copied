-- ============================================================================
-- MENTOR VALIDATION - STEP 2: Add validation metadata to user_skills
-- ============================================================================
-- 
-- This migration adds fields to track mentor validation status on skills.
-- 
-- Rules enforced:
-- 1. Validation only applies to skills with source = 'self' or 'resume'
-- 2. When validated, source changes to 'validated'
-- 3. Rejected skills keep their source but get flagged
-- 
-- Run this SQL in your MySQL database to add the new columns.
-- ============================================================================

-- Add validation metadata columns to user_skills table
ALTER TABLE user_skills
  ADD COLUMN validated_by INT NULL DEFAULT NULL 
    COMMENT 'mentor_id who validated this skill',
  ADD COLUMN validated_at TIMESTAMP NULL DEFAULT NULL 
    COMMENT 'When the skill was validated/rejected',
  ADD COLUMN validation_status ENUM('none', 'pending', 'validated', 'rejected') 
    DEFAULT 'none' 
    COMMENT 'Current validation state',
  ADD COLUMN validation_note VARCHAR(500) NULL DEFAULT NULL 
    COMMENT 'Short structured feedback from mentor';

-- Add foreign key constraint for validated_by (references user table)
-- Note: Assumes mentors are stored in the same user table with a role field
ALTER TABLE user_skills
  ADD CONSTRAINT fk_user_skills_validated_by 
  FOREIGN KEY (validated_by) REFERENCES user(user_id) 
  ON DELETE SET NULL;

-- Add index for efficient validation queries
CREATE INDEX idx_user_skills_validation_status 
  ON user_skills(validation_status);

CREATE INDEX idx_user_skills_validated_by 
  ON user_skills(validated_by);

-- ============================================================================
-- VERIFICATION QUERIES (run after migration to confirm)
-- ============================================================================

-- Check the updated table structure:
-- DESCRIBE user_skills;

-- Verify new columns exist:
-- SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT 
-- FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_NAME = 'user_skills' 
-- AND COLUMN_NAME IN ('validated_by', 'validated_at', 'validation_status', 'validation_note');

-- ============================================================================
-- ROLLBACK (if needed)
-- ============================================================================
-- 
-- To undo this migration:
-- 
-- ALTER TABLE user_skills DROP FOREIGN KEY fk_user_skills_validated_by;
-- DROP INDEX idx_user_skills_validation_status ON user_skills;
-- DROP INDEX idx_user_skills_validated_by ON user_skills;
-- ALTER TABLE user_skills 
--   DROP COLUMN validated_by,
--   DROP COLUMN validated_at,
--   DROP COLUMN validation_status,
--   DROP COLUMN validation_note;
-- ============================================================================
