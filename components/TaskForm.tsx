'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createTask, getTaskTypes } from '@/app/actions/tasks';
import { TaskType } from '@/lib/types';
import { toast } from 'sonner';

interface TaskFormProps {
  onTaskCreated: () => void;
  taskCount?: number;
  className?: string;
}

export function TaskForm({ onTaskCreated, taskCount = 0, className }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  
  const isAtLimit = taskCount >= 5;

  // Load task types on mount
  useEffect(() => {
    const loadTaskTypes = async () => {
      try {
        console.log('Starting to load task types...');
        console.log('getTaskTypes function:', typeof getTaskTypes);
        
        const types = await getTaskTypes();
        console.log('Loaded task types:', types);
        console.log('Types length:', types.length);
        
        setTaskTypes(types);
        // Set default type after loading
        if (types.length > 0) {
          console.log('Setting default type to:', types[0].id);
          setSelectedTypeId(types[0].id);
        } else {
          console.error('No task types loaded!');
        }
      } catch (error) {
        console.error('Error loading task types:', error);
        toast.error('Failed to load task types');
        // Fallback: set some default types
        const fallbackTypes = [
          { id: '1', userId: null, name: 'Dev', color: '#3B82F6', createdAt: new Date() },
          { id: '2', userId: null, name: 'Family', color: '#8B5CF6', createdAt: new Date() },
          { id: '3', userId: null, name: 'Health', color: '#10B981', createdAt: new Date() },
          { id: '4', userId: null, name: 'Personal', color: '#F59E0B', createdAt: new Date() },
        ];
        setTaskTypes(fallbackTypes);
        setSelectedTypeId(fallbackTypes[0].id);
      }
    };
    loadTaskTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAtLimit) {
      toast.error('Daily task limit reached (5 tasks)');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    
    if (!selectedTypeId) {
      toast.error('Please select a task type');
      return;
    }

    setIsSubmitting(true);

    const result = await createTask({
      title: title.trim(),
      taskDate: new Date(), // Default to today
      typeId: selectedTypeId,
    });

    if (result.success) {
      setTitle('');
      const taskTypeName = taskTypes.find(t => t.id === selectedTypeId)?.name || 'Task';
      toast.success(`✅ ${taskTypeName} task created successfully!`);
      onTaskCreated?.();
    } else {
      toast.error(result.error?.message || 'Failed to create task');
    }

    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAtLimit ? "Daily limit reached (5/5)" : "Add a task... (Press Enter)"}
            maxLength={100}
            disabled={isSubmitting || isAtLimit}
            className={`text-base ${isAtLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {isAtLimit && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs text-gray-500 bg-white px-2">5/5 tasks</span>
            </div>
          )}
        </div>
        
        <Select 
          value={selectedTypeId} 
          onValueChange={setSelectedTypeId}
          disabled={isAtLimit}
        >
          <SelectTrigger className={`w-[140px] ${isAtLimit ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <SelectValue placeholder="Type">
              {selectedTypeId && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: taskTypes.find((t) => t.id === selectedTypeId)?.color ?? ''
                    }}
                  />
                  <span className="text-sm">
                    {taskTypes.find((t) => t.id === selectedTypeId)?.name ?? ''}
                  </span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {taskTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  {type.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          type="submit" 
          size="sm"
          disabled={isSubmitting || !title.trim() || !selectedTypeId || isAtLimit}
          className={isAtLimit ? 'opacity-50 cursor-not-allowed' : ''}
          title={isAtLimit ? 'Daily limit reached (5 tasks)' : 'Add task'}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
