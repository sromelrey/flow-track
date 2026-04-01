import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { taskTypes } from '@/lib/schema';
import { isNull } from 'drizzle-orm';

export async function GET() {
  try {
    // Try different ways to query null values
    const withIsNull = await db.select().from(taskTypes).where(isNull(taskTypes.userId));
    const allTypes = await db.select().from(taskTypes);
    
    return NextResponse.json({ 
      total: allTypes.length,
      withIsNull: withIsNull.length,
      sample: withIsNull.slice(0, 4)
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch', details: String(error) },
      { status: 500 }
    );
  }
}
