'use server';

import { db } from '@/lib/db';
import { tasks, taskTypes } from '@/lib/schema';
import { eq, and, count, sql, isNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { CreateTaskInput, TaskResult, TaskValidationError } from '@/lib/types';

// Mock user ID - replace with actual auth system
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export async function createTask(input: CreateTaskInput): Promise<TaskResult> {
  try {
    // Validate task count for the day
    const taskCount = await db
      .select({ count: count() })
      .from(tasks)
      .where(and(
        eq(tasks.userId, MOCK_USER_ID),
        sql`${tasks.taskDate} = ${input.taskDate.toISOString()}`
      ))
      .then(result => result[0]?.count || 0);

    if (taskCount >= 5) {
      const error: TaskValidationError = {
        code: 'DAILY_LIMIT',
        message: 'Maximum 5 tasks allowed per day'
      };
      return { success: false, error };
    }

    // Check for duplicate task
    const existingTask = await db
      .select()
      .from(tasks)
      .where(and(
        eq(tasks.userId, MOCK_USER_ID),
        eq(tasks.title, input.title),
        sql`${tasks.taskDate} = ${input.taskDate.toISOString()}`
      ))
      .limit(1);

    if (existingTask.length > 0) {
      const error: TaskValidationError = {
        code: 'DUPLICATE_TASK',
        message: 'Task already exists for this date'
      };
      return { success: false, error };
    }

    // Create the task
    const [newTask] = await db
      .insert(tasks)
      .values({
        userId: MOCK_USER_ID,
        title: input.title,
        taskDate: input.taskDate.toISOString(),
        typeId: input.typeId,
      })
      .returning();

    // Fetch task with type information
    const taskWithType = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        completed: tasks.completed,
        taskDate: tasks.taskDate,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        typeId: taskTypes.id,
        typeName: taskTypes.name,
        typeColor: taskTypes.color,
      })
      .from(tasks)
      .leftJoin(taskTypes, eq(tasks.typeId, taskTypes.id))
      .where(eq(tasks.id, newTask.id))
      .limit(1);

    // Revalidate dashboard cache
    revalidatePath('/dashboard');
    revalidatePath('/tasks');

    const task = taskWithType[0];
    return { 
      success: true, 
      task: {
        id: task.id,
        userId: MOCK_USER_ID,
        title: task.title,
        completed: task.completed || false,
        taskDate: new Date(task.taskDate),
        createdAt: task.createdAt || new Date(),
        updatedAt: task.updatedAt || new Date(),
        typeId: task.typeId!,
        taskType: task.typeId ? {
          id: task.typeId!,
          name: task.typeName!,
          color: task.typeColor!,
          userId: null,
          createdAt: new Date()
        } : undefined
      }
    };

  } catch (error) {
    console.error('Failed to create task:', error);
    return { 
      success: false, 
      error: {
        code: 'INVALID_DATE',
        message: 'Failed to create task'
      }
    };
  }
}

export async function getTaskTypes() {
  try {
    // Get all default task types (where userId is null)
    const allTypes = await db
      .select()
      .from(taskTypes)
      .where(isNull(taskTypes.userId));
    
    // Remove duplicates by name
    const uniqueTypes = allTypes.reduce((acc, current) => {
      const exists = acc.find(type => type.name === current.name);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, [] as typeof allTypes);
    
    console.log('Fetched task types from DB:', uniqueTypes);
    return uniqueTypes;
  } catch (error) {
    console.error('Failed to get task types:', error);
    return [];
  }
}

export async function toggleTask(taskId: string) {
  try {
    // Get current task state
    const [currentTask] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .limit(1);

    if (!currentTask) {
      return { success: false, error: 'Task not found' };
    }

    // Toggle completed status
    const [updatedTask] = await db
      .update(tasks)
      .set({ 
        completed: !currentTask.completed,
        updatedAt: new Date()
      })
      .where(eq(tasks.id, taskId))
      .returning();

    // Revalidate dashboard cache
    revalidatePath('/dashboard');
    revalidatePath('/tasks');

    return { 
      success: true, 
      task: {
        id: updatedTask.id,
        userId: updatedTask.userId,
        title: updatedTask.title,
        completed: updatedTask.completed,
        taskDate: new Date(updatedTask.taskDate),
        createdAt: updatedTask.createdAt || new Date(),
        updatedAt: updatedTask.updatedAt || new Date(),
        typeId: updatedTask.typeId,
      }
    };
  } catch (error) {
    console.error('Failed to toggle task:', error);
    return { success: false, error: 'Failed to update task' };
  }
}

export async function getTasksByDate(date: Date) {
  try {
    console.log('getTasksByDate: Fetching for date:', date.toISOString());
    
    // Convert to date string (YYYY-MM-DD) for comparison
    const dateStr = date.toISOString().split('T')[0];
    console.log('getTasksByDate: Date string for comparison:', dateStr);
    
    const tasksWithTypes = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        completed: tasks.completed,
        taskDate: tasks.taskDate,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        typeId: taskTypes.id,
        typeName: taskTypes.name,
        typeColor: taskTypes.color,
      })
      .from(tasks)
      .leftJoin(taskTypes, eq(tasks.typeId, taskTypes.id))
      .where(and(
        eq(tasks.userId, MOCK_USER_ID),
        sql`DATE(${tasks.taskDate}) = DATE(${dateStr})`
      ))
      .orderBy(tasks.createdAt);

    console.log('getTasksByDate: Raw DB result:', tasksWithTypes);

    const result = tasksWithTypes.map(task => {
      console.log('Processing task:', task);
      return {
        id: task.id,
        userId: MOCK_USER_ID,
        title: task.title,
        completed: task.completed ?? false,
        taskDate: new Date(task.taskDate),
        createdAt: task.createdAt || new Date(),
        updatedAt: task.updatedAt || new Date(),
        typeId: task.typeId || '',
        taskType: task.typeId ? {
          id: task.typeId,
          name: task.typeName || '',
          color: task.typeColor || '',
          userId: null,
          createdAt: new Date()
        } : undefined
      };
    });

    console.log('getTasksByDate: Final result:', result);
    return result;
  } catch (error) {
    console.error('Failed to get tasks:', error);
    return [];
  }
}
