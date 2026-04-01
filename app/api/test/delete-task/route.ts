import { NextResponse } from 'next/server';
import { deleteTask } from '@/app/actions/tasks';
import { getTasksByDate } from '@/app/actions/tasks';

export async function GET() {
  try {
    // Get today's tasks
    const today = new Date();
    const tasks = await getTasksByDate(today);
    
    if (tasks.length === 0) {
      return NextResponse.json(
        { error: 'No tasks to delete' },
        { status: 400 }
      );
    }

    // Delete the first task
    const taskToDelete = tasks[0];
    const result = await deleteTask(taskToDelete.id);

    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: `Deleted task: ${taskToDelete.title}`,
        deletedTask: taskToDelete
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Test delete error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
