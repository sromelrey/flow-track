export interface Task {
  id: string;
  title: string;
  category: 'Dev' | 'Family' | 'Health' | 'Personal';
  completed: boolean;
  createdAt: Date;
}

export interface ActivityData {
  date: Date;
  count: number;
}

export interface ProgressData {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface DashboardStore {
  tasks: Task[];
  activityData: ActivityData[];
  progressData: ProgressData;
  currentStreak: number;
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateProgress: () => void;
}
