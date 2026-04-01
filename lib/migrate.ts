import { db } from '@/lib/db';
import { users, taskTypes } from '@/lib/schema';

export async function initialMigration() {
  try {
    // Create mock user
    const [mockUser] = await db
      .insert(users)
      .values({
        id: '00000000-0000-0000-0000-000000000001',
        email: 'mock@example.com',
      })
      .onConflictDoNothing()
      .returning();

    console.log('Mock user created:', mockUser);

    // Create default task types
    await db
      .insert(taskTypes)
      .values([
        {
          userId: null, // null means it's a default type
          name: 'Dev',
          color: '#3B82F6',
        },
        {
          userId: null,
          name: 'Family',
          color: '#8B5CF6',
        },
        {
          userId: null,
          name: 'Health',
          color: '#10B981',
        },
        {
          userId: null,
          name: 'Personal',
          color: '#F59E0B',
        },
      ])
      .onConflictDoNothing();

    console.log('Default task types created');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

import { eq } from 'drizzle-orm';
