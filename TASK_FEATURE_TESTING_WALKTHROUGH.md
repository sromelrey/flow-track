# Task Creation & Toggle Feature - Testing Walkthrough

## 🎯 Features to Test
1. **Task Creation** - Create tasks with title and type
2. **Task Toggle** - Mark tasks as complete/incomplete
3. **Task Deletion** - Delete tasks with confirmation dialog
4. **Daily Limit** - Enforce 5-task maximum with UI disable
5. **Duplicate Prevention** - Block duplicate tasks
6. **Progress Tracking** - Visual progress bar and counters

---

## 🚀 Prerequisites

### 1. Database Setup
```bash
# Ensure your .env.local has DATABASE_URL
cat .env.local | grep DATABASE_URL

# Start the dev server
pnpm dev
```

### 2. Initial Data Setup
Open these URLs in your browser:
```
http://localhost:3000/api/migrate
# Expected: {"success": true, "message": "Initial migration completed successfully"}

http://localhost:3000/api/seed
# Expected: {"success": true, "message": "Database seeded successfully"}
```

---

## 🧪 Test Cases

### Test 1: Task Creation

#### 1.1 Basic Task Creation
1. **Navigate to**: `http://localhost:3000/dashboard`
2. **Expected**: See task form with input field and type selector
3. **Actions**:
   - Type "Complete project documentation" in the input
   - Select "Dev" from the type dropdown
   - Press Enter or click the + button
4. **Expected Results**:
   - ✅ Green toast: "✅ Dev task created successfully!"
   - ✅ Task appears in the list below
   - ✅ Progress bar shows "0/1 tasks completed (0%)"
   - ✅ Task has blue "Dev" badge

#### 1.2 Test All Task Types
Repeat for each type:
- "Family dinner" → Family type (purple badge)
- "Morning run" → Health type (green badge)
- "Read book" → Personal type (yellow badge)

**Expected**: Each task shows correct color badge

#### 1.3 Empty Title Validation
1. **Actions**:
   - Leave input empty
   - Try to submit (Enter or + button)
2. **Expected**: ❌ Red toast: "Please enter a task title"

#### 1.4 No Type Selected
1. **Actions**:
   - Type "Test task"
   - Don't select a type
   - Try to submit
2. **Expected**: ❌ Red toast: "Please select a task type"

---

### Test 2: Task Toggle Completion

#### 2.1 Mark Task as Complete
1. **Actions**:
   - Click the checkbox next to any task
2. **Expected Results**:
   - ✅ Green toast: "✅ Task completed!"
   - ✅ Checkbox fills with green
   - ✅ Task text gets line-through
   - ✅ Background turns gray
   - ✅ Progress bar updates (e.g., "1/3 tasks completed (33%)")

#### 2.2 Mark Task as Incomplete
1. **Actions**:
   - Click the checkbox again on a completed task
2. **Expected Results**:
   - ✅ Toast: "Task marked as incomplete"
   - ✅ Checkbox empties
   - ✅ Line-through removed
   - ✅ Background returns to white
   - ✅ Progress bar updates down

#### 2.3 Toggle Multiple Tasks
1. **Actions**:
   - Complete 2 out of 3 tasks
2. **Expected**: Progress shows "2/3 tasks completed (67%)"

---

### Test 3: Task Deletion

#### 3.1 Delete Single Task
1. **Actions**:
   - Create at least 1 task
   - Click the trash icon next to any task
2. **Expected Results**:
   - ✅ Confirmation dialog appears with message: "Are you sure you want to delete this task? This action cannot be undone."
   - ✅ Dialog has "Cancel" and "Delete" buttons
   - ✅ Pressing Escape closes dialog
   - ✅ Pressing Enter confirms deletion

#### 3.2 Confirm Deletion
1. **Actions**:
   - Click "Delete" in confirmation dialog
2. **Expected Results**:
   - ✅ Task fades out with smooth animation (slides right and disappears)
   - ✅ Success toast: "Task deleted successfully"
   - ✅ Progress bar updates immediately
   - ✅ Task count decreases

