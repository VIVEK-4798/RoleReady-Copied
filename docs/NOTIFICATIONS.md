# 🔔 Readiness Notifications & Action Triggers System

## Philosophy

Notifications in RoleReady are:
- **System-generated** - Never manually created
- **Event-based** - Triggered by specific actions
- **Actionable** - Every notification has a clear next step
- **Non-spammy** - Deduplicated, no duplicates of same type

Every notification answers: **"What changed, and what should I do now?"**

## Notification Types (Fixed List)

| Type | Trigger Event | Message |
|------|--------------|---------|
| `readiness_outdated` | Profile/skills changed | "Your readiness needs recalculation" |
| `mentor_validation` | Skills validated/rejected | "A mentor has reviewed your skills" |
| `roadmap_updated` | New roadmap saved | "Your roadmap has been updated" |
| `role_changed` | Target role switched | "You've selected a new target role" |

**No expansion of this list.** These 4 types cover all necessary user guidance.

---

## Who Gets Which Notifications?

### 👤 Regular Users (Students/Job Seekers)

Users receive notifications to guide their readiness journey:

| Notification Type | When Triggered | User Action |
|-------------------|---------------|-------------|
| `readiness_outdated` | After mentor validates/rejects skills | Recalculate readiness |
| `mentor_validation` | Mentor validates or rejects their skills | Review feedback, update skills |
| `roadmap_updated` | New roadmap saved after readiness calc | View updated learning path |
| `role_changed` | User switches target role | Calculate readiness for new role |

**Where to View:** 
- Dashboard header bell icon → Dropdown (shows only unread notifications)
- Full page: `/dashboard/notifications` (accessible via sidebar)
- Contextual banners on dashboard and roadmap pages

**Key Features:**
- Bell dropdown shows only **unread notifications** (max 10)
- "View all notifications" link in dropdown → Opens full page
- Sidebar has dedicated "Notifications" menu item
- Filter by status (All/Unread/Read)
- Filter by type (Readiness/Validation/Roadmap/Role Change)
- Mark individual or all as read
- Delete notifications
- Click "Take Action" to navigate to relevant page

### 🎓 Mentors

Currently, mentors **do not receive notifications** in the system. However, the UI is ready:

- ✅ Notifications link in mentor sidebar
- ✅ Notifications page route: `/mentor-dashboard/notifications`
- ✅ Bell icon visible in header (will show 0 notifications)

**Future implementation:** Could add notifications for:
- New validation requests in queue
- User completes roadmap items after mentor validation
- Bulk validation reminders

### 🔧 Admins

Currently, admins **do not receive notifications**. Admins work in a management context, not a guided workflow.

**Future consideration:** Could add notifications for:
- System health alerts
- New role/skill requests from users
- Bulk validation completion

---

## Database Schema

```sql
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('readiness_outdated', 'mentor_validation', 'roadmap_updated', 'role_changed'),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);
```

---

## Backend API

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications/:user_id` | Get all notifications |
| GET | `/api/notifications/:user_id/unread-count` | Get unread count |
| GET | `/api/notifications/:user_id/contextual` | Get notifications for banners |
| PATCH | `/api/notifications/:id/read` | Mark single as read |
| PATCH | `/api/notifications/:user_id/read-all` | Mark all as read |
| DELETE | `/api/notifications/:id` | Delete notification |

### Trigger Functions

Exported from `notificationService.js` for use in other services:

```javascript
const { 
  triggerReadinessOutdated,
  triggerMentorValidation,
  triggerRoadmapUpdated,
  triggerRoleChanged 
} = require('./notificationService');

// Usage examples
await triggerReadinessOutdated(userId);
await triggerMentorValidation(userId, validatedCount, rejectedCount);
await triggerRoadmapUpdated(userId, newTaskCount);
await triggerRoleChanged(userId, newRoleName);
```

### Deduplication Logic

- Before creating a new notification, check for existing unread of same type
- If exists → Update timestamp instead of creating duplicate
- Result: User never sees duplicate "Readiness outdated" notifications

---

## Frontend Components

### NotificationBell (`src/components/notifications/NotificationBell.jsx`)

Placed in dashboard header. Features:
- 🔔 Bell icon with unread badge
- Dropdown with **unread notifications only** (max 10)
- Click to navigate + mark as read
- "Mark all read" button
- "View all notifications" link → Opens full page via sidebar
- Polls for unread count every 30 seconds

```jsx
import NotificationBell from '@/components/notifications/NotificationBell';

// In header:
<NotificationBell userId={userId} />
```

### NotificationBanner (`src/components/notifications/NotificationBanner.jsx`)

Contextual banners on relevant pages. Features:
- Shows unread notifications filtered by type
- Color-coded by notification type
- "Take Action" button → navigates + marks read
- Dismissable (marks as read)

```jsx
import NotificationBanner from '@/components/notifications/NotificationBanner';

