import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { taskTypes } from '@/lib/schema';

export async function GET() {
  try {
    const allTypes = await db.select().from(taskTypes);
    return NextResponse.json({ 
      count: allTypes.length,
      taskTypes: allTypes 
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task types', details: error },
      { status: 500 }
    );
  }
}
