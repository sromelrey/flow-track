import { db } from '@/lib/db';
import { taskTypes } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  try {
    // Check if default task types already exist
    const existingTypes = await db
      .select()
      .from(taskTypes)
      .where(eq(taskTypes.userId, null as unknown as string | null));

    // Only seed if we have fewer than 4 types
    if (existingTypes.length < 4) {
      // Insert default task types with ON CONFLICT DO NOTHING
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

      console.log('Default task types seeded successfully');
    } else {
      console.log('Default task types already exist');
    }
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}
