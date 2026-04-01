import { NextResponse } from 'next/server';
import { getTasksByDate } from '@/app/actions/tasks';

export async function GET() {
  try {
    console.log('API: Testing getTasksByDate server action...');
    const today = new Date();
    const tasks = await getTasksByDate(today);
    console.log('API: Retrieved tasks:', tasks);
    
    return NextResponse.json({ 
      success: true,
      date: today.toISOString(),
      count: tasks.length,
      tasks: tasks
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
