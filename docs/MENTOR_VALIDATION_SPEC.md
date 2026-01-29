# 🎓 Mentor Validation Specification

## Overview

This document defines the **locked rules** for the Mentor Validation feature before any implementation begins.

**Feature Goal:** Allow mentors to validate user skills, adding a credibility layer that users cannot self-assign.

**Why This Matters:**
- Skills from `self` and `resume` are user-controlled
- Interviewers will ask: "How do you prevent skill inflation?"
- Mentor validation answers this cleanly with third-party verification

---

## 🔒 STEP 1: Mentor Scope (LOCKED)

These rules are **non-negotiable** and must be enforced in all implementation steps.

### Core Principle: Mentors are VALIDATORS, not ADVISORS

```
┌─────────────────────────────────────────────────────────────────┐
│                    MENTOR ROLE DEFINITION                        │
├─────────────────────────────────────────────────────────────────┤
│  Mentors VALIDATE skills. They do not teach, advise, or chat.   │
│  Think of them as "skill auditors" - they verify claims.        │
└─────────────────────────────────────────────────────────────────┘
```

---

### ✅ What Mentors CAN Do

| Action | Description | Why Allowed |
|--------|-------------|-------------|
| **View readiness breakdown** | See user's skills, levels, and readiness score | Need context to validate |
| **Validate individual skills** | Mark a skill as "validated" | Core function |
| **Reject individual skills** | Mark a skill as "rejected" (with reason) | Core function |
| **Add structured comments** | Short, predefined feedback on skills | Provides actionable context |
| **See skill source** | Know if skill is from `self`, `resume`, or previous validation | Helps assess credibility |

---

### ❌ What Mentors CANNOT Do

| Action | Why Blocked |
|--------|-------------|
| **Edit readiness scores directly** | Scores come from engine calculation only |
| **Add new skills to user profile** | Only user can add skills (self-sovereignty) |
| **Remove skills from user profile** | Only user can remove skills |
| **Change skill levels** | Levels are user-set; mentor just validates or rejects |
| **Chat freely with users** | Not a messaging platform; keeps scope focused |
| **Override the readiness engine** | Engine is source of truth |
| **Validate their own skills** | Conflict of interest |
| **See user's personal info** | Privacy: only see skills and readiness |

---

### 🛡️ System Integrity Rules

```
Rule 1: Mentor validation is ADDITIVE
────────────────────────────────────────
- Validating a skill changes source from 'self'/'resume' → 'validated'
- This UPGRADES the skill's credibility
- It does NOT change the skill level or readiness weight
- Engine treats 'validated' skills same as 'self'/'resume' for calculation

Rule 2: Mentor rejection is FLAGGING
────────────────────────────────────────
- Rejecting a skill adds a 'rejected' flag
- Skill remains in user_skills (user can still claim it)
- UI shows rejection with reason
- User can request re-validation or remove skill
- Engine may optionally weight rejected skills lower (future)

Rule 3: One mentor per validation
────────────────────────────────────────
- Each skill validation is tied to ONE mentor
- Multiple mentors cannot validate same skill (no stacking)
- New validation replaces old validation (with audit trail)

Rule 4: Validation is time-stamped
────────────────────────────────────────
- All validations have timestamp
- Validations may expire (configurable, e.g., 1 year)
- Expired validations revert to previous source
```

---

## 📊 Skill Source Hierarchy

After mentor validation, skill sources have a trust hierarchy:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SKILL SOURCE TRUST LEVELS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   🥇 validated    - Third-party verified (mentor approved)      │
│   🥈 resume       - Document-backed (extracted from resume)     │
│   🥉 self         - Self-declared (user added manually)         │
│   ⚠️  rejected    - Disputed by mentor (flagged, not removed)   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**UI Implications:**
- Validated skills show a verification badge ✓
- Rejected skills show a warning indicator ⚠️
- Users can filter/sort by validation status

---

## 🚫 Anti-Patterns to Avoid

