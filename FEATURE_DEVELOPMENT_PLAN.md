# ADHD-Friendly Productivity App - Feature Development Plan

## Tech Stack
- **Frontend**: Next.js (App Router)
- **Backend**: Server Actions (no API routes)
- **Database**: Neon PostgreSQL
- **UI**: Tailwind CSS + shadcn/ui

## App Overview
A minimal, fast productivity app designed for ADHD users to maintain consistency across 4 life areas:
- Frontend Development
- Family
- Health (exercise)
- Personal (daily tasks)

---

## DATABASE SCHEMA

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Task types (customizable categories)
CREATE TABLE task_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) NOT NULL, -- hex color
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_type_id UUID REFERENCES task_types(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  task_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, title, task_date)
);

-- Plans (templates)
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Plan tasks (template tasks)
CREATE TABLE plan_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  task_type_id UUID REFERENCES task_types(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Study checklist items
CREATE TABLE study_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Streak tracking
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  streak_date DATE NOT NULL,
  tasks_completed INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, streak_date)
);
```

---

## PHASE 1 — CORE TASK SYSTEM

### Feature 1.1: Create Task
**Title**: Create new task with date and type  
**Description**: Allow users to add tasks to specific dates with assigned types  
**Acceptance Criteria**:
- User can input task title
- User can select date (defaults to today)
- User can select task type
- Maximum 5 tasks per day enforcement
- Success feedback on creation
- Error handling for duplicates and daily limit

**Technical Notes**:
- Server Action: `createTask(title: string, date: Date, typeId: UUID)`
- Validate task count before creation
- Return created task with full details

**Dependencies**: Task types must exist (use defaults if none)

### Feature 1.2: Toggle Task Completion
**Title**: Mark task as complete/incomplete  
**Description**: Toggle task completion status with instant feedback  
**Acceptance Criteria**:
- Click checkbox to toggle completion
- Visual feedback (animation, color change)
- Progress updates immediately
- Completion persists on refresh

**Technical Notes**:
- Server Action: `toggleTask(taskId: UUID)`
- Update completed timestamp
- Return updated task

### Feature 1.3: Delete Task
**Title**: Remove task from system  
**Description**: Delete tasks with confirmation  
**Acceptance Criteria**:
- Delete button on each task
- Confirmation dialog
- Smooth removal animation
- Updates remaining task count

**Technical Notes**:
- Server Action: `deleteTask(taskId: UUID)`
- Soft delete optional (for recovery)

### Feature 1.4: Get Tasks by Date
**Title**: Retrieve tasks for specific date  
**Description**: Fetch and display tasks for any given date  
**Acceptance Criteria**:
- Navigate between dates
- Show task count (e.g., "3 of 5 tasks")
- Empty state for no tasks
- Loading state during fetch

**Technical Notes**:
- Server Action: `getTasksByDate(date: Date)`
- Include task type details
- Order by creation time

### Feature 1.5: Daily Task Limit Enforcement
**Title**: Enforce maximum 5 tasks per day  
**Description**: Prevent users from adding more than 5 tasks daily  
**Acceptance Criteria**:
- Clear indication when limit reached
- Disable add button at limit
- Show "5/5 tasks" message
- Allow completion of existing tasks

**Technical Notes**:
- Validation in `createTask` action
- Real-time count updates

---

## PHASE 2 — DASHBOARD DATA INTEGRATION

### Feature 2.1: Daily Progress Calculation
**Title**: Calculate and display daily completion rate  
**Description**: Show percentage of tasks completed each day  
**Acceptance Criteria**:
- Calculate (completed / total) × 100
- Update in real-time
- Handle zero tasks gracefully
- Display in progress ring

**Technical Notes**:
- Server Action: `getDailyProgress(date: Date)`
- Return percentage and counts

### Feature 2.2: Weekly Progress Calculation
**Title**: Track weekly task completion trends  
**Description**: Calculate progress for current week  
**Acceptance Criteria**:
- Show current week's completion rate
- Week starts on Monday
- Update daily
- Visual indicator in dashboard

**Technical Notes**:
- Server Action: `getWeeklyProgress()`
- Aggregate daily data

### Feature 2.3: Monthly Progress Calculation
**Title**: Monitor monthly productivity patterns  
**Description**: Calculate monthly completion statistics  
**Acceptance Criteria**:
- Show current month's progress
- Compare with previous month
- Include streak information
- Display in dashboard

**Technical Notes**:
- Server Action: `getMonthlyProgress()`
- Cache for performance

### Feature 2.4: Calendar Heatmap Data
**Title**: Generate GitHub-style activity heatmap  
**Description**: Create visual representation of daily activity  
**Acceptance Criteria**:
- 30-day rolling window
- Color intensity based on task count
- Hover tooltips with details
- Responsive grid layout

**Technical Notes**:
- Server Action: `getHeatmapData(days: number = 30)`
- Return array of { date, count, intensity }
- Calculate intensity levels (0-5)

---

## PHASE 3 — TASK TYPES (SETTINGS)

### Feature 3.1: Manage Task Types
**Title**: CRUD operations for task categories  
**Description**: Allow users to customize task categories  
**Acceptance Criteria**:
- Create new task type with name and color
- Edit existing task type
- Delete unused task types
- Color picker for visual distinction
- Default types for new users

**Technical Notes**:
- Server Actions: `createTaskType()`, `updateTaskType()`, `deleteTaskType()`
- Prevent deletion of types with tasks
- Provide predefined color palette

### Feature 3.2: Assign Types to Tasks
**Title**: Link tasks to categories  
**Description**: Categorize tasks for better organization  
**Acceptance Criteria**:
- Select type during task creation
- Change type of existing task
- Filter tasks by type
- Visual indicators (badges, colors)

**Technical Notes**:
- Update task form with type selector
- Add type filtering to task list

---

## PHASE 4 — PLANS (TEMPLATES)

### Feature 4.1: Create Plan Templates
**Title**: Build reusable task templates  
**Description**: Create plans with predefined tasks  
**Acceptance Criteria**:
- Name and describe plan
- Add multiple tasks to plan
- Reorder tasks with drag-and-drop
- Save as template
- List all user plans

**Technical Notes**:
- Server Actions: `createPlan()`, `addTaskToPlan()`, `reorderPlanTasks()`
- Use `plan_tasks` table for template items

### Feature 4.2: Apply Plan to Date
**Title**: Generate tasks from template  
**Description**: Apply plan template to specific date  
**Acceptance Criteria**:
- Select plan and target date
- Preview tasks before applying
- Respect daily task limit
- Skip duplicates
- Batch creation with feedback

**Technical Notes**:
- Server Action: `applyPlanToDate(planId: UUID, date: Date)`
- Validate against existing tasks
- Transaction for atomic operation

---

## PHASE 5 — STUDY PLAN

### Feature 5.1: Study Checklist
**Title**: Create study-related checklists  
**Description**: Separate study items from daily tasks  
**Acceptance Criteria**:
- Add study items
- Mark as complete
- Separate from main task list
- Persistent across sessions
- Clear/complete all option

**Technical Notes**:
- Server Actions: `createStudyItem()`, `toggleStudyItem()`
- Different table from tasks
- No daily limit

### Feature 5.2: Convert Study to Task
**Title**: Transform study items into tasks  
**Description**: Move completed study items to task list  
**Acceptance Criteria**:
- Select completed study item
- Convert to task with current date
- Remove from study list
- Assign default task type

**Technical Notes**:
- Server Action: `convertStudyToTask(studyItemId: UUID)`
- Create task and delete study item in transaction

---

## PHASE 6 — STREAK SYSTEM

### Feature 6.1: Track Daily Streaks
**Title**: Monitor consecutive active days  
**Description**: Track days with at least one completed task  
**Acceptance Criteria**:
- Calculate current streak
- Display streak count prominently
- Reset on missed day
- Show streak history

**Technical Notes**:
- Server Action: `getStreakData()`
- Update `streaks` table daily
- Handle timezone issues

### Feature 6.2: Streak Preservation
**Title**: Maintain streak across timezones  
**Description**: Ensure streak accuracy regardless of user location  
**Acceptance Criteria**:
- Use UTC for streak calculations
- Graceful period for completion
- Visual streak indicator
- Streak recovery options

**Technical Notes**:
- Store streak dates in UTC
- Consider 24-hour grace period
- Background job for streak updates

---

## SERVER ACTIONS REFERENCE

### Task Management
```typescript
createTask(title: string, date: Date, typeId: UUID)
toggleTask(taskId: UUID)
deleteTask(taskId: UUID)
getTasksByDate(date: Date)
updateTask(taskId: UUID, updates: Partial<Task>)
```

### Progress & Analytics
```typescript
getDailyProgress(date: Date)
getWeeklyProgress()
getMonthlyProgress()
getHeatmapData(days: number)
getStreakData()
```

### Task Types
```typescript
createTaskType(name: string, color: string)
updateTaskType(typeId: UUID, updates: Partial<TaskType>)
deleteTaskType(typeId: UUID)
getTaskTypes()
```

### Plans & Templates
```typescript
createPlan(name: string, description: string)
addTaskToPlan(planId: UUID, title: string, typeId: UUID, order: number)
applyPlanToDate(planId: UUID, date: Date)
getPlans()
getPlanById(planId: UUID)
```

### Study Items
```typescript
createStudyItem(title: string)
toggleStudyItem(itemId: UUID)
deleteStudyItem(itemId: UUID)
getStudyItems()
convertStudyToTask(itemId: UUID, date: Date)
```

---

## UI/UX CONSIDERATIONS

### Design Principles
1. **Minimal Interface**: Reduce cognitive load
2. **Instant Feedback**: All actions provide immediate visual response
3. **Clear Constraints**: Show task limits clearly
4. **Rewarding Interactions**: Celebrate completions
5. **Fast Navigation**: Quick date switching

### Key Interactions
- Quick add task (inline, no modal)
- Keyboard shortcuts for power users
- Swipe gestures on mobile
- Drag-and-drop for reordering
- One-click template application

### Visual Design
- Consistent color coding for task types
- Progress indicators everywhere
- Smooth micro-animations
- Clear typography
- High contrast for accessibility

---

## OPTIONAL / FUTURE IMPROVEMENTS

### Gamification
- Streak badges and rewards
- Achievement system
- Productivity points
- Weekly challenges

### Notifications
- Daily task reminders
- Streak warnings
- Progress summaries
- Motivational messages

### Enhanced Features
- Drag-and-drop task ordering
- Weekly review dashboard
- Time tracking per task
- Subtasks support
- Task notes/descriptions

### Technical Enhancements
- PWA for mobile experience
- Offline mode support
- Real-time collaboration
- Data export/import
- API for integrations

### AI Integration
- Smart task suggestions
- Productivity insights
- Optimal task timing
- Personalized recommendations

---

## DEVELOPMENT PRIORITY

1. **Must Have**: Phases 1-2 (Core functionality)
2. **Should Have**: Phases 3-4 (Customization)
3. **Could Have**: Phase 5-6 (Advanced features)
4. **Won't Have**: Future improvements (v2.0+)

---

## TESTING STRATEGY

### Unit Tests
- All server actions
- Database operations
- Utility functions
- Progress calculations

### Integration Tests
- Task creation flow
- Plan application
- Streak calculations
- Data consistency

### E2E Tests
- Critical user journeys
- Cross-browser compatibility
- Mobile responsiveness
- Performance benchmarks

---

This plan provides a clear roadmap for building an ADHD-friendly productivity app while maintaining simplicity and focusing on user needs. Each phase builds upon the previous one, ensuring a solid foundation before adding complexity.
