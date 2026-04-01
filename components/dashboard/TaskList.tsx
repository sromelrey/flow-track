'use client'

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { TaskForm } from '@/components/TaskForm';
import { getTasksByDate, toggleTask } from '@/app/actions/tasks';
import { Task } from '@/lib/types';
import { toast } from 'sonner';

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
  
  // Calculate completed tasks
  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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

  const handleToggleTask = async (taskId: string) => {
    const result = await toggleTask(taskId);
    
    if (result.success) {
      // Update the task in local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, completed: !task.completed }
            : task
        )
      );
      
      const task = tasks.find(t => t.id === taskId);
      if (task?.completed) {
        toast.success('✅ Task completed!');
      } else {
        toast.success('Task marked as incomplete');
      }
    } else {
      toast.error(result.error || 'Failed to update task');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Tasks</h3>
      
      {/* Task Form */}
      <div className="mb-6">
        <TaskForm onTaskCreated={handleTaskCreated} />
      </div>
      
      {/* Task Count and Progress */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-500">
          {completedCount}/{totalCount} tasks completed
        </div>
        {totalCount > 0 && (
          <div className="text-sm font-medium text-green-600">
            {completionPercentage}%
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      )}
      
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
              onClick={() => handleToggleTask(task.id)}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                task.completed 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm'
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleTask(task.id);
                }}
                className={`shrink-0 w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {task.completed && <Check className="w-3 h-3 text-white" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium select-none ${
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
            📋 Daily task limit reached (5/5). Great job staying focused!
          </p>
        </div>
      )}
    </div>
  );
}
