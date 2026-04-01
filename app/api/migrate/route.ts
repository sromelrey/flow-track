import { NextResponse } from 'next/server';
import { initialMigration } from '@/lib/migrate';

export async function GET() {
  try {
    await initialMigration();
    return NextResponse.json({ 
      success: true, 
      message: 'Initial migration completed successfully' 
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: 'Migration failed' },
      { status: 500 }
    );
  }
}
