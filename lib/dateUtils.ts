export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const calculateStreak = (activityData: { date: Date; count: number }[]): number => {
  if (activityData.length === 0) return 0;
  
  const sortedData = [...activityData].sort((a, b) => b.date.getTime() - a.date.getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const activity of sortedData) {
    const activityDate = new Date(activity.date);
    activityDate.setHours(0, 0, 0, 0);
    
    if (activityDate.getTime() === currentDate.getTime() && activity.count > 0) {
      streak++;
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    } else if (activityDate.getTime() < currentDate.getTime()) {
      break;
    }
  }
  
  return streak;
};

export const getActivityIntensity = (count: number): string => {
  if (count === 0) return 'bg-gray-200';
  if (count <= 2) return 'bg-green-200';
  if (count <= 4) return 'bg-green-300';
  if (count <= 6) return 'bg-green-400';
  if (count <= 8) return 'bg-green-500';
  return 'bg-green-600';
};