// On dashboard page:
<NotificationBanner 
  userId={userId}
  types={['readiness_outdated', 'mentor_validation']}
/>

// On roadmap page:
<NotificationBanner 
  userId={userId}
  types={['roadmap_updated', 'readiness_outdated']}
/>
```

---

## Integration Points

### 1. Role Change → Notification

**File:** `backend/service/roleSelectionService.js`

```javascript
// After updating target role:
triggerRoleChanged(user_id, newRole.category_name);
```

### 2. Mentor Validation → Notification

**File:** `backend/service/mentorValidation.js`

```javascript
// After validating skill:
triggerMentorValidation(user_id, 1, 0);  // 1 validated, 0 rejected
triggerReadinessOutdated(user_id);

// After rejecting skill:
triggerMentorValidation(user_id, 0, 1);  // 0 validated, 1 rejected
triggerReadinessOutdated(user_id);
```

### 3. Roadmap Saved → Notification

**File:** `backend/service/roadmapService.js`

```javascript
// After saving roadmap:
triggerRoadmapUpdated(user_id, roadmap.items.length);
```

---

## Banner Placement

| Page | Notification Types Shown |
|------|-------------------------|
| User Dashboard | `readiness_outdated`, `mentor_validation`, `role_changed` |
| Roadmap Page | `roadmap_updated`, `readiness_outdated` |
| Mentor Dashboard | (No user notifications) |

---

## Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| Multiple events → single notification | Deduplication updates timestamp |
| Old unread notifications | Persist until explicitly read |
| Logged out user | Notifications persist in DB |
| Deleted user | CASCADE delete removes notifications |

---

## Testing

### Run Migration
```bash
mysql -u root -p role_ready < backend/migrations/notifications_system.sql
```

### Test API
```bash
# Create test notification (via trigger)
curl -X POST http://localhost:5000/api/role-selection/change-role \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "new_role_id": 17, "changed_by": 1}'

# Get notifications
curl http://localhost:5000/api/notifications/1

# Get unread count
curl http://localhost:5000/api/notifications/1/unread-count

# Mark as read
curl -X PATCH http://localhost:5000/api/notifications/1/read
```

---

## File Summary

| File | Purpose |
|------|---------|
| `backend/migrations/notifications_system.sql` | Database schema |
| `backend/service/notificationService.js` | API + trigger functions |
| `src/components/notifications/NotificationBell.jsx` | Header bell component |
| `src/components/notifications/NotificationBanner.jsx` | Contextual banner component |
| `src/pages/notifications/index.jsx` | Full notifications page |
| `src/components/dashboard/dashboard/common/Sidebar.jsx` | Notifications link added to user sidebar |
| `src/components/dashboard/mentor-dashboard/common/Sidebar.jsx` | Notifications link added to mentor sidebar |
| `src/components/header/dashboard-header/index.jsx` | Bell added to header |
| `src/components/dashboard/dashboard/db-dashboard/index.jsx` | Banner added to user dashboard |
| `src/pages/roadmap/index.jsx` | Banner added to roadmap page |
| `src/App.jsx` | Routes added for `/dashboard/notifications` and `/mentor-dashboard/notifications` |

---

## Notifications Page Features

**Route:** `/dashboard/notifications`

The full notifications page provides:

### Features
- **Complete notification list** - View all notifications with pagination
- **Status filters** - All / Unread / Read
- **Type filters** - All Types / Readiness / Validation / Roadmap / Role Change
- **Bulk actions** - Mark all as read
- **Individual actions:**
  - "Take Action" - Navigate to relevant page and mark as read
  - "Mark Read" - Mark single notification as read without navigation
  - "Delete" (✕) - Permanently delete notification

### UI Elements
- Icon indicators for each notification type (🔄 ✅ 🗺️ 🎯)
- Unread badge with blue dot
- Type labels (Readiness, Validation, Roadmap, Role Change)
- Relative timestamps (e.g., "5m ago", "2h ago", "Jan 30")
- Visual distinction between read (white bg) and unread (blue bg)

### Empty States
- "No unread notifications" - When filtered to unread
- "No notifications yet" - When user has no notifications
- Friendly messaging: "You're all caught up!"

---

## Guardrails

✅ Notification creation is **side-effect only** - never blocks core logic  
✅ All notifications have **action URLs** for immediate navigation  
✅ **No auto-dismiss** - user must explicitly interact  
✅ **No priorities/expiry** - simple and predictable  
✅ Bell polls every **30 seconds** - not real-time but sufficient  
✅ Fixed notification types - **no expansion without review**
