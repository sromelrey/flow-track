'use client'

import { useDashboardStore } from '@/store/dashboardStore';
import { calculateStreak } from '@/lib/dateUtils';
import { Flame, TrendingUp, Calendar } from 'lucide-react';

export function ActivityStats() {
  const { activityData } = useDashboardStore();
  
  const currentStreak = calculateStreak(activityData);
  const totalActivities = activityData.reduce((sum, day) => sum + day.count, 0);
  const averageActivities = Math.round(totalActivities / activityData.length);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Stats</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
          <Flame className="h-6 w-6 text-orange-500" />
          <div>
            <div className="text-2xl font-bold text-orange-700">{currentStreak}</div>
            <div className="text-sm text-orange-600">Current Streak</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <TrendingUp className="h-6 w-6 text-green-500" />
          <div>
            <div className="text-2xl font-bold text-green-700">{totalActivities}</div>
            <div className="text-sm text-green-600">Total Activities</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <Calendar className="h-6 w-6 text-blue-500" />
          <div>
            <div className="text-2xl font-bold text-blue-700">{averageActivities}</div>
            <div className="text-sm text-blue-600">Daily Average</div>
          </div>
        </div>
      </div>
    </div>
  );
}
