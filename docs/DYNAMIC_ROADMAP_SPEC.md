# 🧭 Dynamic Skill Improvement Roadmap Specification

## Overview

This document defines the **locked rules** for the Dynamic Roadmap feature before any implementation begins.

**Feature Goal:** Generate a structured, prioritized "what to do next" system derived directly from readiness gaps.

**Core Question Answered:**
- If Readiness answers: "Where am I?"
- Roadmap answers: "What should I do next, in what order?"

---

## 🔒 LOCKED PRINCIPLES (NON-NEGOTIABLE)

These rules **cannot be violated** in any implementation step:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROADMAP CORE PRINCIPLES                       │
├─────────────────────────────────────────────────────────────────┤
│  1. Roadmap is GENERATED, never manually edited                 │
│  2. Roadmap is DERIVED from latest readiness breakdown          │
│  3. Roadmap updates ONLY after readiness recalculation          │
│  4. Roadmap gives PRIORITIES, not deadlines                     │
│  5. Roadmap is ADVISORY, not enforced                           │
└─────────────────────────────────────────────────────────────────┘
```

**Why These Rules?**
- Manual editing = fake productivity, defeats the purpose
- Derived from readiness = single source of truth
- Updates after recalc = stays in sync with reality
- Priorities not deadlines = respects user's pace
- Advisory not enforced = user autonomy preserved

---

## ❌ What This Feature is NOT

| NOT This | Why Excluded |
|----------|--------------|
| Learning platform | We don't host courses or content |
| Course recommender | No external API integrations |
| Timeline planner | No dates, just priorities |
| Task manager | No checkboxes, no manual tasks |
| Career advisor | No subjective career guidance |

---

## ✅ What This Feature IS

| This IS | Description |
|---------|-------------|
| Gap analyzer | Identifies missing/weak skills from readiness |
| Priority ranker | Orders skills by importance to target role |
| Action suggester | Suggests what to improve (not how) |
| Progress tracker | Shows which gaps have been closed |
| Motivation driver | Clear next steps reduce overwhelm |

---

## 🛡️ System Integrity Rules

```
Rule 1: Single Source of Truth
────────────────────────────────────────
- Roadmap reads FROM readiness, never writes TO it
- No duplicate skill tracking
- No parallel state management

Rule 2: Deterministic Generation
────────────────────────────────────────
- Same readiness breakdown = same roadmap
- No randomness, no AI hallucination
- Fully explainable priority ordering

Rule 3: Lazy Regeneration
────────────────────────────────────────
- Roadmap only regenerates when:
  a) User triggers readiness recalculation
  b) User explicitly requests roadmap refresh
- NOT on page load, NOT on timer