#### 3.3 Cancel Deletion
1. **Actions**:
   - Click trash icon
   - Click "Cancel" or press Escape
2. **Expected**:
   - ✅ Dialog closes
   - ✅ Task remains unchanged
   - ✅ No toast notification

#### 3.4 Delete Multiple Tasks
1. **Actions**:
   - Create 3-4 tasks
   - Delete them one by one
2. **Expected**:
   - ✅ Each deletion works independently
   - ✅ Progress updates after each deletion
   - ✅ Form re-enables when dropping below 5 tasks

---

### Test 4: Daily Limit Enforcement

#### 4.1 Reach Daily Limit
1. **Actions**:
   - Create 5 tasks (any types)
2. **Expected Results**:
   - After 5th task: 📋 Amber message: "Daily task limit reached (5/5). Great job staying focused!"
   - Progress shows: "5/5 tasks completed (X%)"

#### 4.2 Form Disable at Limit
1. **Expected UI Changes**:
   - ✅ Input field shows: "Daily limit reached (5/5)"
   - ✅ Input field is disabled (grayed out, not editable)
   - ✅ Type selector dropdown is disabled
   - ✅ Add button is disabled
   - ✅ "5/5 tasks" overlay appears on input
   - ✅ Hovering disabled button shows tooltip: "Daily limit reached (5 tasks)"

#### 4.3 Attempt to Create 6th Task
1. **Actions**:
   - Try to type in disabled input
   - Try to click add button
2. **Expected**:
   - ✅ Cannot type in input
   - ✅ Button doesn't respond
   - ✅ No error toast (form is disabled, not error)

#### 4.4 Re-enable After Deletion
1. **Actions**:
   - At 5 tasks limit, delete 1 task
2. **Expected**:
   - ✅ Form immediately re-enables
   - ✅ Placeholder returns to "Add a task... (Press Enter)"
   - ✅ All controls become active again

---

### Test 5: Duplicate Prevention

#### 5.1 Create Duplicate Task
1. **Actions**:
   - Create task: "Test task" (type: Dev)
   - Try to create same task again: "Test task" (type: Dev)
2. **Expected**: ❌ Red toast: "Task already exists for this date"

#### 5.2 Same Title, Different Type
1. **Actions**:
   - Create "Exercise" (type: Health)
   - Create "Exercise" (type: Personal)
2. **Expected**: ✅ Both tasks created (different types allow duplicates)

---

### Test 6: Progress Tracking

#### 6.1 Empty State
1. **Actions**:
   - Delete all tasks (or wait for next day)
2. **Expected**: 
   - Message: "No tasks for today. Add one above!"
   - No progress bar shown

#### 6.2 Progress Animation
1. **Actions**:
   - Create tasks one by one
   - Toggle completion
2. **Expected**: 
   - ✅ Progress bar animates smoothly
   - ✅ Percentage updates instantly
   - ✅ Color transitions are smooth

---

## 🗄️ Database Retrieval Tests

### Test 7: Task Persistence & Retrieval

#### 7.1 Verify Tasks Persist After Refresh
1. **Actions**:
   - Create 2-3 tasks with different types
   - Toggle one task to complete
   - Refresh the page (F5 or Ctrl+R)
2. **Expected Results**:
   - ✅ All tasks still appear in list
   - ✅ Completed task remains checked
   - ✅ Progress bar shows correct state
   - ✅ Task types and colors preserved

#### 7.2 Check Database Directly
1. **Open**: `http://localhost:3000/api/debug/tasks`
2. **Expected**: 
   ```json
   {
     "success": true,
     "date": "2026-04-01T...",
     "count": 3,
     "tasks": [
       {
         "id": "...",
         "title": "Your task",
         "completed": false,
         "typeName": "Dev",
         "typeColor": "#3B82F6"
       }
     ]
   }
   ```
3. **Verify in Browser Console**:
   - Open DevTools → Network tab
   - Create a new task
   - Look for `POST /dashboard` request
   - Check Response tab shows created task data
4. **Verify Persistence**:
   - Create a task
   - Refresh the debug endpoint
   - Task should appear in the list

