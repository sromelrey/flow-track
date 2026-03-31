import { create } from 'zustand';
import { Task, ActivityData, DashboardStore } from '@/types';

// Generate mock activity data for the last 30 days
const generateMockActivityData = (): ActivityData[] => {
  const data: ActivityData[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date,
      count: Math.floor(Math.random() * 10) + 1
    });
  }
  
  return data;
};

// Generate mock tasks
const generateMockTasks = (): Task[] => [
  {
    id: '1',
    title: 'Complete dashboard UI',
    category: 'Dev',
    completed: true,
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Review pull requests',
    category: 'Dev',
    completed: true,
    createdAt: new Date()
  },
  {
    id: '3',
    title: 'Family dinner',
    category: 'Family',
    completed: true,
    createdAt: new Date()
  },
  {
    id: '4',
    title: 'Evening walk',
    category: 'Health',
    completed: true,
    createdAt: new Date()
  },
  {
    id: '5',
    title: 'Read for 30 minutes',
    category: 'Personal',
    completed: false,
    createdAt: new Date()
  }
];

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  tasks: generateMockTasks(),
  activityData: generateMockActivityData(),
  progressData: {
    daily: 80,
    weekly: 65,
    monthly: 72
  },
  currentStreak: 3,

  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    set((state) => ({
      tasks: [...state.tasks, newTask]
    }));
    
    get().updateProgress();
  },

  toggleTask: (id) => {
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
    
    get().updateProgress();
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter(task => task.id !== id)
    }));
    
    get().updateProgress();
  },

  updateProgress: () => {
    const { tasks } = get();
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const dailyProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    set((state) => ({
      progressData: {
        ...state.progressData,
        daily: dailyProgress
      }
    }));
  }
}));