Rule 4: No External Dependencies
────────────────────────────────────────
- No course APIs (Udemy, Coursera, etc.)
- No job board integrations
- No AI-generated learning paths
- Pure logic, derived from existing data
```

---

## 📊 Priority Ranking Algorithm (Conceptual)

Roadmap items are ranked by a **Priority Score** calculated from:

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRIORITY SCORE FORMULA                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Priority = (Importance × Gap) + Modifiers                     │
│                                                                  │
│   Where:                                                         │
│   • Importance = skill weight in benchmark (required > optional) │
│   • Gap = difference between required level and user level      │
│   • Modifiers = validation status, skill category, etc.         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Priority Tiers:**
1. 🔴 **Critical** - Required skills, large gap
2. 🟠 **High** - Required skills, small gap OR optional skills, large gap
3. 🟡 **Medium** - Optional skills, moderate gap
4. 🟢 **Low** - Nice-to-have, minimal impact on readiness

---

## 📋 Implementation Steps

- [x] **STEP 1:** Define roadmap input contract ✅
  - Roadmap consumes only:
    - `readiness_id` (latest)
    - `breakdown` (required vs optional, met vs missing)
    - `skill_importance` (weight in benchmark)
    - `validation_status` (validated/rejected/none)
    - `role_benchmark` (target role requirements)
  - ❌ No resume parsing
  - ❌ No course APIs
  - ❌ No external data sources
  - Input contract defined in `backend/service/roadmapService.js`
- [x] **STEP 2:** Build priority calculation engine ✅
  - **RoadmapItem structure defined:**
    - `skill_id` - Skill identifier
    - `skill_name` - Human-readable name
    - `reason` - WHY it's in the roadmap (explainable)
    - `priority` - HIGH | MEDIUM | LOW
    - `category` - required_gap | optional_gap | strengthen
    - `confidence` - validated | unvalidated
  - **Category definitions:**
    - 🔴 Required Gap: Required skill you haven't met yet (+30 priority boost)
    - 🟡 Optional Gap: Nice-to-have skill that would boost score (+0 boost)
    - 🔵 Strengthen: Skill you have but could level up (-10 boost)
  - **Priority formula:** `(gap_points × weight × 5) + category_boost + validation_bonus + level_gap_bonus`
  - **Endpoints added:**
    - `GET /roadmap/generate/:user_id` - Full roadmap generation
    - `GET /roadmap/top/:user_id` - Quick top N items for dashboard
  - **Fully explainable:** Every item has a human-readable `reason` field
- [x] **STEP 3:** Create roadmap generation endpoint ✅
  - **5 Deterministic Priority Rules Implemented:**
  
  | Rule | Condition | Priority | Example |
  |------|-----------|----------|---------|
  | RULE 1 | Missing REQUIRED skills | HIGH 🔥 | "React is required for Frontend Intern but missing" |
  | RULE 2 | Rejected skills | HIGH 🚨 | "Git was rejected by mentor — needs correction" |
  | RULE 3 | Unvalidated required skills | MEDIUM 📈 | "JavaScript meets requirements but not mentor-validated" |
  | RULE 4 | Optional missing skills | LOW 📋 | "TypeScript is optional for this role" |
  | RULE 5 | Validated & met skills | EXCLUDED | Do NOT tell users to work on validated skills |
  
  - **Rule transparency:** Each item includes `rule_applied` field
  - **Action hints:** Each item includes `action_hint` for clear next steps
  - **Summary by rule:** Response shows count per rule applied
  - **Priority scoring:**
    - RULE 2 (Rejected): Score = 100 (highest)
    - RULE 1 (Required gap): Score = 80 + weight bonus
    - RULE 3 (Unvalidated): Score = 50 + weight bonus
    - RULE 4 (Optional): Score = 20 + weight bonus
- [x] **STEP 4:** Store/cache roadmap for user ✅
  - **Roadmaps are SNAPSHOTS, not live logic**
  - **Why snapshot?**
    - Lets users see how roadmap changed over time
    - Aligns with readiness time-series
    - Avoids recalculation confusion
  - **Database tables created:**
    - `roadmaps` - Parent table with metadata (user_id, role_id, readiness_id, generated_at, counts)
    - `roadmap_items` - Child table with individual items (skill_id, priority, reason, category, etc.)
  - **Migration:** `backend/migrations/create_roadmap_tables.sql`
  - **New endpoints:**
    - `POST /roadmap/save/:user_id` - Generate and save roadmap snapshot
    - `GET /roadmap/saved/:roadmap_id` - Retrieve specific saved roadmap
    - `GET /roadmap/latest/:user_id` - Get most recent saved roadmap
    - `GET /roadmap/history/:user_id` - Get all saved roadmaps (timeline view)
  - **Functions exported:**
    - `saveRoadmapSnapshot(roadmap)` - Persists roadmap + items
    - `fetchSavedRoadmap(roadmap_id)` - Retrieves full roadmap
    - `getLatestSavedRoadmap(user_id, role_id)` - Gets newest roadmap
- [x] **STEP 5:** Basic roadmap display UI ✅
  - **Route:** `/roadmap` - ONE screen, no polish obsession
  - **Page file:** `src/pages/roadmap/index.jsx`
  - **Sections:**
    - Summary card: "Based on your latest readiness score of X%"
    - 🔥 High Priority (Do First) - blocking your score
    - 📈 Medium Priority (Next) - strengthen your profile
    - 📋 Low Priority (Optional) - nice to have
  - **Each item shows:**
    - Skill name (bold)
    - Why it matters (reason text)
    - Validation status badge (Verified ✓ / Self-reported / Rejected ⚠)
    - Action hint (italic suggestion)
  - **NO checkboxes** - not a todo list
  - **NO completion tracking** - roadmap regenerates from readiness
  - **NO dates** - priorities, not deadlines
  - **Features:**
    - Auto-loads latest saved roadmap
    - Falls back to generating fresh if none saved
    - Refresh button to regenerate
    - Rules transparency section shows how roadmap was generated
    - Redirects to login if not authenticated
    - Links to readiness page if no score calculated
- [x] **STEP 6:** Integrate roadmap with readiness lifecycle ✅
  - **Rules implemented:**
    - Roadmap is regenerated ONLY after readiness recalculation
    - Old roadmaps remain read-only (snapshot design preserved)
    - Latest roadmap is shown by default
  - **Backend integration:**
    - Added `regenerateRoadmapAfterCalculation()` helper function in `readiness.js`
    - Integrated into all readiness calculation endpoints:
      - `/calculate` - Basic calculation
      - `/explicit-calculate` - User-triggered recalculation
      - `/recalculate-after-validation` - Post-validation recalculation
    - Response now includes `roadmap_updated: true/false` and `roadmap_summary`
  - **Frontend notification:**
    - Toast: "🛣️ Your roadmap has been updated based on your new readiness score."
    - Includes "View Updated Roadmap →" button linking to `/roadmap`
    - Shows for 8 seconds, non-blocking
  - **Files modified:**
    - `backend/service/readiness.js` - Imported roadmap functions, added helper, updated 3 endpoints
    - `src/pages/readiness/index.jsx` - Added roadmap update notification toast
- [x] **STEP 7:** Edge cases handling ✅
  - **Edge cases explicitly handled:**
  
  | Edge Case | Detection | UI Response |
  |-----------|-----------|-------------|
  | No missing skills | `items.length === 0` | 🎉 "You're Ready!" celebration banner with role name |
  | Only optional gaps | `high=0, medium=0, low>0` | ✅ "You've met all required skills!" info banner |
  | Validation pending | `pending_validation_count > 0` | ⚠️ Warning that priorities may change after review |
  | Unvalidated required | `unvalidated_required_count > 0` | 💡 Suggestion to request mentor validation |
  
  - **Backend implementation:**
    - Added `edge_case` object to roadmap response with:
      - `is_fully_ready` - Boolean, all skills met
      - `only_optional_gaps` - Boolean, only LOW priority items
      - `has_pending_validation` - Boolean, skills awaiting review
      - `pending_validation_count` - Number of pending skills
      - `has_unvalidated_required` - Boolean, required skills not validated
      - `unvalidated_required_count` - Number of unvalidated required skills
      - `message` - Human-readable edge case message
      - `message_type` - 'success' | 'info' | 'warning'
  - **Frontend implementation:**
    - Added `EdgeCaseBanner` component with color-coded messages
    - Enhanced "Fully Ready" state with celebration UI
    - Dynamic section descriptions based on edge case
    - Pending validation indicator in banner
  - **Files modified:**
    - `backend/service/roadmapService.js` - Added edge case detection to `generateRoadmap()`
    - `src/pages/roadmap/index.jsx` - Added `EdgeCaseBanner`, updated priority section logic

---

## 📦 STEP 1: Roadmap Input Contract

### Input Sources (Read-Only)

The roadmap generator reads from these tables/endpoints ONLY:

```sql
-- Primary: Latest readiness score for user + role
readiness_scores (readiness_id, user_id, role_id, score, calculated_at)

