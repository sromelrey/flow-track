import { NextResponse } from 'next/server';
import { getTaskTypes } from '@/app/actions/tasks';

export async function GET() {
  try {
    console.log('API: Testing getTaskTypes server action...');
    const types = await getTaskTypes();
    console.log('API: Result:', types);
    
    return NextResponse.json({ 
      success: true,
      count: types.length,
      types: types
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