| Anti-Pattern | Why It's Bad |
|--------------|--------------|
| Letting mentors "grade" skills | Mentors validate existence, not proficiency |
| Free-form chat | Scope creep, moderation nightmare |
| Mentor marketplace | Not a gig platform, keeps it professional |
| Automatic skill addition | User sovereignty violation |
| Anonymous validation | Accountability matters |
| Pay-to-validate | Integrity corruption |

---

## ✅ Success Criteria for This Feature

1. **Mentors can only validate/reject, nothing else**
2. **User profile remains user-controlled**
3. **Validation status is visible in UI**
4. **Audit trail for all validations**
5. **No chat, no marketplace, no social features**
6. **Readiness engine unchanged (validated = valid source)**

---

## 📋 Implementation Steps

- [x] **STEP 1:** Lock mentor scope ✅ (This document)
  - Mentors are validators, not advisors
  - Can: view breakdown, validate/reject skills, add structured comments
  - Cannot: edit scores, add/remove skills, chat, override engine
  - System integrity rules defined
- [x] **STEP 2:** Extend user_skills with validation metadata ✅
  - Added columns: `validated_by`, `validated_at`, `validation_status`, `validation_note`
  - `validation_status`: 'none' | 'pending' | 'validated' | 'rejected'
  - Foreign key to users table for mentor reference
  - Updated skill queries to include validation fields
  - Migration: `backend/migrations/alter_user_skills_add_validation.sql`
- [x] **STEP 3:** Mentor review queue (minimal) ✅
  - Backend endpoints: `GET /queue/:mentor_id`, `POST /validate`, `POST /reject`, `GET /stats/:mentor_id`
  - Service: `backend/service/mentorValidation.js`
  - Frontend: Simple table with User, Skill, Source, Level, Actions
  - Reject requires reason (min 10 chars)
  - Self-validation blocked
  - Route: `/mentor-dashboard/validation-queue`
  - Sidebar link added for mentors
- [x] **STEP 4:** Validation → Readiness Integration ✅
  - **Validated skills:** Get 1.25x weight bonus in readiness calculation
  - **Rejected skills:** Excluded from readiness calculation entirely
  - **Cooldown bypass:** Users can recalculate immediately after validation review
  - Backend endpoints:
    - `GET /readiness/validation-updates/:user_id` - Check for pending validation reviews
    - `POST /readiness/recalculate-after-validation` - Trigger recalculation with bypass
  - Frontend: `ValidationUpdateBanner` component shows prompt on Readiness page
  - User prompt: "Your skills were reviewed. Recalculate readiness?"
  - Reuses 100% of existing readiness calculation engine
- [x] **STEP 5:** Dashboard Trust Indicators ✅
  - **Trust badge:** Shows "X skills mentor-validated" prominently
  - **Skill source display:** Each skill shows source badge (🎓 validated, 📄 resume, ✋ self)
  - **Source legend:** Clear legend explaining what each source means
  - **Validated highlight:** Validated skills have special styling (blue border/glow)
  - Backend: Updated `/readiness/breakdown/:readiness_id` to include:
    - `skill_source` in each skill object
    - `trust_indicators` summary with counts per source
  - Frontend: Updated skill chips to show source badges with tooltips
  - CSS: Added trust-badge, source-legend, and validated-highlight styles
  - **Credibility boost:** Interviewers can see third-party verification at a glance
- [x] **STEP 6:** User-Side Validation Display ✅
  - **Profile Skills Section:** Updated `SkillsPopupPage.jsx` with full validation support
  - **Visual indicators for each skill:**
    - 🎓 Validated: Blue border, checkmark, special styling
    - ⚠️ Rejected: Yellow border, warning icon, clickable for details
    - 📄 Resume: Purple badge for resume-parsed skills
    - ✋ Self: Default styling for self-declared skills
  - **Stats banner:** Shows "X skills mentor-validated" when validated skills exist
  - **Warning banner:** Shows "X skills need attention" when rejected skills exist
  - **Validation detail modal:** Click any validated/rejected skill to see:
    - Reviewer name (mentor who validated/rejected)
    - Review date
    - Rejection reason (if rejected)
    - Validation benefits (if validated: 1.25x weight, verified badge, credibility)
  - **Tooltip hints:** Hover shows quick source/status info
  - **No code duplication:** Reuses existing skill fetching logic (already includes validation fields)
