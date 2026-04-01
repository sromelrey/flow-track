'use client'

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { TaskForm } from '@/components/TaskForm';
import { getTasksByDate } from '@/app/actions/tasks';
import { Task } from '@/lib/types';

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    setLoading(true);
    const today = new Date();
    const tasksData = await getTasksByDate(today);
    setTasks(tasksData);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadTasksAsync = async () => {
      setLoading(true);
      const today = new Date();
      const tasksData = await getTasksByDate(today);
      if (isMounted) {
        // Transform the data to match Task interface
        const transformedTasks = tasksData.map(task => ({
          ...task,
          completed: task.completed ?? false, // Convert null to false
          taskDate: new Date(task.taskDate), // Convert string to Date
          createdAt: task.createdAt ?? new Date(), // Convert null to Date
          updatedAt: task.updatedAt ?? new Date(), // Convert null to Date
        }));
        setTasks(transformedTasks);
        setLoading(false);
      }
    };
    
    loadTasksAsync();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTaskCreated = () => {
    loadTasks();
  };

  const toggleTask = async (taskId: string) => {
    // TODO: Implement toggle functionality
    console.log('Toggle task:', taskId);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Tasks</h3>
      
      {/* Task Form */}
      <div className="mb-6">
        <TaskForm onTaskCreated={handleTaskCreated} />
      </div>
      
      {/* Task Count */}
      <div className="text-sm text-gray-500 mb-3">
        {tasks.length}/5 tasks
      </div>
      
      {/* Tasks List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        ) : (
          tasks.map((task) => (
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
              
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                task.taskType ? '' : getCategoryColor('Personal')
              }`} style={{
                backgroundColor: task.taskType ? `${task.taskType.color}20` : undefined,
                color: task.taskType ? task.taskType.color : undefined
              }}>
                {task.taskType?.name || 'Personal'}
              </span>
            </div>
          ))
        )}
      </div>
      
      {!loading && tasks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No tasks for today. Add one above!</p>
        </div>
      )}
      
      {!loading && tasks.length >= 5 && (
        <div className="text-center py-4">
          <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
            Daily task limit reached (5/5)
          </p>
        </div>
      )}
    </div>
  );
}