#### 7.3 Test Date-Specific Retrieval
1. **Actions**:
   - Note today's date
   - Create a task
   - Change system date (optional) or wait until tomorrow
2. **Expected**:
   - Tasks only show for the current date
   - Previous day's tasks don't appear (each day is fresh)

#### 7.4 Verify Real-time Updates
1. **Actions**:
   - Open dashboard in two browser tabs
   - Create task in Tab A
   - Switch to Tab B
2. **Expected**:
   - Tab B shows new task without refresh
   - Progress updates in both tabs

---

## � Debugging Tools

### Check Database State
```
http://localhost:3000/api/debug/task-types
# Shows all task types in database

http://localhost:3000/api/debug/tasks
# Shows today's tasks from database (with full details)

http://localhost:3000/api/test/task-types
# Tests server action directly
```

### Database Retrieval Implementation
The system retrieves tasks using:
1. **Server Action**: `getTasksByDate(date)` in `app/actions/tasks.ts`
2. **Query**: Joins tasks with taskTypes for color/name info
3. **Filtering**: By userId and exact date match
4. **Client**: TaskList component calls this on mount and after task creation

### Browser Console
Open DevTools (F12) and watch for:
- "Starting to load task types..."
- "Loaded task types: [...]"
- "Fetched task types from DB: [...]"
- Any error messages

---

## 📱 Mobile Testing

### Responsive Design
1. **Resize browser** to mobile width (375px)
2. **Expected**:
   - Form stacks vertically
   - Type selector adjusts width
   - Tasks remain readable
   - Touch targets are large enough

### Touch Interactions
1. **On mobile/touch device**:
   - Tap checkboxes to toggle
   - Tap to select type
   - Keyboard appears on input focus

---

## ✅ Success Criteria

### Must Pass
- [ ] Create tasks with all 4 types
- [ ] Toggle task completion
- [ ] Delete tasks with confirmation
- [ ] See progress updates after deletion
- [ ] Daily limit enforced (5 tasks)
- [ ] Form disables at limit
- [ ] Duplicates blocked
- [ ] Toast notifications appear
- [ ] No console errors

### Should Pass
- [ ] Smooth animations (fade out delete)
- [ ] Responsive on mobile
- [ ] Keyboard shortcuts work (Enter, Escape)
- [ ] Visual feedback on hover
- [ ] Color coding consistent
- [ ] Delete button accessible

---

## 🐛 Common Issues & Solutions

### Issue: Task types not showing
**Solution**: Visit `/api/seed` to populate default types

### Issue: Tasks not saving
**Solution**: Check DATABASE_URL in .env.local

### Issue: No toast notifications
**Solution**: Ensure Toaster component is in layout.tsx

### Issue: Progress not updating
**Solution**: Refresh page, check browser console for errors

---

## 📊 Performance Checks

### Load Time
- Task list should load within 500ms
- No layout shift when loading

### Memory
- No memory leaks on repeated toggle
- Console should be clean of warnings

---

## 🎨 Visual Regression

### Screenshots to Capture
1. Empty state
2. 1 task created
3. 3 tasks with mixed completion
4. 5 tasks (limit reached)
5. Mobile view

---

## 📝 Test Report Template

```
Date: ___________
Browser: ___________
Device: ___________

✅ Passed Tests:
- Task creation: ____
- Task toggle: ____
- Daily limit: ____
- Progress tracking: ____

❌ Failed Tests:
- Test name: Description

🐛 Bugs Found:
1. Description

💡 Suggestions:
1. Improvement idea
```

---

## 🚀 Next Features to Test

Phase 1 is now complete! ✅ All features implemented:
- ✅ Feature 1.1: Create Task
- ✅ Feature 1.2: Toggle Task Completion
- ✅ Feature 1.3: Delete Task
- ✅ Feature 1.4: Get Tasks by Date
- ✅ Feature 1.5: Enhanced Daily Limit UI

Ready for Phase 2: Dashboard Data Integration
1. **Feature 2.1**: Daily Progress Calculation
2. **Feature 2.2**: Weekly Progress Calculation
3. **Feature 2.3**: Monthly Progress Calculation

---

**Happy Testing! 🎯**