- [x] **STEP 7:** Integration with readiness context ✅
  - **Context endpoint enhanced:** `/readiness/context` now returns full validation stats
  - **Validation data in context:**
    - `validated_count`: Number of validated skills
    - `rejected_count`: Number of rejected skills  
    - `pending_count`: Number of pending validations
    - `has_updates_since_last_calc`: Boolean flag for UI prompt
    - `updates_summary`: Formatted string ("X validated, Y rejected since last calculation")
    - `show_recalculate_prompt`: Boolean to show recalculation banner
  - **Validation Status Card:** Added to readiness page context grid
    - Shows 🎓 validated count and ⚠ rejected count
    - "New" badge pulses when updates available since last calculation
    - Amber styling when updates need attention
  - **CSS:** Added validation card styles with pulse animation
  - **Integration:** Works seamlessly with existing ValidationUpdateBanner component
  - **No additional API calls:** All validation info included in single context request

---

## 🔍 Enhancement: Evidence Context (No-Chat Validation)

**Problem Solved:** How can mentors make informed validation decisions without chat?

**Solution:** Add "Evidence Context" panel to mentor review UI that shows all relevant context.

### Evidence Context Panel Contents

| Evidence Type | Description | Why It Helps |
|---------------|-------------|--------------|
| **📋 Source Info** | Skill source (self/resume), level, date added | Shows how user claimed the skill |
| **📄 Resume Context** | Excerpt where skill was found (if from resume) | Direct proof from user's document |
| **🎯 Role Importance** | Required/Optional for user's target role | Helps prioritize validation |
| **🔗 Related Skills** | Other skills in same category (up to 5) | Shows skill cluster context |

### Implementation Details

- **Backend:** New endpoint `GET /mentor-validation/evidence/:user_id/:skill_id`
  - Returns: source info, resume context, role importance, related skills
  - Queries: `user_skills`, `resume_skill_suggestions`, `benchmark_skills`
  - No privacy violation: Only shows skill-related data, not personal info

- **Frontend:** Expandable "Evidence" button on each skill row
  - Click to expand/collapse evidence panel
  - Lazy-loaded (only fetches when expanded)
  - Cached (doesn't re-fetch if already loaded)

### Why This Works (No Chat Needed)

```
┌─────────────────────────────────────────────────────────────────┐
│                   MENTOR'S INTERNAL QUESTION                     │
├─────────────────────────────────────────────────────────────────┤
│  "Why does the system think this skill is relevant?"            │
│                                                                  │
│  Evidence Context answers this:                                  │
│  • Resume says "5 years of Python development"                   │
│  • Skill is REQUIRED for target role (Software Engineer)        │
│  • User has 4 related skills in same category (all validated)   │
│                                                                  │
│  Decision: ✓ Validate (strong evidence, fits role)              │
└─────────────────────────────────────────────────────────────────┘
```

**Key Principle:** No interaction needed. Mentors get context, make decision, move on.

---

## 📝 Open Questions (To Resolve in Later Steps)

1. **How do users find/request mentors?** (invite-only? browse? referral?)
2. **What qualifies someone as a mentor?** (experience? certification?)
3. **How many skills can a mentor validate at once?** (batch or one-by-one?)
4. **Should rejected skills affect readiness calculation?** (weight reduction?)
5. **Validation expiry period?** (1 year? never?)

---

## 🔗 Related Documents

- [Resume Skill Sync Spec](./RESUME_SKILL_SYNC_SPEC.md) - How resume skills flow into the system
- Readiness Engine - How scores are calculated (source agnostic)

---

*Document created: STEP 1 of Mentor Validation feature*
*Last updated: January 2026*
