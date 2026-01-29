-- ============================================================================
-- 🧭 STEP 4: Create roadmap snapshot tables
-- ============================================================================
-- 
-- Roadmaps are SNAPSHOTS, not live logic.
-- Each roadmap is tied to a specific readiness calculation.
-- This allows users to see how their roadmap changed over time.
--
-- Key principle: Roadmap aligns with readiness time-series.
-- ============================================================================

-- ============================================================================
-- Table 1: roadmaps (parent table)
-- ============================================================================
-- Stores metadata about each roadmap generation

CREATE TABLE IF NOT EXISTS roadmaps (
  roadmap_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  readiness_id INT NOT NULL,              -- Links to the readiness calculation this was derived from
  readiness_score DECIMAL(5,2) NOT NULL,  -- Snapshot of score at generation time
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Summary stats (denormalized for quick display)
  total_items INT DEFAULT 0,
  high_priority_count INT DEFAULT 0,
  medium_priority_count INT DEFAULT 0,
  low_priority_count INT DEFAULT 0,
  
  -- Foreign keys
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES categories(category_id) ON DELETE CASCADE,
  FOREIGN KEY (readiness_id) REFERENCES readiness_scores(readiness_id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_roadmaps_user (user_id),
  INDEX idx_roadmaps_user_role (user_id, role_id),
  INDEX idx_roadmaps_readiness (readiness_id),
  INDEX idx_roadmaps_generated (generated_at)
);

-- ============================================================================
-- Table 2: roadmap_items (child table)
-- ============================================================================
-- Stores individual items in each roadmap snapshot

CREATE TABLE IF NOT EXISTS roadmap_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  roadmap_id INT NOT NULL,
  skill_id INT NOT NULL,
  skill_name VARCHAR(255) NOT NULL,       -- Denormalized for display
  
  -- Core roadmap item fields (from STEP 2)
  priority ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL,
  category ENUM('rejected', 'required_gap', 'strengthen', 'optional_gap') NOT NULL,
  confidence ENUM('validated', 'unvalidated', 'rejected') NOT NULL,
  reason TEXT NOT NULL,                   -- Human-readable explanation
  
  -- Scoring and ranking
  priority_score INT NOT NULL,
  rank INT NOT NULL,                      -- Position in the sorted list
  rule_applied VARCHAR(50) NOT NULL,      -- Which rule generated this item
  
  -- Snapshot of skill state at generation time
  current_level VARCHAR(20),
  target_level VARCHAR(20),
  level_gap INT DEFAULT 0,
  is_required BOOLEAN DEFAULT FALSE,
  skill_weight INT DEFAULT 1,
  
  -- Action hint for user
  action_hint TEXT,
  
  -- Foreign keys
  FOREIGN KEY (roadmap_id) REFERENCES roadmaps(roadmap_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_items_roadmap (roadmap_id),
  INDEX idx_items_priority (roadmap_id, priority),
  INDEX idx_items_rank (roadmap_id, rank)
);

-- ============================================================================
-- Sample queries:
-- 
-- Get latest roadmap for a user:
-- SELECT * FROM roadmaps 
-- WHERE user_id = ? 
-- ORDER BY generated_at DESC LIMIT 1;
--
-- Get roadmap items for a roadmap:
-- SELECT * FROM roadmap_items 
-- WHERE roadmap_id = ? 
-- ORDER BY rank ASC;
--
-- Get roadmap history for a user:
-- SELECT r.*, COUNT(ri.item_id) as item_count
-- FROM roadmaps r
-- LEFT JOIN roadmap_items ri ON r.roadmap_id = ri.roadmap_id
-- WHERE r.user_id = ?
-- GROUP BY r.roadmap_id
-- ORDER BY r.generated_at DESC;
-- ============================================================================
