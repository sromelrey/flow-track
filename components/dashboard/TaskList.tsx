'use client'

import { useDashboardStore } from '@/store/dashboardStore';
import { Check } from 'lucide-react';

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Work':
      return 'bg-orange-100 text-orange-800';
    case 'Dev':
      return 'bg-blue-100 text-blue-800';
    case 'Family':
      return 'bg-purple-100 text-purple-800';
    case 'Health':
      return 'bg-green-100 text-green-800';
    case 'Personal':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function TaskList() {
  const { tasks, toggleTask } = useDashboardStore();

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Tasks</h3>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center p-3 rounded-lg border ${
              task.completed 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-white border-gray-300 hover:border-gray-400'
            } transition-all`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`shrink-0 w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                task.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {task.completed && <Check className="w-3 h-3 text-white" />}
            </button>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}>
                {task.title}
              </p>
            </div>
            
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
              {task.category}
            </span>
          </div>
        ))}
      </div>
      
      {tasks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No tasks for today</p>
        </div>
      )}
    </div>
  );
}