-- Breakdown: What skills were evaluated and their status
readiness_score_breakdown (readiness_id, skill_id, user_level, required_level, 
                           points_earned, points_possible, is_required, skill_source)

-- Benchmark: What the target role requires
benchmark_skills (benchmark_id, skill_id, is_required, weight)

-- User skills: Current state (for validation status)
user_skills (user_id, skill_id, level, source, validation_status)

-- Skills reference: Skill names and categories
skills (skill_id, name, category_id)
categories (category_id, category_name)
```

### Input Contract Interface

```javascript
/**
 * ROADMAP INPUT CONTRACT
 * 
 * This is the ONLY data the roadmap generator accepts.
 * Any data not in this contract is OUT OF SCOPE.
 */
const RoadmapInputContract = {
  // Required: Which readiness calculation to derive from
  readiness_id: Number,
  
  // Required: User and role context
  user_id: Number,
  role_id: Number,
  role_name: String,
  
  // Required: Current readiness score (for context)
  current_score: Number,
  
  // Required: Skill breakdown from readiness
  skills: [
    {
      skill_id: Number,
      skill_name: String,
      category_id: Number,
      category_name: String,
      
      // Levels
      user_level: String,       // 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert'
      required_level: String,   // Same enum
      
      // Importance
      is_required: Boolean,     // true = must-have, false = nice-to-have
      weight: Number,           // 1-5 scale from benchmark
      
      // Points
      points_earned: Number,
      points_possible: Number,
      gap_points: Number,       // points_possible - points_earned
      
      // Status
      is_met: Boolean,          // user_level >= required_level
      validation_status: String, // 'none' | 'validated' | 'rejected' | 'pending'
      skill_source: String      // 'self' | 'resume' | 'validated'
    }
  ],
  
  // Computed summary
  summary: {
    total_skills: Number,
    met_count: Number,
    missing_count: Number,
    required_missing: Number,
    optional_missing: Number
  }
};
```

### What is EXCLUDED from Input

| Excluded Data | Why |
|---------------|-----|
| Resume text/files | Roadmap doesn't parse documents |
| Course recommendations | No external learning APIs |
| Time estimates | No duration guessing |
| User preferences | Roadmap is objective, not preference-based |
| Historical roadmaps | Each roadmap is fresh from readiness |
| Other users' data | No collaborative filtering |

---

## 🔗 Relationship to Existing Features

```
┌─────────────────────────────────────────────────────────────────┐
│                    FEATURE DEPENDENCY CHAIN                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   User Skills ──────┐                                            │
│                     │                                            │
│   Role Benchmark ───┼──► Readiness Engine ──► ROADMAP            │
│                     │          │                  │              │
│   Validation ───────┘          │                  │              │
│                                ▼                  ▼              │
│                          readiness_scores    roadmap_items       │
│                                                                  │
│   Roadmap is DOWNSTREAM of Readiness                             │
│   Roadmap NEVER modifies upstream data                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Open Questions (To Resolve in Later Steps)

1. **Should roadmap persist in DB or generate on-demand?**
2. **How many items to show at once?** (Top 5? Top 10? All?)
3. **Should user be able to "dismiss" items?** (Violates "no manual edit" rule?)
4. **Show estimated readiness impact per item?** ("Closing this gap = +5%")
5. **Group by category or show flat list?**

---

## 🔗 Related Documents

- [Mentor Validation Spec](./MENTOR_VALIDATION_SPEC.md) - Validation affects skill weight
- [Resume Skill Sync Spec](./RESUME_SKILL_SYNC_SPEC.md) - How skills enter the system
- Readiness Engine - Source of truth for roadmap

---

*Document created: STEP 1 of Dynamic Roadmap feature*
*Last updated: January 2026*
