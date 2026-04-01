import { NextResponse } from 'next/server';
import { createTask } from '@/app/actions/tasks';
import { getTaskTypes } from '@/app/actions/tasks';

export async function GET() {
  try {
    console.log('API: Creating test task...');
    
    // Get first task type
    const types = await getTaskTypes();
    if (types.length === 0) {
      return NextResponse.json(
        { error: 'No task types found' },
        { status: 400 }
      );
    }

    console.log('API: Using task type:', types[0]);

    // Create a test task
    const result = await createTask({
      title: 'Test Task - ' + new Date().toLocaleTimeString(),
      taskDate: new Date(),
      typeId: types[0].id
    });

    console.log('API: Create result:', result);

    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: 'Test task created successfully',
        task: result.task
      });
    } else {
      return NextResponse.json(
        { error: result.error?.message || 'Failed to create task' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Test create error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
