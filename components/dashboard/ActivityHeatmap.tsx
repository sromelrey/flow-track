'use client'

import { useDashboardStore } from '@/store/dashboardStore';
import { getActivityIntensity, calculateStreak } from '@/lib/dateUtils';
import { Flame, TrendingUp, Calendar } from 'lucide-react';

export function ActivityHeatmap() {
  const { activityData } = useDashboardStore();

  // Group data by weeks for the grid layout (7 columns x 5 rows = 35 days)
  const weeks = [];
  const sortedData = [...activityData].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  for (let i = 0; i < sortedData.length; i += 7) {
    weeks.push(sortedData.slice(i, i + 7));
  }

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const currentStreak = calculateStreak(activityData);
  const totalActivities = activityData.reduce((sum, day) => sum + day.count, 0);
  const averageActivities = Math.round(totalActivities / activityData.length);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Activity Heatmap</h3>
          <p className="text-sm text-gray-500 mt-1">Your activity over the last 30 days</p>
        </div>
      </div>

   
      {/* Activity Grid */}
 <div className="space-y-4 flex flex-row items-center justify-between gap-4">
  <div>
        <div className="flex justify-center mb-4">
          <div className="flex space-x-1">
            {weekDays.map((day, index) => (
              <div key={index} className="text-xs text-gray-500 w-8 text-center">
                {day}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {weeks.map((week, weekIndex) => {
            return (
              <div key={weekIndex} className="flex justify-center">
                {/* Activity days */}
                <div className="flex space-x-1">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const activity = week[dayIndex];
                    const intensity = activity ? getActivityIntensity(activity.count) : 'bg-gray-200';
                    const dayNumber = activity ? activity.date.getDate() : '';
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`w-8 h-8 rounded-sm ${intensity} hover:ring-2 hover:ring-gray-400 transition-all cursor-pointer flex items-center justify-center`}
                        title={activity ? `${activity.date.toLocaleDateString()}: ${activity.count} activities` : 'No data'}
                      >
                        <span className="text-xs font-medium text-gray-700">{dayNumber}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500">Less</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
          </div>
          <span className="text-xs text-gray-500">More</span>
        </div>
        </div>

           {/* Stats Section */}
      <div className="flex flex-col flex-wrap sm:flex-row gap-4 mb-6">
        <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg flex-1">
          <Flame className="h-6 w-6 text-orange-500" />
          <div>
            <div className="text-2xl font-bold text-orange-700">{currentStreak}</div>
            <div className="text-sm text-orange-600">Current Streak</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg flex-1">
          <TrendingUp className="h-6 w-6 text-green-500" />
          <div>
            <div className="text-2xl font-bold text-green-700">{totalActivities}</div>
            <div className="text-sm text-green-600">Total Activities</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg flex-1">
          <Calendar className="h-6 w-6 text-blue-500" />
          <div>
            <div className="text-2xl font-bold text-blue-700">{averageActivities}</div>
            <div className="text-sm text-blue-600">Daily Average</div>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
}
